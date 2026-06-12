"""Importa relaciones COUNTERS desde counter-edges-neo4j.md al grafo Neo4j.

    python -m codex_rag.import_counter_edges
    python -m codex_rag.import_counter_edges --dry-run
    python -m codex_rag.import_counter_edges --vault D:/Boveda/Aoe
"""
from __future__ import annotations

import argparse
from pathlib import Path

import frontmatter
from codex.config import Config
from neo4j import GraphDatabase

COUNTER_EDGES_FILE = "counters/counter-edges-neo4j.md"

# unit_id (YAML) → clave de IMG_MAP del tech-tree (para íconos en el frontend)
UNIT_IMG_KEYS: dict[str, str] = {
    "archer-line":      "archer",
    "skirmisher-line":  "skirmisher",
    "hand-cannoneer":   "handcannon",
    "cavalry-archer":   "cavarcher",
    "elephant-archer":  "elephant_archer",
    "militia-line":     "champion",
    "spearman-line":    "halberdier",
    "eagle-warrior":    "eaglewarrior",
    "scout-line":       "hussar",
    "knight-line":      "paladin",
    "camel-line":       "camel",
    "battle-elephant":  "battleeleph",
    "steppe-lancer":    "steppe_lancer",
    "ram-line":         "siegeram",
    "siege-elephant":   "siege_elephant",
    "mangonel-line":    "mangonel",
    "scorpion-line":    "scorpion",
    "bombard-cannon":   "bombcannon",
    "monk":             "monk",
    "galley-line":      "galley",
    "fire-ship-line":   "fireship",
    "demo-ship":        "demoship",
    "hulk-line":        "hulk",
    # Naval — naves de largo alcance + barcos únicos
    "cannon-galleon":   "cannongalleon",
    "lou-chuan":        "lou_chuan",
    "dromon":           "dromon",
    "catapult-galleon": "catapult_gall",
    "turtle-ship":      "turtle_ship",
    "caravel":          "caravel_d",
    "longboat":         "longboat",
    "thirisadai":       "thirisadai",
    "dragon-ship":      "dragon_ship",
    # Regionales chinas
    "fire-lancer":      "fire_lancer",
    "hei-guang-cavalry": "hei_guang",
    "rocket-cart":      "rocket_cart",
    "liao-dao":         "liao_dao",
    "white-feather-guard": "white_feather",
    "jian-swordsman":   "jian_swordsman",
    "xianbei-raider":   "xianbei_raider",
    # Regionales sudamericanas
    "champi-line":      "champiwarrior",
    "slinger":          "slinger",
}


def run_import(vault_path: Path, dry_run: bool = False) -> None:
    edges_file = vault_path / COUNTER_EDGES_FILE
    if not edges_file.exists():
        raise SystemExit(f"No se encontró: {edges_file}")

    post = frontmatter.load(str(edges_file))
    nodes: list[dict] = post.get("nodes", [])
    edges: list[dict] = post.get("edges", [])
    print(f"Leído: {len(nodes)} nodos, {len(edges)} edges")

    if dry_run:
        for e in edges:
            print(
                f"  {e['from']} --[COUNTERS w={e['weight']} "
                f"ctx={e.get('context','?')}]--> {e['to']}"
            )
        return

    cfg = Config.load()
    driver = GraphDatabase.driver(cfg.neo4j_uri, auth=(cfg.neo4j_user, cfg.neo4j_password))

    with driver.session() as s:
        try:
            s.run(
                "CREATE CONSTRAINT unit_id IF NOT EXISTS "
                "FOR (u:Unit) REQUIRE u.id IS UNIQUE"
            )
        except Exception:
            pass  # ya existe en versiones anteriores del constraint

        for n in nodes:
            uid = n["unit_id"]
            s.run(
                "MERGE (u:Unit {id: $id}) "
                "SET u.label = $label, u.unit_class = $cls, "
                "    u.age = $age, u.img_key = $img",
                id=uid,
                label=n.get("label", uid),
                cls=n.get("class", ""),
                age=n.get("age", ""),
                img=UNIT_IMG_KEYS.get(uid, ""),
            )
        print(f"[OK] {len(nodes)} nodos Unit creados/actualizados")

        # Borrar edges existentes para reimport idempotente
        s.run("MATCH ()-[r:COUNTERS]->() DELETE r")

        for e in edges:
            s.run(
                """
                MATCH (a:Unit {id: $from_id}), (b:Unit {id: $to_id})
                MERGE (a)-[r:COUNTERS {context: $context}]->(b)
                SET r.weight   = $weight,
                    r.strength = $strength,
                    r.notes    = $notes
                """,
                from_id=e["from"],
                to_id=e["to"],
                weight=float(e.get("weight") or 0.5),
                strength=e.get("strength", "PENDIENTE"),
                context=e.get("context", "general"),
                notes=e.get("notes", ""),
            )
        print(f"[OK] {len(edges)} relaciones COUNTERS importadas")

    driver.close()
    print("[OK] Importacion completa")


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex_rag.import_counter_edges")
    ap.add_argument("--vault", help="override de VAULT_PATH")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    cfg = Config.load()
    vault_path = Path(args.vault) if args.vault else cfg.require_vault()
    run_import(vault_path, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
