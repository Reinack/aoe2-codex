"""CLI de sincronización vault -> Neo4j.

    python -m codex.sync           # incremental (solo el delta)
    python -m codex.sync --full    # rebuild total
    python -m codex.sync --watch   # modo live (observa el vault)
"""

from __future__ import annotations

import argparse
import sys
import time

from .config import Config
from .graph import CodexGraph
from .parser import build_resolver, parse_note
from .scanner import (
    compute_diff,
    load_manifest,
    save_manifest,
    scan_vault,
)


def run_sync(cfg: Config, *, full: bool = False) -> None:
    entries = scan_vault(cfg.require_vault(), cfg.exclude_dirs)
    manifest = load_manifest(cfg.manifest_path)
    diff = compute_diff(entries, manifest, full=full)

    mode = "FULL" if full else "incremental"
    print(f"[scan] {len(entries)} notas en el vault  ({mode})")
    print(f"[diff] {diff.summary()}")

    if not diff.touched and not diff.deleted:
        print("[sync] nada que hacer. Grafo en sincronía.")
        return

    resolver = build_resolver(list(entries.keys()))

    with CodexGraph(cfg.neo4j_uri, cfg.neo4j_user, cfg.neo4j_password) as g:
        try:
            g.verify()
        except Exception as exc:  # noqa: BLE001
            raise SystemExit(
                f"No se pudo conectar a Neo4j ({cfg.neo4j_uri}): {exc}\n"
                "¿Levantaste 'docker compose up -d'?"
            )
        g.ensure_schema()

        # borrados primero
        for relpath in diff.deleted:
            g.delete_note(relpath)
        if diff.deleted:
            print(f"[del]  {len(diff.deleted)} notas eliminadas del grafo")

        # upserts
        unresolved = 0
        for i, relpath in enumerate(diff.touched, 1):
            entry = entries[relpath]
            note = parse_note(entry.abspath, relpath)
            resolved: list[str] = []
            for target in note.links:
                hit = resolver(target)
                if hit is None:
                    unresolved += 1
                else:
                    resolved.append(hit)
            # resolver las civs dueñas de la unidad/tech única (-> civs/{X}.md)
            uu_civs: list[str] = []
            for name in note.unique_unit_civs:
                p = resolver(name)
                if p and p.startswith("civs/"):  # solo aristas a notas de civ
                    uu_civs.append(p)
            ut_civ = resolver(note.unique_tech_civ) if note.unique_tech_civ else None
            if ut_civ and not ut_civ.startswith("civs/"):
                ut_civ = None  # solo aristas a notas de civ
            g.upsert_note(note, resolved, unique_unit_civ_paths=uu_civs,
                          unique_tech_civ_path=ut_civ)
            if i % 100 == 0 or i == len(diff.touched):
                print(f"[up]   {i}/{len(diff.touched)} notas procesadas")

        if unresolved:
            print(f"[warn] {unresolved} wikilinks sin resolver (target inexistente)")

        save_manifest(cfg.manifest_path, entries)
        s = g.stats()
        print(
            f"[ok]   grafo: {s['notes']} notas, {s['links']} links, "
            f"{s['concepts']} conceptos, {s['rated']} ratings "
            f"({s['tierlists']} tier-lists), {s['uu']} UU, {s['ut']} UT"
            + (f", {s['stubs']} stubs" if s["stubs"] else "")
        )


def run_watch(cfg: Config) -> None:
    """Modo live: re-sync incremental con debounce ante cualquier cambio .md."""
    from watchdog.events import FileSystemEventHandler
    from watchdog.observers import Observer

    print(f"[watch] observando {cfg.vault_path} ... (Ctrl+C para salir)")
    run_sync(cfg)  # sync inicial

    state = {"dirty": False, "last": 0.0}

    class Handler(FileSystemEventHandler):
        def on_any_event(self, event):
            if event.is_directory or not str(event.src_path).endswith(".md"):
                return
            state["dirty"] = True
            state["last"] = time.time()

    observer = Observer()
    observer.schedule(Handler(), str(cfg.vault_path), recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(0.5)
            # debounce: 1.5s sin nuevos eventos -> sincronizar
            if state["dirty"] and (time.time() - state["last"]) > 1.5:
                state["dirty"] = False
                print("\n[watch] cambio detectado -> sync")
                try:
                    run_sync(cfg)
                except Exception as exc:  # noqa: BLE001
                    print(f"[watch] error en sync: {exc}", file=sys.stderr)
    except KeyboardInterrupt:
        print("\n[watch] detenido.")
    finally:
        observer.stop()
        observer.join()


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex.sync", description=__doc__)
    ap.add_argument("--full", action="store_true", help="rebuild total (ignora hashes)")
    ap.add_argument("--watch", action="store_true", help="modo live (observa el vault)")
    ap.add_argument("--vault", help="override de VAULT_PATH")
    args = ap.parse_args(argv)

    cfg = Config.load(vault_override=args.vault)

    if args.watch:
        run_watch(cfg)
    else:
        run_sync(cfg, full=args.full)


if __name__ == "__main__":
    main()
