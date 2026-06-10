"""Métricas de red sobre el grafo de conocimiento.

Funciones puras: reciben un nx.DiGraph y devuelven DataFrames de pandas.
Cubren centralidad, comunidades, nodos aislados y las preguntas del dominio.
"""

from __future__ import annotations

import networkx as nx
import pandas as pd

# Carpetas a ignorar al buscar "conocimiento aislado" (no son notas de contenido)
NAV_TYPES = {"root", "resources"}


def _title(g: nx.DiGraph, node: str) -> str:
    return g.nodes[node].get("title", node)


def _type(g: nx.DiGraph, node: str) -> str:
    return g.nodes[node].get("type", "unknown")


# --------------------------------------------------------------------------- #
# Visión general                                                              #
# --------------------------------------------------------------------------- #
def overview(g: nx.DiGraph) -> dict:
    ug = g.to_undirected()
    components = list(nx.connected_components(ug))
    return {
        "nodos": g.number_of_nodes(),
        "aristas": g.number_of_edges(),
        "densidad": nx.density(g),
        "componentes": len(components),
        "comp_mayor": max((len(c) for c in components), default=0),
        "grado_medio": (
            sum(d for _, d in g.degree()) / g.number_of_nodes()
            if g.number_of_nodes()
            else 0
        ),
    }


# --------------------------------------------------------------------------- #
# Centralidad                                                                 #
# --------------------------------------------------------------------------- #
def pagerank(g: nx.DiGraph, top: int = 25, type_filter: str | None = None) -> pd.DataFrame:
    """PageRank = influencia estructural (qué notas son referencia de referencias)."""
    pr = nx.pagerank(g)
    rows = [
        {
            "nota": n,
            "título": _title(g, n),
            "tipo": _type(g, n),
            "pagerank": round(score, 5),
            "inbound": g.in_degree(n),
        }
        for n, score in pr.items()
        if type_filter is None or _type(g, n) == type_filter
    ]
    df = pd.DataFrame(rows).sort_values("pagerank", ascending=False)
    return df.head(top).reset_index(drop=True)


def betweenness(g: nx.DiGraph, top: int = 25) -> pd.DataFrame:
    """Intermediación = nodos 'puente' que conectan zonas distintas del saber."""
    bc = nx.betweenness_centrality(g)
    rows = [
        {"nota": n, "título": _title(g, n), "tipo": _type(g, n),
         "betweenness": round(v, 5)}
        for n, v in bc.items()
    ]
    df = pd.DataFrame(rows).sort_values("betweenness", ascending=False)
    return df.head(top).reset_index(drop=True)


# --------------------------------------------------------------------------- #
# Comunidades (Louvain sobre la proyección no dirigida)                       #
# --------------------------------------------------------------------------- #
def communities(g: nx.DiGraph, top_members: int = 6) -> pd.DataFrame:
    ug = g.to_undirected()
    comms = nx.community.louvain_communities(ug, seed=42)
    pr = nx.pagerank(g)
    rows = []
    for i, comm in enumerate(sorted(comms, key=len, reverse=True)):
        members = sorted(comm, key=lambda n: pr.get(n, 0), reverse=True)
        # tipo dominante de la comunidad
        types = pd.Series([_type(g, n) for n in comm]).value_counts()
        rows.append({
            "comunidad": i,
            "tamaño": len(comm),
            "tipo_dominante": types.index[0] if len(types) else "—",
            "miembros_clave": ", ".join(_title(g, n) for n in members[:top_members]),
        })
    return pd.DataFrame(rows)


# --------------------------------------------------------------------------- #
# Conocimiento aislado                                                        #
# --------------------------------------------------------------------------- #
def isolated(g: nx.DiGraph, top: int = 40) -> pd.DataFrame:
    """Notas de contenido sin enlaces entrantes: saber que nadie referencia."""
    rows = [
        {"nota": n, "título": _title(g, n), "tipo": _type(g, n),
         "outbound": g.out_degree(n)}
        for n in g.nodes
        if g.in_degree(n) == 0 and _type(g, n) not in NAV_TYPES
    ]
    df = pd.DataFrame(rows).sort_values(["tipo", "título"])
    return df.head(top).reset_index(drop=True)


# --------------------------------------------------------------------------- #
# Preguntas del dominio                                                       #
# --------------------------------------------------------------------------- #
def _inbound_from_type(g: nx.DiGraph, target_type: str, source_type: str,
                       top: int, col: str) -> pd.DataFrame:
    """Para cada nodo de target_type, cuenta predecesores de source_type."""
    rows = []
    for n in g.nodes:
        if _type(g, n) != target_type:
            continue
        sources = [p for p in g.predecessors(n) if _type(g, p) == source_type]
        if sources:
            rows.append({
                "nota": n, "título": _title(g, n), col: len(sources),
            })
    df = pd.DataFrame(rows)
    if df.empty:
        return df
    return df.sort_values(col, ascending=False).head(top).reset_index(drop=True)


def units_in_strategies(g: nx.DiGraph, top: int = 20) -> pd.DataFrame:
    """¿Qué unidades aparecen en más estrategias?"""
    return _inbound_from_type(g, "units", "strategies", top, "estrategias")


def techs_connecting_civs(g: nx.DiGraph, top: int = 20) -> pd.DataFrame:
    """¿Qué tecnologías conectan más civilizaciones?"""
    return _inbound_from_type(g, "technologies", "civs", top, "civs")


def player_influence(g: nx.DiGraph, top: int = 20) -> pd.DataFrame:
    """¿Qué jugadores influyen más? (referencias entrantes + PageRank)"""
    pr = nx.pagerank(g)
    rows = [
        {"jugador": _title(g, n), "referencias": g.in_degree(n),
         "pagerank": round(pr.get(n, 0), 5)}
        for n in g.nodes
        if _type(g, n) == "players"
    ]
    df = pd.DataFrame(rows)
    if df.empty:
        return df
    return df.sort_values("referencias", ascending=False).head(top).reset_index(drop=True)
