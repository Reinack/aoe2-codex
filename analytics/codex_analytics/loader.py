"""Carga el grafo de Neo4j a un DiGraph de NetworkX."""

from __future__ import annotations

import networkx as nx
from neo4j import GraphDatabase

from codex.config import Config


def load_graph(cfg: Config | None = None) -> nx.DiGraph:
    """Nodos :Note con sus atributos (title, type) y aristas LINKS_TO dirigidas."""
    cfg = cfg or Config.load()
    driver = GraphDatabase.driver(
        cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password)
    )
    g = nx.DiGraph()
    with driver.session() as s:
        for rec in s.run(
            "MATCH (n:Note) RETURN n.path AS path, n.title AS title, n.type AS type"
        ):
            g.add_node(
                rec["path"],
                title=rec["title"] or rec["path"],
                type=rec["type"] or "unknown",
            )
        for rec in s.run(
            "MATCH (a:Note)-[:LINKS_TO]->(b:Note) RETURN a.path AS src, b.path AS dst"
        ):
            if g.has_node(rec["src"]) and g.has_node(rec["dst"]):
                g.add_edge(rec["src"], rec["dst"])
    driver.close()
    return g


def load_ratings(cfg: Config | None = None):
    """Devuelve filas (civ, lista, tier) de las aristas RATED."""
    cfg = cfg or Config.load()
    driver = GraphDatabase.driver(
        cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password)
    )
    rows = []
    with driver.session() as s:
        for rec in s.run(
            """
            MATCH (c:Civ)-[r:RATED]->(tl:TierList)
            RETURN c.title AS civ, tl.name AS lista, r.tier AS tier
            ORDER BY tl.name, c.title
            """
        ):
            rows.append({"civ": rec["civ"], "lista": rec["lista"], "tier": rec["tier"]})
    driver.close()
    return rows
