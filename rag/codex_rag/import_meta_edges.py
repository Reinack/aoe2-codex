"""Aristas de meta-juego (jugadores / torneos / mapas) al grafo Neo4j.

Complementa a import_counter_edges.py con las relaciones que NO salen del tech-tree
sino del vault competitivo:

    (:Player)-[:WON]->(:Tournament)            de campeón (frontmatter o blockquote)
    (:Player)-[:RUNNER_UP]->(:Tournament)      de runner_up / subcampeón
    (:Player)-[:PARTICIPATED_IN]->(:Tournament) de los LINKS_TO torneo→jugador
    (:Tournament)-[:USED_MAP]->(:Map)          de los LINKS_TO torneo→mapa (sin tipo-*)
    (:Map)-[:IS_TYPE]->(:MapType)              del wikilink "**Tipo:** [[maps/tipo-x]]"

WON/RUNNER_UP se resuelven leyendo cada torneos/*.md (frontmatter o blockquote, porque
el vault es inconsistente: Warlords-5 usa YAML, TTL5 usa "> **Ganador:** …"). El resto
se deriva por Cypher de las aristas LINKS_TO que ya crea el sync — así reusamos el grafo
en vez de re-parsear tablas de prosa frágiles.

Idempotente: borra los 5 tipos y recrea; SET de labels :Tournament/:MapType es inocuo.

    python -m codex_rag.import_meta_edges
    python -m codex_rag.import_meta_edges --dry-run
    python -m codex_rag.import_meta_edges --vault D:/Boveda/Aoe
"""
from __future__ import annotations

import argparse
import re
import unicodedata
from pathlib import Path

import frontmatter
from codex.config import Config
from neo4j import GraphDatabase

EDGE_TYPES = ["WON", "RUNNER_UP", "PARTICIPATED_IN", "USED_MAP", "IS_TYPE"]

# Claves de frontmatter que nombran al campeón / subcampeón (con y sin acento).
CHAMP_KEYS = ["campeón", "campeon", "champion", "ganador", "winner"]
RUNNER_KEYS = ["runner_up", "runnerup", "runner-up", "subcampeón", "subcampeon"]
# Etiquetas equivalentes en el cuerpo (blockquote "> **Ganador:** …").
CHAMP_LABELS = ["Ganador", "Campeón", "Campeon", "Champion", "Winner"]
RUNNER_LABELS = ["Runner-up", "Runner up", "Subcampeón", "Subcampeon"]


def slug(s: str) -> str:
    """Slug ascii para emparejar nombres (quita acentos, banderas, puntuación)."""
    s = unicodedata.normalize("NFD", str(s))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def clean_name(value) -> str | None:
    """'🇨🇦 Hera (Team Vitality)' → 'Hera'. Corta en '(' y '—', tira emoji/banderas."""
    if not value:
        return None
    s = str(value).replace("**", "")
    s = s.split("(")[0].split("—")[0]
    s = re.sub(r"[^\w\s\-]", " ", s, flags=re.UNICODE)  # descarta emoji/banderas
    s = s.strip()
    return s or None


def _first_key(post: frontmatter.Post, keys: list[str]):
    for k in keys:
        if k in post.metadata and post.metadata[k]:
            return post.metadata[k]
    return None


def _body_field(body: str, labels: list[str]) -> str | None:
    for lab in labels:
        m = re.search(rf"\*\*\s*{re.escape(lab)}\s*:?\s*\*\*\s*:?\s*(.+)", body, re.IGNORECASE)
        if m:
            return m.group(1)
    return None


def read_tournaments(vault: Path) -> list[dict]:
    """{path, champion, runner} por cada torneos/*.md (frontmatter o blockquote)."""
    tdir = vault / "torneos"
    out = []
    for f in sorted(tdir.glob("*.md")):
        # utf-8-sig: algunas notas del vault tienen BOM y frontmatter.load() no la
        # detecta (el '---' no queda al inicio) → devolvería metadata vacía.
        post = frontmatter.loads(f.read_text(encoding="utf-8-sig"))
        champ = _first_key(post, CHAMP_KEYS) or _body_field(post.content, CHAMP_LABELS)
        runner = _first_key(post, RUNNER_KEYS) or _body_field(post.content, RUNNER_LABELS)
        out.append({
            "path": f"torneos/{f.stem}.md",
            "champion": clean_name(champ),
            "runner": clean_name(runner),
        })
    return out


