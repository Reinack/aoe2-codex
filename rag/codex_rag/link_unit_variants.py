"""Crea edges HAS_VARIANT {age} entre nodos 'línea' y nodos 'ficha' del vault.

Conecta las dos poblaciones de nodos Unit que existen en el grafo:
  - Líneas (id='archer-line', etc.): tienen COUNTERS edges, sin stats.
  - Fichas (path='units/archery/arbalester.md', etc.): tienen stats techtree, sin id.

Un edge HAS_VARIANT {age} une ambas, permitiendo queries por fase de partida:
  MATCH (l:Unit {id:'archer-line'})-[:HAS_VARIANT {age:'castle'}]->(v) RETURN v.hp

Fases del juego reconocidas: dark, feudal, castle, imperial.

    python -m codex_rag.link_unit_variants
    python -m codex_rag.link_unit_variants --dry-run
"""
from __future__ import annotations

import argparse

from codex.config import Config
from neo4j import GraphDatabase

# (line_id, age, vault_path)
# Solo se incluyen paths donde vault_path tiene stats (src=techtree) en Neo4j.
# Paths sin stats detectados: heavy-cavalry-archer, catapult-galleon, liao-dao,
#   white-feather-guard, heavy-hei-guang-cavalry, elite-* de navales únicos.
LINE_VARIANTS: dict[str, list[tuple[str, str]]] = {

    # ── Archery ──────────────────────────────────────────────────────────────
    "archer-line": [
        ("feudal",   "units/archery/archer.md"),
        ("castle",   "units/archery/crossbowman.md"),
        ("imperial", "units/archery/arbalester.md"),
    ],
    "skirmisher-line": [
        ("feudal",  "units/archery/skirmisher.md"),
        ("castle",  "units/archery/elite-skirmisher.md"),
    ],
    "hand-cannoneer": [
        ("imperial", "units/archery/hand-cannoneer.md"),
    ],
    "cavalry-archer": [
        ("castle",   "units/archery/cavalry-archer.md"),
        ("imperial", "units/archery/heavy-cavalry-archer.md"),
    ],
    "elephant-archer": [
        ("castle",   "units/archery/elephant-archer.md"),
        ("imperial", "units/archery/elite-elephant-archer.md"),
    ],

    # ── Infantry ─────────────────────────────────────────────────────────────
    "militia-line": [
        ("dark",     "units/infantry/militia.md"),
        ("feudal",   "units/infantry/man-at-arms.md"),
        ("castle",   "units/infantry/long-swordsman.md"),
        ("imperial", "units/infantry/two-handed-swordsman.md"),
        ("imperial", "units/infantry/champion.md"),
    ],
    "spearman-line": [
        ("feudal",   "units/infantry/spearman.md"),
        ("castle",   "units/infantry/pikeman.md"),
        ("imperial", "units/infantry/halberdier.md"),
    ],
    "eagle-warrior": [
        ("dark",     "units/infantry/eagle-scout.md"),
        ("castle",   "units/infantry/eagle-warrior.md"),
        ("imperial", "units/infantry/elite-eagle-warrior.md"),
    ],

    # ── Cavalry ──────────────────────────────────────────────────────────────
    "scout-line": [
        ("dark",     "units/cavalry/scout-cavalry.md"),
        ("feudal",   "units/cavalry/light-cavalry.md"),
        ("imperial", "units/cavalry/hussar.md"),
    ],
    "knight-line": [
        ("castle",   "units/cavalry/knight.md"),
        ("imperial", "units/cavalry/cavalier.md"),
        # paladin es civ-específico pero sigue siendo knight-line en imperial
    ],
    "camel-line": [
        ("castle",   "units/cavalry/camel-rider.md"),
        ("imperial", "units/cavalry/heavy-camel-rider.md"),
    ],
    "battle-elephant": [
        ("castle",   "units/cavalry/battle-elephant.md"),
        ("imperial", "units/cavalry/elite-battle-elephant.md"),
    ],
    "steppe-lancer": [
        ("castle",   "units/cavalry/steppe-lancer.md"),
        ("imperial", "units/cavalry/elite-steppe-lancer.md"),
    ],

    # ── Siege ─────────────────────────────────────────────────────────────────
    "ram-line": [
        ("castle",   "units/siege/battering-ram.md"),
        ("castle",   "units/siege/capped-ram.md"),
        ("imperial", "units/siege/siege-ram.md"),
    ],
    "siege-elephant": [
        ("castle",   "units/siege/armored-elephant.md"),
        ("imperial", "units/siege/siege-elephant.md"),
    ],
    "mangonel-line": [
        ("castle",   "units/siege/mangonel.md"),
        ("imperial", "units/siege/onager.md"),
        ("imperial", "units/siege/siege-onager.md"),
    ],
    "scorpion-line": [
        ("castle",   "units/siege/scorpion.md"),
        ("imperial", "units/siege/heavy-scorpion.md"),
    ],
    "bombard-cannon": [
        ("imperial", "units/siege/bombard-cannon.md"),
    ],

    # ── Monk ─────────────────────────────────────────────────────────────────
    "monk": [
        ("castle", "units/other/monk.md"),
    ],

    # ── Naval — líneas genéricas ──────────────────────────────────────────────
    "galley-line": [
        ("dark",    "units/naval/galley.md"),
        ("feudal",  "units/naval/war-galley.md"),
        ("castle",  "units/naval/galleon.md"),
    ],
    "fire-ship-line": [
        ("dark",   "units/naval/fire-galley.md"),
        ("feudal", "units/naval/fire-ship.md"),
        ("castle", "units/naval/fast-fire-ship.md"),
    ],
    "demo-ship": [
        ("feudal",   "units/naval/demolition-raft.md"),
        ("castle",   "units/naval/demolition-ship.md"),
        ("imperial", "units/naval/heavy-demolition-ship.md"),
    ],
    "hulk-line": [
        ("feudal",   "units/naval/hulk.md"),
        ("castle",   "units/naval/war-hulk.md"),
        ("imperial", "units/naval/carrack.md"),
    ],

    # ── Naval — únicas / regionales ──────────────────────────────────────────
    "cannon-galleon": [
        ("imperial", "units/naval/cannon-galleon.md"),
        ("imperial", "units/naval/elite-cannon-galleon.md"),
    ],
    "lou-chuan": [
        ("castle", "units/naval/lou-chuan.md"),
    ],
    "dromon": [
        ("castle", "units/naval/dromon.md"),
    ],
    "catapult-galleon": [
        ("imperial", "units/naval/catapult-galleon.md"),
    ],
    "turtle-ship": [
        ("castle",   "units/unique/turtle-ship.md"),
        ("imperial", "units/unique/elite-turtle-ship.md"),
    ],
    "caravel": [
        ("castle",   "units/unique/caravel.md"),
        ("imperial", "units/unique/elite-caravel.md"),
    ],
    "longboat": [
        ("feudal",   "units/unique/longboat.md"),
        ("imperial", "units/unique/elite-longboat.md"),
    ],
    "thirisadai": [
        ("imperial", "units/unique/thirisadai.md"),
    ],
    "dragon-ship": [
        ("castle", "units/unique/dragon-ship.md"),
    ],

    # ── Regionales chinas ────────────────────────────────────────────────────
    "fire-lancer": [
        ("castle",   "units/infantry/fire-lancer.md"),
        ("imperial", "units/infantry/elite-fire-lancer.md"),
    ],
    "hei-guang-cavalry": [
        ("feudal",   "units/cavalry/hei-guang-cavalry.md"),
        ("imperial", "units/cavalry/heavy-hei-guang-cavalry.md"),
    ],
    "rocket-cart": [
        ("castle",   "units/siege/rocket-cart.md"),
        ("imperial", "units/siege/heavy-rocket-cart.md"),
    ],
    "liao-dao": [
        ("castle",   "units/unique/liao-dao.md"),
        ("imperial", "units/unique/elite-liao-dao.md"),
    ],
    "white-feather-guard": [
        ("castle",   "units/unique/white-feather-guard.md"),
        ("imperial", "units/unique/elite-white-feather-guard.md"),
    ],
    "jian-swordsman": [
        ("castle", "units/unique/jian-swordsman.md"),
    ],
    "xianbei-raider": [
        ("castle", "units/unique/xianbei-raider.md"),
    ],

    # ── Regionales sudamericanas ──────────────────────────────────────────────
    "champi-line": [
        ("feudal",   "units/infantry/champi-scout.md"),
        ("castle",   "units/infantry/champi-runner.md"),
        ("imperial", "units/infantry/champi-warrior.md"),
        ("imperial", "units/infantry/elite-champi-warrior.md"),
    ],
    "slinger": [
        ("castle", "units/archery/slinger.md"),
    ],
}


