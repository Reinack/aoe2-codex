"""Parseo de una nota: frontmatter, título, tipo, wikilinks y secciones '## ##'."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

import frontmatter

# [[target]] | [[target|alias]] | [[target#anchor]] | [[#anchor-en-misma-nota]]
WIKILINK_RE = re.compile(r"\[\[([^\]]+)\]\]")
# Convención del vault: encabezado doble "## ##" marca un concepto standalone
CONCEPT_RE = re.compile(r"^##\s+##\s+(.+?)\s*$", re.MULTILINE)
H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)
# Secciones H2 (para detectar bloques "## Tier ...")
H2_RE = re.compile(r"^##\s+(?!#)(.+?)\s*$", re.MULTILINE)
# Valor del tier dentro de un bloque:  **Tier: A**  /  **Tier: Fuerte**
TIER_VALUE_RE = re.compile(r"\*\*Tier:\s*(.+?)\*\*")
# Civ dueña de una unidad única:  "### Tecnologías únicas aplicables (Aztecs)"
# Da el nombre EXACTO del archivo de civ (sin el problema demonym Aztec→Aztecs).
UNIQUE_UNIT_CIV_RE = re.compile(r"aplicables\s*\(([^)]+)\)", re.IGNORECASE)
# Civ dueña de una tech única: sección "## Civilizaciones con acceso" -> nombre civ
ACCESS_SECTION_RE = re.compile(
    r"##\s+Civilizaciones con acceso\s*\n(.*?)(?:\n##\s|\Z)", re.DOTALL
)


@dataclass
class ParsedNote:
    relpath: str
    title: str
    type: str                       # carpeta de primer nivel: civs, strategies, ...
    tags: list[str] = field(default_factory=list)
    links: list[str] = field(default_factory=list)   # targets crudos (sin resolver)
    concepts: list[str] = field(default_factory=list)  # títulos de secciones "## ##"
    ratings: list[dict] = field(default_factory=list)  # {list, value} de bloques "## Tier"
    props: dict = field(default_factory=dict)          # frontmatter escalar -> propiedades
    unique_unit_civ: str | None = None                 # civ dueña, si es unidad única
    unique_tech_civ: str | None = None                 # civ dueña, si es tech única
    frontmatter: dict = field(default_factory=dict)


def _extract_links(body: str) -> list[str]:
    """Devuelve targets de wikilink, sin alias ni ancla, ignorando self-links '#...'."""
    targets: list[str] = []
    for raw in WIKILINK_RE.findall(body):
        # En tablas markdown el pipe del alias se escapa como '\|' -> desescapar
        raw = raw.replace("\\|", "|").replace("\\#", "#")
        target = raw.split("|", 1)[0]      # quitar alias  [[t|alias]]
        target = target.split("#", 1)[0]   # quitar ancla  [[t#sec]]
        target = target.rstrip("\\").strip()
        if not target:                     # era un self-link [[#seccion]]
            continue
        targets.append(target)
    # de-duplicar preservando orden
    seen: set[str] = set()
    out: list[str] = []
    for t in targets:
        key = t.lower()
        if key not in seen:
            seen.add(key)
            out.append(t)
    return out


def _extract_ratings(body: str) -> list[dict]:
    """Extrae bloques '## Tier <lista>' con su valor '**Tier: <valor>**'."""
    ratings: list[dict] = []
    # split por headers H2 conservando el título: [pre, h2_1, body_1, h2_2, body_2, ...]
    parts = H2_RE.split(body)
    it = iter(parts[1:])
    for header, section in zip(it, it):
        header = header.strip()
        if not header.lower().startswith("tier"):
            continue
        m = TIER_VALUE_RE.search(section)
        if m:
            ratings.append({"list": header, "value": m.group(1).strip()})
    return ratings


def _safe_props(meta: dict) -> dict:
    """Frontmatter -> propiedades Neo4j (solo escalares y listas de escalares)."""
    out: dict = {}
    scalar = (str, int, float, bool)
    for key, value in meta.items():
        if key in ("tags", "title"):
            continue
        if isinstance(value, scalar):
            out[key] = value
        elif isinstance(value, list) and all(isinstance(x, scalar) for x in value):
            out[key] = [str(x) for x in value]
    return out


def parse_note(abspath: Path, relpath: str) -> ParsedNote:
    # utf-8-sig descarta el BOM presente en las notas del vault
    text = abspath.read_text(encoding="utf-8-sig")
    post = frontmatter.loads(text)
    meta = post.metadata or {}
    body = post.content

    note_type = relpath.split("/", 1)[0] if "/" in relpath else "root"

    # Civ dueña, solo para notas de unidad única (units/unique/)
    unique_unit_civ = None
    if relpath.startswith("units/unique/"):
        m = UNIQUE_UNIT_CIV_RE.search(body)
        if m:
            unique_unit_civ = m.group(1).strip()

    # Civ dueña, solo para notas de tech única (technologies/unique/)
    unique_tech_civ = None
    if relpath.startswith("technologies/unique/"):
        sec = ACCESS_SECTION_RE.search(body)
        if sec:
            for raw_line in sec.group(1).splitlines():
                line = raw_line.strip()
                if line and not line.startswith(("**", "|", "#", "<", "-", ">", "*")):
                    unique_tech_civ = line
                    break

    # título: frontmatter > primer H1 > nombre de archivo
    title = str(meta.get("title") or "").strip()
    if not title:
        m = H1_RE.search(body)
        title = m.group(1).strip() if m else Path(relpath).stem

    raw_tags = meta.get("tags", [])
    if isinstance(raw_tags, str):
        raw_tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
    tags = [str(t) for t in raw_tags]

    return ParsedNote(
        relpath=relpath,
        title=title,
        type=note_type,
        tags=tags,
        links=_extract_links(body),
        concepts=[c.strip() for c in CONCEPT_RE.findall(body)],
        ratings=_extract_ratings(body),
        props=_safe_props(meta),
        unique_unit_civ=unique_unit_civ,
        unique_tech_civ=unique_tech_civ,
        frontmatter=dict(meta),
    )


def build_resolver(all_relpaths: list[str]):
    """Crea un resolver de wikilinks -> relpath canónico.

    Obsidian resuelve por ruta ('civs/Georgians') o por nombre de archivo
    ('Georgians', match en cualquier carpeta). Replicamos ambos.
    """
    by_path: dict[str, str] = {}
    by_name: dict[str, list[str]] = {}
    for rel in all_relpaths:
        key = rel[:-3] if rel.endswith(".md") else rel
        key = key.replace("\\", "/")
        by_path[key.lower()] = rel
        name = key.rsplit("/", 1)[-1]
        by_name.setdefault(name.lower(), []).append(rel)

    def resolve(target: str) -> str | None:
        t = target.strip().replace("\\", "/")
        if t.lower().endswith(".md"):
            t = t[:-3]
        t = t.lower()
        if t in by_path:
            return by_path[t]
        name = t.rsplit("/", 1)[-1]
        matches = by_name.get(name)
        if matches:
            return matches[0]  # determinístico; ambigüedad se reporta en lint futuro
        return None

    return resolve
