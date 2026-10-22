"""Pregunta al Codex por GraphRAG.

    python -m codex.ask "¿Cómo juego Scout Rush con Georgians?"
    python -m codex.ask --retrieve-only "..."   # solo muestra chunks recuperados
"""

from __future__ import annotations

import argparse
import sys

from .config import Config
from .rag import CodexRAG


def main(argv: list[str] | None = None) -> None:
    # La consola de Windows (cp1252) no imprime caracteres como '→'; forzar UTF-8
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except Exception:  # noqa: BLE001
            pass
    ap = argparse.ArgumentParser(prog="codex.ask", description=__doc__)
    ap.add_argument("question", help="la pregunta")
    ap.add_argument("-k", type=int, default=6, help="chunks a recuperar (default 6)")
    ap.add_argument(
        "--retrieve-only", action="store_true",
        help="no llama al LLM; muestra los chunks recuperados",
    )
    args = ap.parse_args(argv)

    cfg = Config.load()
    rag = CodexRAG(cfg)
    try:
        if args.retrieve_only:
            for i, c in enumerate(rag.retrieve(args.question, args.k), 1):
                print(f"\n[{i}] {c['path']}  ·  {c['heading']}  (score {c['score']:.3f})")
                print(c["text"][:300].replace("\n", " ") + "...")
            return

        ans = rag.ask(args.question, args.k)
        print("\n" + "=" * 70)
        print(ans.text)
        print("=" * 70)
        print("Fuentes:")
        for src in ans.sources:
            print(f"  - {src}")
    finally:
        rag.close()


if __name__ == "__main__":
    main()
