"""Copia el grafo completo de un Neo4j origen (local) a uno destino (Aura) con
UNWIND batcheado — rápido sobre la red (pocas round-trips), a diferencia del sync
nota-por-nota. Transfiere nodos, relaciones y los vectores de embeddings tal cual,
sin re-embeddear. Pensado como carga única para el deploy.

    # origen = local Docker (default), destino = Config (.env → Aura)
    python -m codex.copy_to_aura            # dry-run: reporta tamaños
    python -m codex.copy_to_aura --write    # ejecuta la copia (BORRA el destino)

Source override por env: SRC_NEO4J_URI / SRC_NEO4J_USER / SRC_NEO4J_PASSWORD.
"""

from __future__ import annotations

import argparse
import os

from neo4j import GraphDatabase

from .config import Config

NODE_BATCH = 200     # los Chunk traen vector de 768 floats → batch chico
REL_BATCH = 1000
MIG = "_Mig"         # label temporal para indexar la clave de migración


def _src_driver():
    uri = os.environ.get("SRC_NEO4J_URI", "bolt://localhost:7687")
    user = os.environ.get("SRC_NEO4J_USER", "neo4j")
    pwd = os.environ.get("SRC_NEO4J_PASSWORD", "codexpass")
    return GraphDatabase.driver(uri, auth=(user, pwd)), uri


def _batched(seq, n):
    for i in range(0, len(seq), n):
        yield seq[i : i + n]


def main(argv=None):
    ap = argparse.ArgumentParser(prog="codex.copy_to_aura", description=__doc__)
    ap.add_argument("--write", action="store_true", help="ejecuta (borra el destino)")
    args = ap.parse_args(argv)

    cfg = Config.load()                       # destino (Aura) desde .env
    src, src_uri = _src_driver()
    dst = GraphDatabase.driver(cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password))

    # --- leer todo del origen ---
    with src.session() as s:
        nodes = [
            {"mid": r["mid"], "labels": r["labels"], "props": dict(r["props"])}
            for r in s.run("MATCH (n) RETURN id(n) AS mid, labels(n) AS labels, "
                           "properties(n) AS props")
        ]
        rels = [
            {"s": r["s"], "e": r["e"], "t": r["t"], "props": dict(r["props"])}
            for r in s.run("MATCH (a)-[r]->(b) RETURN id(a) AS s, id(b) AS e, "
                           "type(r) AS t, properties(r) AS props")
        ]
    dim = max((len(n["props"].get("embedding", [])) for n in nodes), default=0)
    print(f"[src] {src_uri}")
    print(f"[src] nodos={len(nodes)}  rels={len(rels)}  embed_dim={dim}")
    print(f"[dst] {cfg.neo4j_uri}  user={cfg.neo4j_user}")

    if not args.write:
        print("\n(dry-run; usar --write para copiar — BORRA el destino primero)")
        src.close(); dst.close(); return

    with dst.session() as s:
        # --- limpiar destino ---
        print("[dst] limpiando destino...")
        s.run("MATCH (n) CALL (n) { DETACH DELETE n } IN TRANSACTIONS OF 1000 ROWS")
        s.run(f"CREATE INDEX mig_idx IF NOT EXISTS FOR (n:{MIG}) ON (n._mig)")

        # --- nodos (con label temporal :_Mig + _mig=mid para emparejar rels) ---
        for i, batch in enumerate(_batched(nodes, NODE_BATCH), 1):
            rows = [{"labels": n["labels"] + [MIG],
                     "props": {**n["props"], "_mig": n["mid"]}} for n in batch]
            s.run("UNWIND $rows AS r CALL apoc.create.node(r.labels, r.props) "
                  "YIELD node RETURN count(*)", rows=rows)
            if i % 5 == 0 or i * NODE_BATCH >= len(nodes):
                print(f"[nodes] {min(i*NODE_BATCH, len(nodes))}/{len(nodes)}")

        # --- relaciones (match por _mig) ---
        for i, batch in enumerate(_batched(rels, REL_BATCH), 1):
            s.run(
                f"UNWIND $rows AS r "
                f"MATCH (a:{MIG} {{_mig:r.s}}), (b:{MIG} {{_mig:r.e}}) "
                f"CALL apoc.create.relationship(a, r.t, r.props, b) "
                f"YIELD rel RETURN count(*)", rows=batch)
            if i % 5 == 0 or i * REL_BATCH >= len(rels):
                print(f"[rels] {min(i*REL_BATCH, len(rels))}/{len(rels)}")

        # --- limpiar marca de migración ---
        print("[dst] quitando marca de migración...")
        s.run(f"MATCH (n:{MIG}) CALL (n) {{ REMOVE n:{MIG} REMOVE n._mig }} "
              f"IN TRANSACTIONS OF 1000 ROWS")
        s.run("DROP INDEX mig_idx IF EXISTS")

        # --- recrear el vector index (los embeddings ya están como propiedad) ---
        if dim:
            s.run("CREATE VECTOR INDEX chunk_embedding IF NOT EXISTS "
                  "FOR (c:Chunk) ON (c.embedding) OPTIONS { indexConfig: { "
                  "`vector.dimensions`: $dim, `vector.similarity_function`: 'cosine' } }",
                  dim=dim)
            s.run("CREATE CONSTRAINT chunk_id IF NOT EXISTS "
                  "FOR (c:Chunk) REQUIRE c.id IS UNIQUE")

        # --- verificación ---
        n = s.run("MATCH (n) RETURN count(n) AS c").single()["c"]
        r = s.run("MATCH ()-[x]->() RETURN count(x) AS c").single()["c"]
        ch = s.run("MATCH (c:Chunk) RETURN count(c) AS c").single()["c"]
    print(f"[ok] destino: nodos={n}  rels={r}  chunks={ch}  vector_dim={dim}")
    src.close(); dst.close()


if __name__ == "__main__":
    main()
