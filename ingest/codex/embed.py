"""Genera/actualiza embeddings de los chunks del vault en Neo4j.

    python -m codex.embed          # selectivo: solo notas con cuerpo cambiado
    python -m codex.embed --full   # re-embeber todo

Requiere que 'codex.sync' haya corrido antes (los nodos Note deben existir).
"""

from __future__ import annotations

import argparse
import hashlib

import frontmatter

from .chunking import chunk_note
from .config import Config
from .graph import CodexGraph
from .ollama_client import OllamaClient


def _body_of(abspath) -> str:
    text = abspath.read_text(encoding="utf-8-sig")
    return frontmatter.loads(text).content


def _hash(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def run_embed(cfg: Config, *, full: bool = False) -> None:
    from .parser import parse_note
    from .scanner import scan_vault

    entries = scan_vault(cfg.vault_path, cfg.exclude_dirs)
    ollama = OllamaClient(
        cfg.ollama_host, cfg.ollama_embed_model, cfg.ollama_chat_model
    )

    # dimensión del modelo de embeddings (probe con un texto)
    dim = len(ollama.embed_one("probe"))
    print(f"[embed] modelo={cfg.ollama_embed_model} dim={dim}")

    with CodexGraph(cfg.neo4j_uri, cfg.neo4j_user, cfg.neo4j_password) as g:
        g.verify()
        if full:
            g.reset_vector_index(dim)  # recrea índice (maneja cambio de modelo/dim)
        else:
            g.ensure_vector_index(dim)
        prev = {} if full else g.get_embed_hashes()

        changed = 0
        skipped = 0
        total_chunks = 0
        dropped = 0
        for relpath, entry in entries.items():
            body = _body_of(entry.abspath)
            body_hash = _hash(body)
            if not full and prev.get(relpath) == body_hash:
                skipped += 1
                continue

            note = parse_note(entry.abspath, relpath)
            chunks = chunk_note(relpath, note.title, body)
            if not chunks:
                g.replace_chunks(relpath, body_hash, [])
                changed += 1
                continue

            vectors = ollama.embed_documents([c.text for c in chunks])
            payload = []
            for c, vec in zip(chunks, vectors):
                if vec is None:  # chunk rechazado por el modelo -> se descarta
                    dropped += 1
                    continue
                payload.append({
                    "id": c.id, "ordinal": c.ordinal, "heading": c.heading,
                    "text": c.text, "chash": c.chash, "embedding": vec,
                })
            g.replace_chunks(relpath, body_hash, payload)
            total_chunks += len(payload)
            changed += 1
            if changed % 50 == 0:
                print(f"[embed] {changed} notas re-embebidas...")

        s = g.chunk_stats()
        drop_msg = f", {dropped} chunks descartados (rechazados por el modelo)" if dropped else ""
        print(
            f"[ok]   {changed} notas re-embebidas ({total_chunks} chunks nuevos), "
            f"{skipped} sin cambios{drop_msg}. Total: {s['chunks']} chunks "
            f"de {s['embedded_notes']} notas."
        )


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex.embed", description=__doc__)
    ap.add_argument("--full", action="store_true", help="re-embeber todo")
    ap.add_argument("--vault", help="override de VAULT_PATH")
    args = ap.parse_args(argv)
    cfg = Config.load(vault_override=args.vault)
    run_embed(cfg, full=args.full)


if __name__ == "__main__":
    main()
