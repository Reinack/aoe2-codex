"""Construye el índice vectorial: vault -> chunks -> embeddings -> Neo4j.

    python -m codex_rag.build          # incremental (solo notas cambiadas)
    python -m codex_rag.build --full   # reembebe todo
"""

from __future__ import annotations

import argparse
import json
import os
import time

from codex.config import MANIFEST_PATH, Config
from codex.parser import parse_note
from codex.scanner import compute_diff, scan_vault

from .chunker import chunk_hash, chunk_text, embed_input
from .llm import make_llm
from .store import RagStore

RAG_MANIFEST = MANIFEST_PATH.parent / "rag_manifest.json"
# Configurables por env (Gemini necesita batch chico + pacing por el RPM del free
# tier; ambos proveedores necesitan truncar secciones gigantes que exceden el
# límite de tokens del modelo de embeddings).
BATCH = int(os.environ.get("EMBED_BATCH", "32"))
EMBED_SLEEP = float(os.environ.get("EMBED_SLEEP", "0"))

# Fix 2: notas índice/tabla que contaminan el retrieval (matchean demasiadas
# queries con asociaciones equivocadas). No se embeben.
TABLE_NOTES = {
    "buildings/other/mining-camp.md",
    "buildings/other/lumber-camp.md",
}


def is_excluded(relpath: str) -> bool:
    """True si la nota es navegación (index) o una tabla-resumen contaminante."""
    name = relpath.rsplit("/", 1)[-1]
    return name == "index.md" or relpath in TABLE_NOTES


def _load_manifest() -> dict[str, str]:
    if RAG_MANIFEST.exists():
        return json.loads(RAG_MANIFEST.read_text(encoding="utf-8"))
    return {}


def _save_manifest(entries) -> None:
    RAG_MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    data = {rel: e.sha1 for rel, e in sorted(entries.items())}
    RAG_MANIFEST.write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def _embed_all(llm, inputs: list[str], max_chars: int) -> list[list[float]]:
    # Truncar secciones gigantes (exceden el contexto del modelo y rompen el embed).
    inputs = [t[:max_chars] for t in inputs]
    out: list[list[float]] = []
    for i in range(0, len(inputs), BATCH):
        out.extend(llm.embed_batch(inputs[i : i + BATCH]))
        if EMBED_SLEEP and i + BATCH < len(inputs):
            time.sleep(EMBED_SLEEP)
    return out


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.build", description=__doc__)
    ap.add_argument("--full", action="store_true", help="reembebe todo")
    ap.add_argument("--resume", action="store_true",
                    help="reembebe solo notas SIN chunks (reanuda un build cortado)")
    ap.add_argument("--vault", help="override de VAULT_PATH")
    args = ap.parse_args(argv)

    # Consola Windows (cp1252) rompe con caracteres no-ASCII en los prints.
    try:
        import sys
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:  # noqa: BLE001
        pass

    cfg = Config.load(vault_override=args.vault)
    llm = make_llm(cfg)
    # Truncado por límite de tokens del embedder: bge-m3 ~8192 tok (~20k chars),
    # gemini-embedding-001 ~2048 tok (~6k chars). Override con EMBED_MAX_CHARS.
    default_max = 6000 if cfg.llm_provider == "gemini" else 20000
    max_chars = int(os.environ.get("EMBED_MAX_CHARS", default_max))
    print(f"[llm] proveedor={cfg.llm_provider}  embed_dim={cfg.embed_dim}  "
          f"batch={BATCH}  max_chars={max_chars}")

    entries = scan_vault(cfg.vault_path, cfg.exclude_dirs)
    diff = compute_diff(entries, _load_manifest(), full=args.full)
    print(f"[scan] {len(entries)} notas  |  [diff] {diff.summary()}")

    with RagStore(cfg.neo4j_uri, cfg.neo4j_user, cfg.neo4j_password) as store:
        store.ensure_index(dim=cfg.embed_dim)

        # Fix 2: purgar chunks de notas excluidas (corre siempre, aun en no-op)
        purged = 0
        for relpath in entries:
            if is_excluded(relpath):
                store.delete_note_chunks(relpath)
                purged += 1
        if purged:
            print(f"[skip] {purged} notas índice/tabla fuera del índice")

        # --resume: reembeber solo lo que falta en el índice (reanuda cortes de cuota).
        if args.resume:
            done = store.notes_with_chunks()
            touched = [r for r in sorted(entries)
                       if not is_excluded(r) and r not in done]
            deleted: list[str] = []
            print(f"[resume] {len(done)} notas ya indexadas, faltan {len(touched)}")
        else:
            touched, deleted = list(diff.touched), list(diff.deleted)

        if not touched and not deleted:
            print("[rag] índice en sincronía. Nada que reembeber.")
            return

        for relpath in deleted:
            store.delete_note_chunks(relpath)
        if deleted:
            print(f"[del] chunks de {len(deleted)} notas eliminados")

        total_chunks = 0
        done_notes = 0
        try:
            for idx, relpath in enumerate(touched, 1):
                if is_excluded(relpath):
                    continue
                entry = entries[relpath]
                raw = entry.abspath.read_text(encoding="utf-8-sig")
                pnote = parse_note(entry.abspath, relpath)
                title = pnote.title
                aliases = pnote.props.get("aliases")   # alias ES/MX del frontmatter
                chunks = chunk_text(raw, title)
                if not chunks:
                    store.delete_note_chunks(relpath)
                    continue
                inputs = [
                    embed_input(title, c["heading"], c["text"], aliases) for c in chunks
                ]
                embeddings = _embed_all(llm, inputs, max_chars)
                payload = [
                    {
                        "id": f"{relpath}::{c['ord']}",
                        "ord": c["ord"], "heading": c["heading"], "text": c["text"],
                        "hash": chunk_hash(c["text"]), "embedding": emb,
                    }
                    for c, emb in zip(chunks, embeddings)
                ]
                store.delete_note_chunks(relpath)   # ords pueden cambiar -> recrear
                store.upsert_chunks(relpath, payload)
                total_chunks += len(payload)
                done_notes = idx
                if idx % 25 == 0 or idx == len(touched):
                    print(f"[emb] {idx}/{len(touched)} notas  "
                          f"({total_chunks} chunks)")
        except Exception as e:  # noqa: BLE001
            # Cada nota se persiste apenas se embebe → lo hecho queda guardado.
            print(f"[corte] {done_notes}/{len(touched)} notas hechas. "
                  f"Reanudá con: python -m codex_rag.build --resume\n  causa: {e}")
            raise

        # Manifest solo si se procesó todo (incremental confiable la próxima).
        if not args.resume or done_notes == len(touched):
            _save_manifest(entries)
        s = store.stats()
        print(f"[ok] índice: {s['chunks']} chunks de {s['notes']} notas")


if __name__ == "__main__":
    main()
