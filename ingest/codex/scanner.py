"""Escaneo del vault: hash por nota + detección de cambios vs manifest."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class ScanEntry:
    relpath: str          # ruta POSIX relativa al vault, p.ej. "civs/Georgians.md"
    abspath: Path
    sha1: str
    mtime: float


@dataclass
class Diff:
    added: list[str] = field(default_factory=list)
    modified: list[str] = field(default_factory=list)
    deleted: list[str] = field(default_factory=list)
    unchanged: list[str] = field(default_factory=list)

    @property
    def touched(self) -> list[str]:
        """Notas a (re)procesar: nuevas + modificadas."""
        return self.added + self.modified

    def summary(self) -> str:
        return (
            f"+{len(self.added)} nuevas  ~{len(self.modified)} modif  "
            f"-{len(self.deleted)} borradas  ={len(self.unchanged)} sin cambios"
        )


def _sha1(path: Path) -> str:
    h = hashlib.sha1()
    h.update(path.read_bytes())
    return h.hexdigest()


def scan_vault(vault: Path, exclude_dirs: set[str]) -> dict[str, ScanEntry]:
    """Recorre el vault y devuelve {relpath: ScanEntry} para cada .md no excluido."""
    if not vault.exists():
        raise SystemExit(f"VAULT_PATH no existe: {vault}")

    entries: dict[str, ScanEntry] = {}
    for path in vault.rglob("*.md"):
        rel_parts = path.relative_to(vault).parts
        if any(part in exclude_dirs for part in rel_parts):
            continue
        relpath = path.relative_to(vault).as_posix()
        entries[relpath] = ScanEntry(
            relpath=relpath,
            abspath=path,
            sha1=_sha1(path),
            mtime=path.stat().st_mtime,
        )
    return entries


def load_manifest(manifest_path: Path) -> dict[str, str]:
    """Devuelve {relpath: sha1} de la última ingesta, o {} si no existe."""
    if not manifest_path.exists():
        return {}
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def save_manifest(manifest_path: Path, entries: dict[str, ScanEntry]) -> None:
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    data = {rel: e.sha1 for rel, e in sorted(entries.items())}
    manifest_path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def compute_diff(
    entries: dict[str, ScanEntry], manifest: dict[str, str], *, full: bool = False
) -> Diff:
    """Compara el escaneo actual contra el manifest.

    full=True fuerza reprocesar todo (ignora hashes), pero respeta los borrados.
    """
    diff = Diff()
    for relpath, entry in entries.items():
        prev = manifest.get(relpath)
        if prev is None:
            diff.added.append(relpath)
        elif full or prev != entry.sha1:
            diff.modified.append(relpath)
        else:
            diff.unchanged.append(relpath)
    for relpath in manifest:
        if relpath not in entries:
            diff.deleted.append(relpath)
    return diff
