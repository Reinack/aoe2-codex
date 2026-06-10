"""Almacén de chunks + vector index nativo de Neo4j (búsqueda semántica)."""

from __future__ import annotations

from neo4j import GraphDatabase

INDEX_NAME = "chunk_embedding"


class RagStore:
    def __init__(self, uri: str, user: str, password: str):
        self._driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self) -> None:
        self._driver.close()

    def __enter__(self) -> "RagStore":
        return self

    def __exit__(self, *exc) -> None:
        self.close()

    def ensure_index(self, dim: int = 1024) -> None:
        with self._driver.session() as s:
            s.run(
                "CREATE CONSTRAINT chunk_id IF NOT EXISTS "
                "FOR (c:Chunk) REQUIRE c.id IS UNIQUE"
            )
            s.run(
                f"""
                CREATE VECTOR INDEX {INDEX_NAME} IF NOT EXISTS
                FOR (c:Chunk) ON (c.embedding)
                OPTIONS {{ indexConfig: {{
                    `vector.dimensions`: {dim},
                    `vector.similarity_function`: 'cosine'
                }} }}
                """
            )

    def delete_note_chunks(self, note: str) -> None:
        with self._driver.session() as s:
            s.run("MATCH (c:Chunk {note:$note}) DETACH DELETE c", note=note)

    def upsert_chunks(self, note: str, chunks: list[dict]) -> None:
        """chunks: [{id, ord, heading, text, hash, embedding}]."""
        with self._driver.session() as s:
            s.execute_write(self._upsert_tx, note, chunks)

    @staticmethod
    def _upsert_tx(tx, note: str, chunks: list[dict]):
        for c in chunks:
            tx.run(
                """
                MERGE (ch:Chunk {id:$id})
                SET ch.note=$note, ch.ord=$ord, ch.heading=$heading,
                    ch.text=$text, ch.hash=$hash
                WITH ch
                CALL db.create.setNodeVectorProperty(ch, 'embedding', $emb)
                WITH ch
                MATCH (n:Note {path:$note})
                MERGE (ch)-[:PART_OF]->(n)
                """,
                id=c["id"], note=note, ord=c["ord"], heading=c["heading"],
                text=c["text"], hash=c["hash"], emb=c["embedding"],
            )

    def search(
        self, query_vec: list[float], k: int = 6, min_score: float = 0.0
    ) -> list[dict]:
        """Top-k chunks por similitud coseno, filtrados por min_score (umbral)."""
        with self._driver.session() as s:
            rows = s.run(
                f"""
                CALL db.index.vector.queryNodes('{INDEX_NAME}', $k, $q)
                YIELD node, score
                WHERE node.note IS NOT NULL AND score >= $min_score
                RETURN node.note AS note, node.heading AS heading,
                       node.text AS text, score
                ORDER BY score DESC
                """,
                k=k, q=query_vec, min_score=min_score,
            )
            return [dict(r) for r in rows]

    def related_notes(
        self, paths: list[str], limit: int = 6, max_degree: int = 60
    ) -> list[dict]:
        """Vecinos relevantes en el grafo (expansión GraphRAG).

        Excluye hubs (grado > max_degree, p.ej. index.md) y rankea por
        co-citación: cuántas notas semilla enlazan al vecino. Antes ordenaba
        alfabético y devolvía siempre los hubs → ruido inútil.
        """
        with self._driver.session() as s:
            rows = s.run(
                """
                MATCH (n:Note)-[:LINKS_TO|HAS_UNIQUE_UNIT|HAS_UNIQUE_TECH]-(m:Note)
                WHERE n.path IN $paths AND NOT m.path IN $paths
                WITH m, count(DISTINCT n) AS compartidas,
                     size([(m)--() | 1]) AS grado
                WHERE grado <= $max_degree
                RETURN m.path AS path, m.title AS title, compartidas
                ORDER BY compartidas DESC, grado ASC
                LIMIT $limit
                """,
                paths=paths, limit=limit, max_degree=max_degree,
            )
            return [dict(r) for r in rows]

    def alias_index(self) -> dict[str, str]:
        """{término_lower: note_path} con alias ES/MX + títulos EN de civs/units/techs.

        Permite matchear léxicamente un nombre de entidad en cualquier idioma.
        """
        idx: dict[str, str] = {}
        with self._driver.session() as s:
            for r in s.run(
                "MATCH (n:Note) WHERE n.aliases IS NOT NULL "
                "UNWIND n.aliases AS a RETURN a AS alias, n.path AS path"
            ):
                idx[r["alias"].lower()] = r["path"]
            for r in s.run(
                "MATCH (n:Note) WHERE n.type IN ['civs','units','technologies'] "
                "AND n.title IS NOT NULL RETURN n.title AS title, n.path AS path"
            ):
                idx.setdefault(r["title"].lower(), r["path"])
        return idx

    def note_chunks(self, note: str, limit: int = 2) -> list[dict]:
        """Primeros chunks de una nota (para inyección léxica)."""
        with self._driver.session() as s:
            rows = s.run(
                """
                MATCH (c:Chunk {note:$note})
                RETURN c.note AS note, c.heading AS heading, c.text AS text
                ORDER BY c.ord LIMIT $limit
                """,
                note=note, limit=limit,
            )
            return [dict(r) for r in rows]

    def stats(self) -> dict:
        with self._driver.session() as s:
            chunks = s.run("MATCH (c:Chunk) RETURN count(c) AS c").single()["c"]
            notes = s.run(
                "MATCH (c:Chunk) RETURN count(DISTINCT c.note) AS c"
            ).single()["c"]
        return {"chunks": chunks, "notes": notes}
