"""Pipeline GraphRAG: recupera (vector + grafo) y genera respuesta citada."""

from __future__ import annotations

import os
from dataclasses import dataclass

from codex.config import Config

from .llm import make_llm
from .store import RagStore

# Umbral de similitud coseno (bge-m3). bge-m3 comprime el rango: buenas 0.76-0.84,
# ruido 0.74-0.77 -> SE SOLAPAN. Se prioriza recall (no rechazar lo respondible);
# el umbral solo corta el ruido más bajo, y el prompt estricto hace el resto.
# La abstención fina requiere un reranker o un modelo de chat más grande (gemma4/qwen3.5).
MIN_SCORE = float(os.environ.get("RAG_MIN_SCORE", "0.76"))

ABSTAIN = (
    "No tengo información suficiente en el vault para responder eso con confianza. "
    "Puede que esa civilización/unidad/tecnología no esté documentada, o que la "
    "pregunta use un nombre que no aparece en mis notas."
)

SYSTEM = (
    "Sos un coach experto de Age of Empires II. Respondé EXCLUSIVAMENTE con la "
    "información del contexto provisto (viene de una base de conocimiento personal). "
    "Reglas estrictas:\n"
    "- Si el contexto no contiene explícitamente la respuesta al término exacto "
    "preguntado, respondé: 'No tengo eso documentado en el vault.' NO infieras ni "
    "completes con conocimiento general de AoE2.\n"
    "- Nunca inventes números (costos, HP, %). Citá un número SOLO si aparece "
    "literal en el contexto.\n"
    "- Si la pregunta menciona una unidad/tech/civ que no figura en el contexto, "
    "decí que no la encontrás en vez de responder sobre algo parecido.\n"
    "- Citá las fuentes entre corchetes con su ruta, p.ej. [civs/Georgians.md].\n"
    "Respondé en español, conciso y accionable."
)


@dataclass
class Answer:
    text: str
    sources: list[str]
    hits: list[dict]
    related: list[dict]
    abstained: bool = False
    max_score: float = 0.0


def _build_prompt(question: str, hits: list[dict], related: list[dict]) -> str:
    blocks = []
    for h in hits:
        head = f"{h['note']} › {h['heading']}"
        blocks.append(f"[{h['note']}] ({head})\n{h['text']}")
    context = "\n\n---\n\n".join(blocks)

    rel = ""
    if related:
        rel = "\n\nNotas relacionadas en el grafo (para conexiones):\n" + "\n".join(
            f"- {r['title']} ({r['path']})" for r in related
        )

    return (
        f"CONTEXTO:\n{context}{rel}\n\n"
        f"PREGUNTA: {question}\n\n"
        "Respondé citando las fuentes relevantes entre corchetes."
    )


def _lexical_hits(store: RagStore, question: str, max_notes: int = 2) -> list[dict]:
    """Entidades nombradas: si la query contiene un alias/título conocido,
    inyecta los chunks de esa nota (score alto) — robusto al idioma."""
    idx = store.alias_index()
    ql = question.lower()
    matched = [(term, path) for term, path in idx.items()
               if len(term) >= 4 and term in ql]
    matched.sort(key=lambda x: len(x[0]), reverse=True)   # preferir match más largo
    hits: list[dict] = []
    seen: list[str] = []
    for _term, path in matched:
        if path in seen:
            continue
        seen.append(path)
        for c in store.note_chunks(path, limit=2):
            c["score"] = 0.99          # entidad nombrada: grounding fuerte
            hits.append(c)
        if len(seen) >= max_notes:
            break
    return hits


def retrieve(store: RagStore, llm, question: str,
             k: int = 6, min_score: float = MIN_SCORE) -> dict:
    qvec = llm.embed(question)
    vector_hits = store.search(qvec, k=k, min_score=min_score)
    lexical = _lexical_hits(store, question)

    # merge: léxicos primero (entidad nombrada), luego vectoriales; dedup
    hits: list[dict] = []
    seen: set = set()
    for h in lexical + vector_hits:
        key = (h["note"], h["heading"])
        if key not in seen:
            seen.add(key)
            hits.append(h)

    seed_notes = list(dict.fromkeys(h["note"] for h in hits))
    related = store.related_notes(seed_notes) if seed_notes else []
    return {"hits": hits, "seed_notes": seed_notes, "related": related,
            "lexical": len(lexical) > 0}


def answer(question: str, cfg: Config | None = None, k: int = 6,
           min_score: float = MIN_SCORE) -> Answer:
    cfg = cfg or Config.load()
    llm = make_llm(cfg)
    with RagStore(cfg.neo4j_uri, cfg.neo4j_user, cfg.neo4j_password) as store:
        ctx = retrieve(store, llm, question, k=k, min_score=min_score)

    # Fix 1: sin chunks por encima del umbral -> abstención, sin llamar al LLM
    if not ctx["hits"]:
        return Answer(text=ABSTAIN, sources=[], hits=[], related=[],
                      abstained=True, max_score=0.0)

    prompt = _build_prompt(question, ctx["hits"], ctx["related"])
    text = llm.generate(prompt, system=SYSTEM)
    return Answer(
        text=text,
        sources=ctx["seed_notes"],
        hits=ctx["hits"],
        related=ctx["related"],
        max_score=ctx["hits"][0]["score"],
    )
