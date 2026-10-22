"""Chat GraphRAG por consola.

    python -m codex_rag.chat "¿Cómo juego Scout Rush con Georgians?"
    python -m codex_rag.chat            # modo interactivo
"""

from __future__ import annotations

import argparse

from codex.config import Config

from .pipeline import answer


def _ask(cfg: Config, question: str, k: int) -> None:
    print(f"\n❓ {question}\n")
    res = answer(question, cfg=cfg, k=k)
    print(res.text)
    if res.abstained:
        print("\n⚠️  Abstención: ningún chunk superó el umbral de relevancia.")
        return
    print(f"\n📚 Fuentes (mejor score {res.max_score:.3f}):")
    for s in res.sources:
        print(f"  - {s}")


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.chat", description=__doc__)
    ap.add_argument("question", nargs="*", help="pregunta (vacío = interactivo)")
    ap.add_argument("-k", type=int, default=6, help="chunks a recuperar")
    args = ap.parse_args(argv)
    cfg = Config.load()

    if args.question:
        _ask(cfg, " ".join(args.question), args.k)
        return

    print("Chat GraphRAG AoE2 — Ctrl+C para salir.")
    try:
        while True:
            q = input("\n> ").strip()
            if q:
                _ask(cfg, q, args.k)
    except (KeyboardInterrupt, EOFError):
        print("\nChau.")


if __name__ == "__main__":
    main()
