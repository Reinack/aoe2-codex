"""Troceado de notas en chunks por encabezado, listos para embeddings."""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass

# Corta en H2 ('## X') sin tocar H3+ ('### X'). Captura el título de sección.
H2_SPLIT_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
MIN_CHARS = 40        # descartar secciones triviales (encabezados sueltos)
MAX_CHARS = 1800      # límite por chunk (seguro bajo el contexto de nomic ~2048 tok)


@dataclass
class Chunk:
    note_path: str
    ordinal: int
    heading: str
    text: str          # texto a embeber (incluye contexto: título nota > sección)
    chash: str         # hash del contenido -> embedding selectivo

    @property
    def id(self) -> str:
        return f"{self.note_path}::{self.ordinal}"


def _hash(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def _hard_wrap(text: str) -> list[str]:
    """Garantiza trozos <= MAX_CHARS partiendo por líneas y, si hace falta,
    por ventanas de caracteres (tablas sin líneas en blanco)."""
    if len(text) <= MAX_CHARS:
        return [text]
    out, buf = [], ""
    for line in text.split("\n"):
        while len(line) > MAX_CHARS:  # línea individual gigantesca
            out.append(line[:MAX_CHARS])
            line = line[MAX_CHARS:]
        if buf and len(buf) + len(line) + 1 > MAX_CHARS:
            out.append(buf)
            buf = line
        else:
            buf = f"{buf}\n{line}" if buf else line
    if buf:
        out.append(buf)
    return out


def _split_long(text: str) -> list[str]:
    """Parte un bloque largo por párrafos respetando MAX_CHARS (con hard-wrap)."""
    if len(text) <= MAX_CHARS:
        return [text]
    blocks, buf = [], ""
    for para in text.split("\n\n"):
        if len(para) > MAX_CHARS:           # párrafo (o tabla) más largo que el límite
            if buf:
                blocks.append(buf.strip())
                buf = ""
            blocks.extend(_hard_wrap(para))
        elif buf and len(buf) + len(para) + 2 > MAX_CHARS:
            blocks.append(buf.strip())
            buf = para
        else:
            buf = f"{buf}\n\n{para}" if buf else para
    if buf.strip():
        blocks.append(buf.strip())
    return [b for b in blocks if b.strip()]


def chunk_note(note_path: str, title: str, body: str) -> list[Chunk]:
    """Divide el cuerpo de una nota en chunks contextualizados.

    Cada chunk lleva el prefijo 'Título de la nota > Sección' para que el
    embedding y el LLM tengan contexto aunque la sección se lea aislada.
    """
    parts = H2_SPLIT_RE.split(body)
    sections: list[tuple[str, str]] = []

    preamble = parts[0].strip()
    if len(preamble) >= MIN_CHARS:
        sections.append(("(intro)", preamble))

    it = iter(parts[1:])
    for heading, content in zip(it, it):
        heading = heading.lstrip("# ").strip()  # normaliza '## ## X' -> 'X'
        content = content.strip()
        if len(content) < MIN_CHARS:
            continue
        sections.append((heading, content))

    chunks: list[Chunk] = []
    ordinal = 0
    for heading, content in sections:
        for piece in _split_long(content):
            prefix = f"{title} > {heading}\n\n" if heading != "(intro)" else f"{title}\n\n"
            text = prefix + piece
            chunks.append(
                Chunk(
                    note_path=note_path,
                    ordinal=ordinal,
                    heading=heading,
                    text=text,
                    chash=_hash(text),
                )
            )
            ordinal += 1
    return chunks
