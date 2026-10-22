"""Analítica de red sobre el grafo del vault (NetworkX + queries Cypher).

Pull del grafo desde Neo4j -> métricas de centralidad, comunidades, nodos
aislados y agregaciones semánticas. Consumido por el dashboard Streamlit.
"""

from __future__ import annotations

import networkx as nx
from neo4j import GraphDatabase

from .config import Config


# --------------------------------------------------------------------------- #
# Carga del grafo
# --------------------------------------------------------------------------- #
def load_digraph(cfg: Config) -> nx.DiGraph:
    """Construye un DiGraph con nodos Note (title/type) y aristas LINKS_TO."""
    driver = GraphDatabase.driver(
        cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password)
    )
    g = nx.DiGraph()
    with driver.session() as s:
        for r in s.run(
            "MATCH (n:Note) RETURN n.path AS path, n.title AS title, n.type AS type"
        ):
            g.add_node(
                r["path"],
                title=r["title"] or r["path"],
                type=r["type"] or "?",
            )
        for r in s.run(
            "MATCH (a:Note)-[:LINKS_TO]->(b:Note) RETURN a.path AS s, b.path AS t"
        ):
            g.add_edge(r["s"], r["t"])
    driver.close()
    return g


# --------------------------------------------------------------------------- #
# Métricas de red (NetworkX)
# --------------------------------------------------------------------------- #
def _rows(g: nx.DiGraph, scores: dict, limit: int) -> list[dict]:
    top = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)[:limit]
    return [
        {
            "nota": p,
            "titulo": g.nodes[p].get("title", p),
            "tipo": g.nodes[p].get("type", "?"),
            "score": round(v, 5),
        }
        for p, v in top
    ]


def top_pagerank(g: nx.DiGraph, limit: int = 20) -> list[dict]:
    """Influencia global: nodos hacia los que 'fluye' el conocimiento."""
    return _rows(g, nx.pagerank(g), limit)


def top_betweenness(g: nx.DiGraph, limit: int = 20) -> list[dict]:
    """Puentes: nodos que conectan zonas distintas del vault."""
    return _rows(g, nx.betweenness_centrality(g), limit)


def top_in_degree(g: nx.DiGraph, limit: int = 20) -> list[dict]:
    """Más referenciados (in-degree bruto)."""
    return _rows(g, dict(g.in_degree()), limit)


def communities(g: nx.DiGraph, limit_per: int = 8) -> list[dict]:
    """Detecta comunidades temáticas (greedy modularity sobre proyección no dirigida)."""
    ug = g.to_undirected()
    comms = nx.community.greedy_modularity_communities(ug)
    out: list[dict] = []
    for i, members in enumerate(comms):
        members = list(members)
        # tipo dominante de la comunidad (etiqueta legible)
        types = [g.nodes[m].get("type", "?") for m in members]
        dominant = max(set(types), key=types.count) if types else "?"
        # miembros más centrales dentro de la comunidad (por grado total)
        ranked = sorted(members, key=lambda m: g.degree(m), reverse=True)
        sample = [g.nodes[m].get("title", m) for m in ranked[:limit_per]]
        out.append(
            {
                "comunidad": i,
                "tamaño": len(members),
                "tipo_dominante": dominant,
                "miembros_clave": sample,
            }
        )
    return sorted(out, key=lambda c: c["tamaño"], reverse=True)


def isolation_report(g: nx.DiGraph) -> dict:
    """Conceptos aislados y salud estructural del grafo."""
    isolates = [n for n in g.nodes if g.degree(n) == 0]
    orphans = [n for n, d in g.in_degree() if d == 0]  # nadie los enlaza
    dead_ends = [n for n, d in g.out_degree() if d == 0]  # no enlazan a nada
    weak = list(nx.weakly_connected_components(g))
    return {
        "nodos": g.number_of_nodes(),
        "aristas": g.number_of_edges(),
        "aislados": sorted(g.nodes[n].get("title", n) for n in isolates),
        "huerfanos_sin_inbound": len(orphans),
        "sin_outbound": len(dead_ends),
        "componentes_debiles": len(weak),
        "tamaño_componente_mayor": max((len(c) for c in weak), default=0),
    }


def neighborhood(g: nx.DiGraph, path: str, radius: int = 1) -> nx.DiGraph:
    """Subgrafo alrededor de una nota (para visualización interactiva)."""
    if path not in g:
        return nx.DiGraph()
    nodes = nx.ego_graph(g.to_undirected(), path, radius=radius).nodes
    return g.subgraph(nodes).copy()


# --------------------------------------------------------------------------- #
# Agregaciones semánticas (Cypher directo sobre patrones densos)
# --------------------------------------------------------------------------- #
SEMANTIC_QUERIES: dict[str, str] = {
    "Techs más referenciadas por unidades": (
        "MATCH (u:Unit)-[:LINKS_TO]->(t:Tech) "
        "RETURN t.title AS item, count(DISTINCT u) AS n "
        "ORDER BY n DESC LIMIT 15"
    ),
    "Estrategias referenciadas por más civs": (
        "MATCH (c:Civ)-[:LINKS_TO]->(s:Strategy) "
        "RETURN s.title AS item, count(DISTINCT c) AS n "
        "ORDER BY n DESC LIMIT 15"
    ),
    "Jugadores más referenciados": (
        "MATCH (a:Note)-[:LINKS_TO]->(p:Player) "
        "RETURN p.title AS item, count(DISTINCT a) AS n "
        "ORDER BY n DESC LIMIT 15"
    ),
    "Meta/tier-lists más citadas por civs": (
        "MATCH (c:Civ)-[:LINKS_TO]->(m:Meta) "
        "RETURN m.title AS item, count(DISTINCT c) AS n "
        "ORDER BY n DESC LIMIT 15"
    ),
}


def semantic_aggregations(cfg: Config) -> dict[str, list[dict]]:
    driver = GraphDatabase.driver(
        cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password)
    )
    results: dict[str, list[dict]] = {}
    with driver.session() as s:
        for label, query in SEMANTIC_QUERIES.items():
            results[label] = [dict(r) for r in s.run(query)]
    driver.close()
    return results


def tier_distribution(cfg: Config) -> list[dict]:
    """Distribución de civs por tier dentro de cada tier-list."""
    q = (
        "MATCH (c:Civ)-[r:RATED]->(tl:TierList) "
        "RETURN tl.name AS lista, r.tier AS tier, count(*) AS n "
        "ORDER BY lista, n DESC"
    )
    driver = GraphDatabase.driver(
        cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password)
    )
    with driver.session() as s:
        rows = [dict(r) for r in s.run(q)]
    driver.close()
    return rows
