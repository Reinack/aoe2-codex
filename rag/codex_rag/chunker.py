"""Divide una nota en chunks por sección H2 (incluye las '## ##' standalone)."""

from __future__ import annotations

import hashlib
import re

import frontmatter

H2_RE = re.compile(r"^##\s+(.+?)\s*$")   # '## X' y '## ## X'; no matchea '### X'
MIN_CHARS = 40                            # descarta secciones triviales


def chunk_text(raw: str, title: str) -> list[dict]:
    """Devuelve [{ord, heading, text}] a partir del cuerpo de la nota."""
    body = frontmatter.loads(raw).content
    sections: list[tuple[str, list[str]]] = [("intro", [])]
    for line in body.splitlines():
        m = H2_RE.match(line)
        if m and not line.startswith("###"):
            heading = m.group(1).lstrip("#").strip() or "intro"
            sections.append((heading, []))
        else:
            sections[-1][1].append(line)

    chunks: list[dict] = []
    for i, (heading, lines) in enumerate(sections):
        text = "\n".join(lines).strip()
        if len(text) < MIN_CHARS:
            continue
        chunks.append({"ord": i, "heading": heading, "text": text})
    return chunks


def embed_input(
    title: str, heading: str, text: str, aliases: list[str] | None = None
) -> str:
    """Texto a embeddear: contexto (título + alias ES/MX + sección) + cuerpo.

    Incluir los alias en español hace que una query en cualquier locale
    ('Hostigador', 'Indostanos') matchee el nodo de nombre inglés.
    """
    name = f"{title} ({' / '.join(aliases)})" if aliases else title
    prefix = f"{name} — {heading}" if heading != "intro" else name
    return f"{prefix}\n\n{text}"


def chunk_hash(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8")).hexdigest()
