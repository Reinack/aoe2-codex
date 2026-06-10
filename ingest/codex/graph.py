"""Capa Neo4j: upsert idempotente y borrado de notas."""

from __future__ import annotations

from neo4j import GraphDatabase

from .parser import ParsedNote

# Carpeta de primer nivel -> etiqueta secundaria del nodo Note
TYPE_LABEL = {
    "civs": "Civ",
    "players": "Player",
    "strategies": "Strategy",
    "technologies": "Tech",
    "units": "Unit",
    "buildings": "Building",
    "maps": "Map",
    "matchups": "Matchup",
    "meta": "Meta",
    "counters": "Counter",
    "replays-analysis": "Replay",
    "resources": "Resource",
    "root": "Root",
}
ALL_TYPE_LABELS = sorted(set(TYPE_LABEL.values()) | {"Misc"})


class CodexGraph:
    def __init__(self, uri: str, user: str, password: str):
        self._driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self) -> None:
        self._driver.close()

    def __enter__(self) -> "CodexGraph":
        return self

    def __exit__(self, *exc) -> None:
        self.close()

    def verify(self) -> None:
        self._driver.verify_connectivity()

    def ensure_schema(self) -> None:
        with self._driver.session() as s:
            s.run(
                "CREATE CONSTRAINT note_path IF NOT EXISTS "
                "FOR (n:Note) REQUIRE n.path IS UNIQUE"
            )
            s.run(
                "CREATE CONSTRAINT concept_id IF NOT EXISTS "
                "FOR (c:Concept) REQUIRE c.id IS UNIQUE"
            )
            s.run(
                "CREATE CONSTRAINT tierlist_name IF NOT EXISTS "
                "FOR (t:TierList) REQUIRE t.name IS UNIQUE"
            )

    def upsert_note(
        self, note: ParsedNote, resolved_links: list[str],
        unique_unit_civ_path: str | None = None,
        unique_tech_civ_path: str | None = None,
    ) -> None:
        """Inserta/actualiza la nota y reescribe sus aristas salientes de cero.

        Cada nota es 'dueña' de sus aristas LINKS_TO y de sus conceptos: se borran
        y se recrean → idempotente, sin duplicados ni huérfanos.
        """
        concepts = [
            {"id": f"{note.relpath}::{title}", "title": title}
            for title in note.concepts
        ]
        label = TYPE_LABEL.get(note.type, "Misc")
        with self._driver.session() as s:
            s.execute_write(
                self._upsert_tx, note, resolved_links, concepts, label,
                unique_unit_civ_path, unique_tech_civ_path,
            )

    @staticmethod
    def _upsert_tx(
        tx, note: ParsedNote, links: list[str], concepts: list[dict], label: str,
        unique_unit_civ_path: str | None = None,
        unique_tech_civ_path: str | None = None,
    ):
        # 1. upsert del nodo (n += $props añade propiedades de frontmatter)
        tx.run(
            """
            MERGE (n:Note {path:$path})
            SET n.title=$title, n.type=$type, n.tags=$tags
            SET n += $props
            """,
            path=note.relpath, title=note.title, type=note.type,
            tags=note.tags, props=note.props,
        )
        # 1b. etiqueta secundaria por tipo (relabel limpio vía APOC ante mudanza)
        tx.run(
            """
            MATCH (n:Note {path:$path})
            CALL apoc.create.removeLabels(n, $all) YIELD node
            CALL apoc.create.addLabels(node, [$label]) YIELD node AS m
            RETURN count(*)
            """,
            path=note.relpath, all=ALL_TYPE_LABELS, label=label,
        )
        # 2. limpiar aristas salientes y conceptos previos de ESTA nota
        tx.run(
            "MATCH (n:Note {path:$path})-[r:LINKS_TO|RATED]->() DELETE r",
            path=note.relpath,
        )
        tx.run(
            "MATCH (n:Note {path:$path})-[:DEFINES]->(c:Concept) DETACH DELETE c",
            path=note.relpath,
        )
        # 2b. la unidad/tech es 'dueña' de su arista ENTRANTE desde la civ
        tx.run(
            "MATCH ()-[r:HAS_UNIQUE_UNIT|HAS_UNIQUE_TECH]->(n:Note {path:$path}) "
            "DELETE r",
            path=note.relpath,
        )
        # 3. recrear LINKS_TO (MERGE del target crea stub si aún no existe)
        if links:
            tx.run(
                """
                MATCH (n:Note {path:$path})
                UNWIND $targets AS target
                MERGE (t:Note {path:target})
                MERGE (n)-[:LINKS_TO]->(t)
                """,
                path=note.relpath, targets=links,
            )
        # 4. recrear conceptos
        if concepts:
            tx.run(
                """
                MATCH (n:Note {path:$path})
                UNWIND $concepts AS c
                MERGE (concept:Concept {id:c.id})
                SET concept.title=c.title, concept.note=$path
                MERGE (n)-[:DEFINES]->(concept)
                """,
                path=note.relpath, concepts=concepts,
            )
        # 5. recrear RATED -> TierList (ej: civs valoradas por la lista de Hera)
        if note.ratings:
            tx.run(
                """
                MATCH (n:Note {path:$path})
                UNWIND $ratings AS r
                MERGE (tl:TierList {name:r.list})
                MERGE (n)-[rel:RATED]->(tl)
                SET rel.tier = r.value
                """,
                path=note.relpath, ratings=note.ratings,
            )
        # 6. (:Civ)-[:HAS_UNIQUE_UNIT]->(:Unit) — la arista que faltaba civ↔UU
        if unique_unit_civ_path:
            tx.run(
                """
                MATCH (unit:Note {path:$path})
                MATCH (civ:Note {path:$civ})
                MERGE (civ)-[:HAS_UNIQUE_UNIT]->(unit)
                """,
                path=note.relpath, civ=unique_unit_civ_path,
            )
        # 7. (:Civ)-[:HAS_UNIQUE_TECH]->(:Tech)
        if unique_tech_civ_path:
            tx.run(
                """
                MATCH (tech:Note {path:$path})
                MATCH (civ:Note {path:$civ})
                MERGE (civ)-[:HAS_UNIQUE_TECH]->(tech)
                """,
                path=note.relpath, civ=unique_tech_civ_path,
            )

    # ------------------------------------------------------------------ #
    # Embeddings / vector (GraphRAG)
    # ------------------------------------------------------------------ #

    def ensure_vector_index(self, dim: int) -> None:
        with self._driver.session() as s:
            s.run(
                f"""
                CREATE VECTOR INDEX chunk_embedding IF NOT EXISTS
                FOR (c:Chunk) ON (c.embedding)
                OPTIONS {{ indexConfig: {{
                    `vector.dimensions`: {int(dim)},
                    `vector.similarity_function`: 'cosine'
                }} }}
                """
            )

    def reset_vector_index(self, dim: int) -> None:
        """Recrea el índice desde cero (necesario si cambia la dimensión/modelo)."""
        with self._driver.session() as s:
            s.run("DROP INDEX chunk_embedding IF EXISTS")
        self.ensure_vector_index(dim)

    def get_embed_hashes(self) -> dict[str, str]:
        """{note_path: embed_hash} de lo ya embebido, para skip incremental."""
        with self._driver.session() as s:
            rows = s.run(
                "MATCH (n:Note) WHERE n.embed_hash IS NOT NULL "
                "RETURN n.path AS path, n.embed_hash AS h"
            )
            return {r["path"]: r["h"] for r in rows}

    def replace_chunks(self, note_path: str, body_hash: str, chunks: list[dict]) -> None:
        """Reemplaza los chunks de una nota (borrar + recrear) e indexa su hash."""
        with self._driver.session() as s:
            s.execute_write(self._replace_chunks_tx, note_path, body_hash, chunks)

    @staticmethod
    def _replace_chunks_tx(tx, note_path: str, body_hash: str, chunks: list[dict]):
        tx.run(
            "MATCH (:Note {path:$path})-[:HAS_CHUNK]->(c:Chunk) DETACH DELETE c",
            path=note_path,
        )
        if chunks:
            tx.run(
                """
                MATCH (n:Note {path:$path})
                UNWIND $chunks AS ch
                CREATE (c:Chunk {
                    id: ch.id, ordinal: ch.ordinal, heading: ch.heading,
                    text: ch.text, chash: ch.chash, embedding: ch.embedding
                })
                MERGE (n)-[:HAS_CHUNK]->(c)
                """,
                path=note_path, chunks=chunks,
            )
        tx.run(
            "MATCH (n:Note {path:$path}) SET n.embed_hash=$h",
            path=note_path, h=body_hash,
        )

    def delete_chunks_for(self, note_path: str) -> None:
        with self._driver.session() as s:
            s.run(
                "MATCH (:Note {path:$path})-[:HAS_CHUNK]->(c:Chunk) DETACH DELETE c",
                path=note_path,
            )

    def vector_search(self, qvec: list[float], k: int) -> list[dict]:
        """Top-k chunks por similitud + expansión de grafo (1 hop de la nota)."""
        with self._driver.session() as s:
            rows = s.run(
                """
                CALL db.index.vector.queryNodes('chunk_embedding', $k, $qvec)
                YIELD node, score
                MATCH (n:Note)-[:HAS_CHUNK]->(node)
                OPTIONAL MATCH (n)-[:LINKS_TO]->(m:Note)
                RETURN node.text AS text, node.heading AS heading,
                       n.path AS path, n.title AS title, n.type AS type,
                       score, collect(DISTINCT m.title)[0..6] AS related
                ORDER BY score DESC
                """,
                k=k, qvec=qvec,
            )
            return [dict(r) for r in rows]

    def chunk_stats(self) -> dict[str, int]:
        with self._driver.session() as s:
            chunks = s.run("MATCH (c:Chunk) RETURN count(c) AS c").single()["c"]
            embedded = s.run(
                "MATCH (n:Note) WHERE n.embed_hash IS NOT NULL RETURN count(n) AS c"
            ).single()["c"]
        return {"chunks": chunks, "embedded_notes": embedded}

    def delete_note(self, relpath: str) -> None:
        """Borra una nota, sus conceptos y todas sus aristas."""
        with self._driver.session() as s:
            s.run(
                """
                MATCH (n:Note {path:$path})
                OPTIONAL MATCH (n)-[:DEFINES]->(c:Concept)
                OPTIONAL MATCH (n)-[:HAS_CHUNK]->(ch:Chunk)
                DETACH DELETE c, ch, n
                """,
                path=relpath,
            )

    def stats(self) -> dict[str, int]:
        with self._driver.session() as s:
            notes = s.run("MATCH (n:Note) RETURN count(n) AS c").single()["c"]
            links = s.run(
                "MATCH (:Note)-[r:LINKS_TO]->(:Note) RETURN count(r) AS c"
            ).single()["c"]
            concepts = s.run("MATCH (c:Concept) RETURN count(c) AS c").single()["c"]
            stubs = s.run(
                "MATCH (n:Note) WHERE n.title IS NULL RETURN count(n) AS c"
            ).single()["c"]
            rated = s.run(
                "MATCH (:Note)-[r:RATED]->(:TierList) RETURN count(r) AS c"
            ).single()["c"]
            tierlists = s.run(
                "MATCH (t:TierList) RETURN count(t) AS c"
            ).single()["c"]
            uu = s.run(
                "MATCH (:Note)-[r:HAS_UNIQUE_UNIT]->(:Note) RETURN count(r) AS c"
            ).single()["c"]
            ut = s.run(
                "MATCH (:Note)-[r:HAS_UNIQUE_TECH]->(:Note) RETURN count(r) AS c"
            ).single()["c"]
        return {
            "notes": notes, "links": links, "concepts": concepts,
            "stubs": stubs, "rated": rated, "tierlists": tierlists,
            "uu": uu, "ut": ut,
        }
