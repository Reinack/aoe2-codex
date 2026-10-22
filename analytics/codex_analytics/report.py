"""Reporte de analítica por consola (verificación rápida sin Streamlit).

    python -m codex_analytics.report
"""

from __future__ import annotations

from . import metrics
from .loader import load_graph


def _print_df(title: str, df, n: int = 10) -> None:
    print(f"\n=== {title} ===")
    if df is None or df.empty:
        print("(sin datos)")
        return
    print(df.head(n).to_string(index=False))


def main() -> None:
    g = load_graph()
    ov = metrics.overview(g)
    print("=== Visión general del grafo ===")
    print(
        f"nodos={ov['nodos']}  aristas={ov['aristas']}  "
        f"densidad={ov['densidad']:.4f}  grado_medio={ov['grado_medio']:.2f}"
    )
    print(
        f"componentes={ov['componentes']}  "
        f"(mayor cubre {ov['comp_mayor']}/{ov['nodos']} nodos)"
    )

    _print_df("Top influencia (PageRank)", metrics.pagerank(g, top=10))
    _print_df("Nodos puente (betweenness)", metrics.betweenness(g, top=10))
    _print_df("¿Qué unidades aparecen en más estrategias?",
              metrics.units_in_strategies(g))
    _print_df("¿Qué tecnologías conectan más civilizaciones?",
              metrics.techs_connecting_civs(g))
    _print_df("¿Qué jugadores influyen más en el meta?",
              metrics.player_influence(g))
    _print_df("Comunidades detectadas (Louvain)", metrics.communities(g), n=12)

    iso = metrics.isolated(g)
    print(f"\n=== Conocimiento aislado: {0 if iso is None else len(iso)} notas "
          f"sin enlaces entrantes ===")
    _print_df("Muestra de notas aisladas", iso, n=12)


if __name__ == "__main__":
    main()