def run(dry_run: bool = False) -> None:
    cfg = Config.load()
    driver = GraphDatabase.driver(cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password))

    total_planned = sum(len(v) for v in LINE_VARIANTS.values())
    skipped_empty = sum(1 for v in LINE_VARIANTS.values() if not v)
    print(f"Líneas configuradas: {len(LINE_VARIANTS)} "
          f"({skipped_empty} sin variantes aún, {total_planned} edges a crear)")

    if dry_run:
        for line_id, variants in LINE_VARIANTS.items():
            for age, path in variants:
                print(f"  [{line_id}] --HAS_VARIANT(age={age})--> [{path}]")
        print("[dry-run] Sin cambios en Neo4j.")
        driver.close()
        return

    created = 0
    skipped = 0

    with driver.session() as s:
        # Borrar edges previos para reimport idempotente
        deleted = s.run(
            "MATCH (:Unit)-[r:HAS_VARIANT]->(:Unit) DELETE r RETURN count(r) AS c"
        ).single()["c"]
        if deleted:
            print(f"  Borrados {deleted} HAS_VARIANT previos.")

        for line_id, variants in LINE_VARIANTS.items():
            for age, path in variants:
                result = s.run(
                    """
                    MATCH (line:Unit {id: $line_id})
                    MATCH (v:Unit {path: $path})
                    MERGE (line)-[r:HAS_VARIANT {age: $age}]->(v)
                    RETURN count(r) AS c
                    """,
                    line_id=line_id, path=path, age=age,
                ).single()
                if result and result["c"] > 0:
                    created += 1
                else:
                    print(f"  ⚠ Sin match: line={line_id} path={path} "
                          f"(¿path incorrecto o nodo sin id?)")
                    skipped += 1

    driver.close()
    print(f"\n[OK] {created} edges HAS_VARIANT creados | {skipped} sin match")
    if skipped:
        print("     Revisá los paths marcados con ⚠ — pueden tener stats pendientes de ingest.")


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.link_unit_variants")
    ap.add_argument("--dry-run", action="store_true",
                    help="Muestra los edges sin modificar Neo4j")
    args = ap.parse_args(argv)
    run(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
