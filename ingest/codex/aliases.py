"""Construye el mapa de alias ES(España)/MX(Latam) desde la localización de AoE2.

Fuente: data/locales/{en,es,mx}/strings.json de aoe2techtree (id -> nombre).
El nombre en inglés es la clave de join contra los títulos de las notas.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path

# Ruta a los locales de aoe2techtree (data/locales/{en,es,mx}/strings.json).
# Configurable por la env var AOE2TECHTREE_LOCALES; por defecto se buscan en
# ./data/locales relativo al directorio de trabajo.
DEFAULT_LOCALES = Path(os.environ.get("AOE2TECHTREE_LOCALES", "data/locales"))


def _clean(s: str) -> str:
    """Normaliza nombres del árbol: '<br>\\n' y saltos -> espacio. Descarta tooltips."""
    s = (s or "").replace("<br>", " ").replace("\n", " ").replace("\r", " ")
    return re.sub(r"\s+", " ", s).strip()


def build_alias_map(locales_dir: Path = DEFAULT_LOCALES) -> dict[str, list[str]]:
    """Devuelve {nombre_ingles_lower: [alias_es, alias_mx]} sin inglés ni vacíos.

    Solo nombres cortos (no las descripciones/tooltips con HTML del juego).
    """
    en = json.loads((locales_dir / "en" / "strings.json").read_text(encoding="utf-8"))
    es = json.loads((locales_dir / "es" / "strings.json").read_text(encoding="utf-8"))
    mx = json.loads((locales_dir / "mx" / "strings.json").read_text(encoding="utf-8"))

    amap: dict[str, list[str]] = {}
    for sid, raw in en.items():
        name = _clean(raw)
        # descartar tooltips (texto largo / con markup) — solo nombres de entidad
        if not name or len(name) > 40 or "<" in raw and "<br>" not in raw:
            continue
        aliases: list[str] = []
        seen: set[str] = set()
        for loc in (_clean(es.get(sid, "")), _clean(mx.get(sid, ""))):
            if loc and loc.lower() != name.lower() and loc.lower() not in seen:
                seen.add(loc.lower())
                aliases.append(loc)
        if aliases:
            amap[name.lower()] = aliases
    return amap
