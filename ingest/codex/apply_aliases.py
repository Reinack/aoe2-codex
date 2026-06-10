"""Inyecta alias ES(España)/MX(Latam) como frontmatter `aliases:` en el vault.

Fuente: localización oficial de AoE2 (build_alias_map). Match por título inglés.
Preserva BOM, fin de línea y el resto del frontmatter. Idempotente: salta notas
que ya tienen `aliases:`.

    python -m codex.apply_aliases            # aplica
    python -m codex.apply_aliases --dry-run  # solo reporta
"""

from __future__ import annotations

import argparse
import glob
import os
import re

from .aliases import build_alias_map
from .config import Config

FM_RE = re.compile(r"^---[ \t]*\r?\n(.*?)\r?\n---[ \t]*\r?\n", re.DOTALL)
H1_RE = re.compile(r"^#\s+(.+)", re.MULTILINE)
ALIASES_KEY_RE = re.compile(r"(?m)^aliases[ \t]*:")


def _title(text: str) -> str | None:
    m = H1_RE.search(text)
    return m.group(1).strip() if m else None


def lookup(amap: dict[str, list[str]], title: str) -> list[str] | None:
    al = amap.get(title.lower())
    if al:
        return al
    if title.lower().startswith("elite "):          # Elite X hereda de X
        base = amap.get(title[6:].lower())
        if base:
            return [f"{a} de élite" for a in base]
    return None


def _yaml_list(aliases: list[str]) -> str:
    return "[" + ", ".join(f'"{a}"' for a in aliases) + "]"


def inject(path: str, aliases: list[str]) -> str:
    """Devuelve 'added' | 'skip-has-aliases' | 'skip-no-title'."""
    data = open(path, "rb").read()
    had_bom = data[:3] == b"\xef\xbb\xbf"
    text = data.decode("utf-8-sig")
    nl = "\r\n" if "\r\n" in text[:1000] else "\n"

    if _title(text) is None:
        return "skip-no-title"

    line = f"aliases: {_yaml_list(aliases)}"
    m = FM_RE.match(text)
    if m:
        if ALIASES_KEY_RE.search(m.group(1)):
            return "skip-has-aliases"
        text = text[: m.end(1)] + nl + line + text[m.end(1) :]
    else:
        text = f"---{nl}{line}{nl}---{nl}{nl}" + text

    out = ("﻿" if had_bom else "") + text
    open(path, "wb").write(out.encode("utf-8"))
    return "added"


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(prog="codex.apply_aliases", description=__doc__)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    cfg = Config.load()
    amap = build_alias_map()
    counts = {"added": 0, "skip-has-aliases": 0, "skip-no-title": 0, "no-match": 0}
    examples: list[str] = []

    for folder in ("civs", "units", "technologies"):
        pattern = os.path.join(str(cfg.vault_path), folder, "**", "*.md")
        for path in glob.glob(pattern, recursive=True):
            text = open(path, encoding="utf-8-sig").read()
            title = _title(text)
            aliases = lookup(amap, title) if title else None
            if not aliases:
                counts["no-match"] += 1
                continue
            if args.dry_run:
                counts["added"] += 1
                if len(examples) < 8:
                    examples.append(f"{title} -> {aliases}")
                continue
            res = inject(path, aliases)
            counts[res] += 1
            if res == "added" and len(examples) < 8:
                examples.append(f"{title} -> {aliases}")

    tag = "[dry-run] " if args.dry_run else ""
    print(f"{tag}añadidas: {counts['added']}  | ya tenían: {counts['skip-has-aliases']}"
          f"  | sin match: {counts['no-match']}")
    for e in examples:
        print(f"  {e}")


if __name__ == "__main__":
    main()
