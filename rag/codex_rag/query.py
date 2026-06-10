"""Una pregunta -> respuesta GraphRAG en JSON (para que la consuma la API Node).

    python -m codex_rag.query "¿Cómo juego Scout Rush con Georgianos?"
"""

from __future__ import annotations

import argparse
import json

from .pipeline import answer


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.query")
    ap.add_argument("question")
    ap.add_argument("-k", type=int, default=6)
    args = ap.parse_args(argv)

    res = answer(args.question, k=args.k)
    print(json.dumps(
        {
            "text": res.text,
            "sources": res.sources,
            "abstained": res.abstained,
            "max_score": round(res.max_score, 3),
            "related": [r["title"] for r in res.related],
        },
        ensure_ascii=False,
    ))


if __name__ == "__main__":
    main()
