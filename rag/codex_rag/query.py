"""Una pregunta -> respuesta GraphRAG en JSON (para que la consuma la API Node).

    python -m codex_rag.query "¿Cómo juego Scout Rush con Georgianos?"
"""

from __future__ import annotations

import argparse
import json
import sys

from .pipeline import answer


def main(argv: list[str] | None = None) -> None:
    # La consola Windows (cp1252) rompe al imprimir caracteres no-ASCII (p.ej. el
    # signo menos − de las respuestas). El JSON debe salir en UTF-8.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:  # noqa: BLE001
        pass

    ap = argparse.ArgumentParser(prog="codex_rag.query")
    ap.add_argument("question")
    # k=8: con embeddings de Gemini el boost léxico deja 2 chunks de la civ en
    # 0.99, y con k=6 esos desplazaban a la nota de estrategia -> el modelo se
    # negaba a responder preguntas del tipo "<estrategia> con <civ>".
    ap.add_argument("-k", type=int, default=8)
    args = ap.parse_args(argv)

    res = answer(args.question, k=args.k)
    print(json.dumps(
        {
            "text": res.text,
            "sources": res.sources,
            "abstained": res.abstained,
            "max_score": round(res.max_score, 3),
            "related": [r["title"] for r in res.related],
            "hits_meta": [
                {"note": h["note"], "heading": h["heading"], "score": round(h["score"], 3)}
                for h in res.hits
            ],
        },
        ensure_ascii=False,
    ))


if __name__ == "__main__":
    main()
