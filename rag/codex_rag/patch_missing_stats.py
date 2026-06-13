"""Upsert directo de stats para unidades sin datos en Neo4j.

Estas unidades tienen nodos en el grafo (ingestados desde el vault) pero su
tree_id no hizo match en techtree/ingest.mjs, por lo que quedaron sin stats.
Los valores provienen de las tablas de las notas del vault (src = vault-table).

    python -m codex_rag.patch_missing_stats
    python -m codex_rag.patch_missing_stats --dry-run
"""
from __future__ import annotations

import argparse

from codex.config import Config
from neo4j import GraphDatabase

# Stats extraídos de las tablas markdown del vault.
# Campos: hp, attack, armor_melee, armor_pierce, range, speed, train_time
# y coste (cost_food / cost_wood / cost_gold según la unidad).
MISSING: list[dict] = [
    # ── Naval ──────────────────────────────────────────────────────────────────
    {
        "path": "units/naval/catapult-galleon.md",
        "hp": 140, "attack": 30, "armor_melee": 0, "armor_pierce": 6,
        "range": 12, "speed": 1.0, "cost_wood": 225, "cost_gold": 100, "train_time": 55,
    },
    # ── Archery ────────────────────────────────────────────────────────────────
    {
        "path": "units/archery/heavy-cavalry-archer.md",
        "hp": 60, "attack": 7, "armor_melee": 1, "armor_pierce": 0,
        "range": 4, "speed": 1.4, "cost_wood": 40, "cost_gold": 60, "train_time": 30,
    },
    # ── Regionales chinas — Khitan ─────────────────────────────────────────────
    {
        "path": "units/unique/liao-dao.md",
        "hp": 75, "attack": 9, "armor_melee": 3, "armor_pierce": 1,
        "range": 0, "speed": 1.0, "cost_food": 40, "cost_gold": 40, "train_time": 12,
    },
    {
        "path": "units/unique/elite-liao-dao.md",
        "hp": 85, "attack": 13, "armor_melee": 3, "armor_pierce": 1,
        "range": 0, "speed": 1.0, "cost_food": 40, "cost_gold": 40, "train_time": 12,
    },
    # ── Regionales chinas — Shu ────────────────────────────────────────────────
    {
        "path": "units/unique/white-feather-guard.md",
        "hp": 95, "attack": 7, "armor_melee": 0, "armor_pierce": 2,
        "range": 0, "speed": 0.95, "cost_food": 60, "cost_gold": 15, "train_time": 11,
    },
    {
        "path": "units/unique/elite-white-feather-guard.md",
        "hp": 100, "attack": 8, "armor_melee": 0, "armor_pierce": 3,
        "range": 0, "speed": 0.95, "cost_food": 60, "cost_gold": 15, "train_time": 11,
    },
    # ── Regionales chinas — Hei Guang ─────────────────────────────────────────
    {
        "path": "units/cavalry/heavy-hei-guang-cavalry.md",
        "hp": 90, "attack": 12, "armor_melee": 4, "armor_pierce": 3,
        "range": 0, "speed": 1.35, "cost_food": 65, "cost_gold": 65, "train_time": 28,
    },
    # ── Navales únicos — elites ────────────────────────────────────────────────
    {
        "path": "units/unique/elite-turtle-ship.md",
        "hp": 350, "attack": 25, "armor_melee": 3, "armor_pierce": 12,
        "range": 7, "speed": 1.0, "cost_wood": 180, "cost_gold": 180, "train_time": 50,
    },
    {
        "path": "units/unique/elite-caravel.md",
        "hp": 165, "attack": 7, "armor_melee": 0, "armor_pierce": 6,
        "range": 7, "speed": 1.36, "cost_wood": 90, "cost_gold": 34, "train_time": 25,
    },
    {
        "path": "units/unique/elite-longboat.md",
        "hp": 130, "attack": 7, "armor_melee": 1, "armor_pierce": 6,
        "range": 7, "speed": 1.46, "cost_wood": 80, "cost_gold": 40, "train_time": 25,
    },
]

STAT_KEYS = ["hp", "attack", "armor_melee", "armor_pierce", "range", "speed",
             "train_time", "cost_food", "cost_wood", "cost_gold"]


def run(dry_run: bool = False) -> None:
    cfg = Config.load()
    driver = GraphDatabase.driver(cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password))

    if dry_run:
        for u in MISSING:
            stats = {k: v for k, v in u.items() if k != "path"}
            print(f"  SET {u['path']}: {stats}")
        print(f"[dry-run] {len(MISSING)} unidades, sin cambios en Neo4j.")
        driver.close()
        return

    ok = 0
    miss = 0
    with driver.session() as s:
        for u in MISSING:
            path = u["path"]
            props = {k: v for k, v in u.items() if k in STAT_KEYS and v is not None}
            props["stat_source"] = "vault-table"
            result = s.run(
                "MATCH (n:Unit {path: $path}) SET n += $props RETURN count(n) AS c",
                path=path, props=props,
            ).single()
            if result and result["c"] > 0:
                ok += 1
                print(f"  [OK] {path}")
            else:
                miss += 1
                print(f"  [MISS] {path} — nodo no encontrado")

    driver.close()
    print(f"\n[OK] {ok} nodos actualizados | {miss} no encontrados")


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.patch_missing_stats")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)
    run(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