def _player_index(session) -> dict[str, str]:
    """slug → path de jugador (por basename del archivo y por título)."""
    idx: dict[str, str] = {}
    for r in session.run("MATCH (p:Player) RETURN p.path AS path, p.title AS title"):
        path = r["path"]
        base = Path(path).stem  # players/Hera.md → Hera
        idx.setdefault(slug(base), path)
        if r["title"]:
            idx.setdefault(slug(str(r["title"]).split("(")[0]), path)
    return idx


def run_import(vault: Path, dry_run: bool = False) -> None:
    tourneys = read_tournaments(vault)
    print(f"Leídos {len(tourneys)} torneos:")
    for t in tourneys:
        print(f"  {t['path']}: campeón={t['champion']} · runner={t['runner']}")

    if dry_run:
        print("\n[dry-run] WON/RUNNER_UP se resolverán contra los nodos :Player; "
              "PARTICIPATED_IN/USED_MAP/IS_TYPE se derivan por Cypher de LINKS_TO. "
              "Sin cambios en Neo4j.")
        return

    cfg = Config.load()
    driver = GraphDatabase.driver(cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password))
    with driver.session() as s:
        # Etiquetas: torneos → :Tournament, maps/tipo-* → :MapType (idempotente).
        s.run("MATCH (n:Note) WHERE n.path STARTS WITH 'torneos/' SET n:Tournament")
        s.run("MATCH (n:Note) WHERE n.path STARTS WITH 'maps/tipo-' SET n:MapType")

        # Reset idempotente de los 5 tipos.
        s.run(f"MATCH ()-[r:{'|'.join(EDGE_TYPES)}]->() DELETE r")

        # WON / RUNNER_UP (resueltos por nombre → path de jugador). El MERGE sólo
        # crea la arista si AMBOS nodos existen; contamos los realmente creados y
        # avisamos si falta el Player o el Tournament (nota aún no sincronizada).
        pidx = _player_index(s)
        won = runner = miss = 0
        for t in tourneys:
            for name, rel in ((t["champion"], "WON"), (t["runner"], "RUNNER_UP")):
                if not name:
                    continue
                ppath = pidx.get(slug(name))
                if not ppath:
                    miss += 1
                    print(f"  [MISS] {rel}: sin nodo Player para '{name}' ({t['path']})")
                    continue
                rec = s.run(
                    f"MATCH (p:Player {{path:$pp}}), (t:Tournament {{path:$tp}}) "
                    f"MERGE (p)-[:{rel}]->(t) RETURN count(*) AS c",
                    pp=ppath, tp=t["path"],
                ).single()
                if not rec or not rec["c"]:
                    miss += 1
                    print(f"  [MISS] {rel}: sin nodo Tournament {t['path']} (¿falta sync?)")
                elif rel == "WON":
                    won += 1
                else:
                    runner += 1
        print(f"[OK] WON: {won} · RUNNER_UP: {runner} · sin match: {miss}")

        # PARTICIPATED_IN: torneo LINKS_TO jugador ⇒ jugador participó.
        n_part = s.run(
            "MATCH (t:Tournament)-[:LINKS_TO]->(p:Player) "
            "MERGE (p)-[:PARTICIPATED_IN]->(t) RETURN count(*) AS c"
        ).single()["c"]

        # USED_MAP: torneo LINKS_TO mapa (excluye las notas de tipo).
        n_map = s.run(
            "MATCH (t:Tournament)-[:LINKS_TO]->(m:Map) "
            "WHERE NOT m.path STARTS WITH 'maps/tipo-' "
            "MERGE (t)-[:USED_MAP]->(m) RETURN count(*) AS c"
        ).single()["c"]

        # IS_TYPE: mapa LINKS_TO nota de tipo (maps/tipo-*).
        n_type = s.run(
            "MATCH (m:Map)-[:LINKS_TO]->(mt:MapType) "
            "WHERE NOT m.path STARTS WITH 'maps/tipo-' "
            "MERGE (m)-[:IS_TYPE]->(mt) RETURN count(*) AS c"
        ).single()["c"]

        print(f"[OK] PARTICIPATED_IN: {n_part} · USED_MAP: {n_map} · IS_TYPE: {n_type}")

    driver.close()
    print("[OK] Importación de meta-edges completa")


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.import_meta_edges")
    ap.add_argument("--vault", help="override de VAULT_PATH")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    cfg = Config.load()
    vault_path = Path(args.vault) if args.vault else cfg.require_vault()
    run_import(vault_path, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
