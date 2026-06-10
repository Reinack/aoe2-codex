"""Construye el índice vectorial: vault -> chunks -> embeddings -> Neo4j.

    python -m codex_rag.build          # incremental (solo notas cambiadas)
    python -m codex_rag.build --full   # reembebe todo
"""

from __future__ import annotations

import argparse
import json

from codex.config import MANIFEST_PATH, Config
from codex.parser import parse_note
from codex.scanner import compute_diff, scan_vault

from .chunker import chunk_hash, chunk_text, embed_input
from .ollama_client import Ollama
from .store import RagStore

RAG_MANIFEST = MANIFEST_PATH.parent / "rag_manifest.json"
BATCH = 32

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


def _embed_all(ollama: Ollama, inputs: list[str]) -> list[list[float]]:
    out: list[list[float]] = []
    for i in range(0, len(inputs), BATCH):
        out.extend(ollama.embed_batch(inputs[i : i + BATCH]))
    return out


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.build", description=__doc__)
    ap.add_argument("--full", action="store_true", help="reembebe todo")
    ap.add_argument("--vault", help="override de VAULT_PATH")
    args = ap.parse_args(argv)

    cfg = Config.load(vault_override=args.vault)
    ollama = Ollama(cfg.ollama_host, cfg.ollama_embed_model, cfg.ollama_chat_model)

    entries = scan_vault(cfg.vault_path, cfg.exclude_dirs)
    diff = compute_diff(entries, _load_manifest(), full=args.full)
    print(f"[scan] {len(entries)} notas  |  [diff] {diff.summary()}")

    with RagStore(cfg.neo4j_uri, cfg.neo4j_user, cfg.neo4j_password) as store:
        store.ensure_index(dim=1024)

        # Fix 2: purgar chunks de notas excluidas (corre siempre, aun en no-op)
        purged = 0
        for relpath in entries:
            if is_excluded(relpath):
                store.delete_note_chunks(relpath)
                purged += 1
        if purged:
            print(f"[skip] {purged} notas índice/tabla fuera del índice")

        if not diff.touched and not diff.deleted:
            print("[rag] índice en sincronía. Nada que reembeber.")
            return

        for relpath in diff.deleted:
            store.delete_note_chunks(relpath)
        if diff.deleted:
            print(f"[del] chunks de {len(diff.deleted)} notas eliminados")

        total_chunks = 0
        for idx, relpath in enumerate(diff.touched, 1):
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
            embeddings = _embed_all(ollama, inputs)
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
            if idx % 25 == 0 or idx == len(diff.touched):
                print(f"[emb] {idx}/{len(diff.touched)} notas  "
                      f"({total_chunks} chunks)")

        _save_manifest(entries)
        s = store.stats()
        print(f"[ok] índice: {s['chunks']} chunks de {s['notes']} notas")


if __name__ == "__main__":
    main()
