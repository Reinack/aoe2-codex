"""GraphRAG: recuperación (vector + grafo) + generación con Ollama."""

from __future__ import annotations

from dataclasses import dataclass

from .config import Config
from .graph import CodexGraph
from .ollama_client import OllamaClient, OllamaHTTPError

SYSTEM_PROMPT = (
    "Sos un asistente experto en Age of Empires II. Respondé SOLO con la "
    "información del CONTEXTO provisto (extractos de una base de conocimiento "
    "personal). Si el contexto no alcanza, decilo explícitamente. Citá las "
    "fuentes con su ruta entre corchetes, p.ej. [civs/Georgians.md]. "
    "Respondé en español, conciso y accionable."
)


@dataclass
class Answer:
    text: str
    sources: list[str]
    chunks: list[dict]


def _build_context(chunks: list[dict]) -> str:
    blocks = []
    for c in chunks:
        related = ", ".join(t for t in (c.get("related") or []) if t)
        rel = f"\n(relacionado: {related})" if related else ""
        blocks.append(f"### [{c['path']}] (score {c['score']:.3f}){rel}\n{c['text']}")
    return "\n\n".join(blocks)


class CodexRAG:
    def __init__(self, cfg: Config):
        self.cfg = cfg
        self.ollama = OllamaClient(
            cfg.ollama_host, cfg.ollama_embed_model, cfg.ollama_chat_model
        )
        self.graph = CodexGraph(cfg.neo4j_uri, cfg.neo4j_user, cfg.neo4j_password)

    def close(self) -> None:
        self.graph.close()

    def retrieve(self, question: str, k: int = 6) -> list[dict]:
        qvec = self.ollama.embed_query(question)
        return self.graph.vector_search(qvec, k)

    def ask(self, question: str, k: int = 6) -> Answer:
        chunks = self.retrieve(question, k)
        if not chunks:
            return Answer(
                "No hay chunks embebidos. Corré 'python -m codex.embed' primero.",
                [], [],
            )
        context = _build_context(chunks)
        user = f"CONTEXTO:\n{context}\n\nPREGUNTA: {question}"
        sources = list(dict.fromkeys(c["path"] for c in chunks))
        try:
            text = self.ollama.chat(SYSTEM_PROMPT, user)
        except (OllamaHTTPError, TimeoutError, OSError) as exc:
            # El LLM local falló: degradar a respuesta extractiva (la recuperación
            # ya es valiosa). El demo nunca queda sin respuesta útil.
            text = self._extractive_fallback(chunks, exc)
        return Answer(text=text, sources=sources, chunks=chunks)

    @staticmethod
    def _extractive_fallback(chunks: list[dict], exc: Exception) -> str:
        lines = [
            f"[!] El modelo de generación no respondió ({type(exc).__name__}). "
            "Mostrando los pasajes más relevantes recuperados:\n",
        ]
        for c in chunks[:5]:
            snippet = c["text"].strip().replace("\n", " ")
            lines.append(f"• [{c['path']}] {c['heading']} (score {c['score']:.3f})")
            lines.append(f"  {snippet[:280]}…\n")
        return "\n".join(lines)
