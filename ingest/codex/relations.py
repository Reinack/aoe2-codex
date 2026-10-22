"""Relaciones tipadas entre notas, derivadas de DÓNDE vive cada wikilink.

Todo wikilink entra al grafo como (:Note)-[:LINKS_TO]->(:Note), que la web muestra
como "menciona". Pero la mayoría de los links de la wiki pública viven en secciones
con un significado preciso: la "Cadena de mejora" de una unidad, sus "Tecnologías que
la mejoran", el campo **Edificio** de la tabla de stats, la línea **Favorable para:**
de un matchup… Este módulo traduce ese contexto a una relación específica, para que
el grafo diga "Knight evoluciona a Cavalier" o "Bloodlines mejora a Knight" en vez de
"relacionado con".

El contexto de un link es:
  origen    ruta de la nota (units/cavalry/knight, meta/patch-185872, …)
  sección   el H2 bajo el que está (sin lo que va entre paréntesis)
  campo     la última etiqueta en negrita ANTES del link en la misma línea
            ("| **Edificio** | [[…]] |", "**Mapas:** [[…]]")
  rótulo    la última línea de la sección que empieza con una etiqueta en negrita
            ("**Débil contra:**" vale para las viñetas que la siguen)
  destino   carpeta de la nota enlazada

La primera regla que matchea gana. Un link sin regla queda solo como LINKS_TO.
Las reglas siguen las plantillas del SCHEMA de la wiki (D:\\Boveda\\AoE-Wiki\\SCHEMA.md,
sección "Relaciones"): si cambia una plantilla, se actualiza la regla.

`reverse=True` invierte el sentido: el link sale de la nota, pero la relación va del
destino hacia la nota (la unidad enlaza a la tech en "Tecnologías que la mejoran",
pero la relación es (tech)-[:IMPROVES]->(unidad)).
"""
from __future__ import annotations

import re
from dataclasses import dataclass

# tipo → (etiqueta saliente, etiqueta entrante). Espejo para la web en
# codex-web/src/lib/graph/rels.ts (REL_LABEL): si se agrega un tipo, agregarlo allá.
RELACIONES: dict[str, tuple[str, str]] = {
    "UPGRADES_TO": ("evoluciona a", "evoluciona de"),
    "IMPROVES": ("mejora a", "mejorada por"),
    "AFFECTS": ("afecta a", "afectada por"),
    "REQUIRES": ("requiere", "requisito de"),
    "TRAINS": ("entrena", "se entrena en"),
    "RESEARCHES": ("investiga", "se investiga en"),
    "HAS_UNIT": ("tiene la unidad", "disponible para"),
    "HAS_TECH": ("tiene la tecnología", "disponible para"),
    "HAS_BUILDING": ("tiene el edificio", "disponible para"),
    "LACKS": ("no tiene", "no disponible para"),
    "COUNTERS": ("counterea a", "counterada por"),
    "BONUS_ON": ("bonifica a", "bonificada por"),
    "SYNERGY_WITH": ("sinergia en equipo con", "sinergia en equipo con"),
    "BENEFITS_FROM": ("aprovecha el bonus de equipo de", "su bonus de equipo le sirve a"),
    "HAS_MATCHUP": ("matchup", "matchup de"),
    "FAVORS": ("favorece a", "favorecida en"),
    "PLAYED_ON": ("se jugó en", "matchup jugado acá"),
    "IS_TYPE": ("es de tipo", "mapa de este tipo"),
    "RANKS": ("rankea a", "rankeada en"),
    "FEATURES": ("incluye a", "figura en"),
    "CHANGES": ("modifica a", "modificada en"),
    "SUITS": ("recomendada para", "estrategia recomendada"),
    "USES": ("usa", "usada en"),
    "RELATED_TO": ("relacionado con", "relacionado con"),
}


@dataclass(frozen=True)
class Regla:
    rel: str
    origen: str = ""          # regex sobre la ruta de la nota de origen (sin .md)
    seccion: str = ""         # regex sobre el H2
    campo: str = ""           # regex sobre el campo o, si no hay, el rótulo
    destino: str = ""         # regex sobre la carpeta (o ruta) destino
    reverse: bool = False

    def aplica(self, ctx: dict) -> bool:
        return all(
            not patron or re.search(patron, ctx[clave], re.IGNORECASE)
            for clave, patron in (("origen", self.origen), ("seccion", self.seccion),
                                  ("campo", self.campo), ("destino", self.destino))
        )


TIER = r"^tier|ranking|^tiers$|^[sabcdef] tier|top ?\d|las mejores|las más flojas|tier list"

REGLAS: list[Regla] = [
    # --- unidades, techs y edificios -------------------------------------------
    Regla("IMPROVES", "^(units|buildings)/", r"^tecnologías que (la|lo) mejoran", destino="^technologies$", reverse=True),
    Regla("HAS_UNIT", "^units/", "^civilizaciones con acceso", destino="^civs$", reverse=True),
    Regla("HAS_TECH", "^technologies/", "^civilizaciones con acceso", destino="^civs$", reverse=True),
    Regla("HAS_BUILDING", "^buildings/", "^civilizaciones con acceso", destino="^civs$", reverse=True),
    Regla("TRAINS", "^units/", campo="^edificio$", destino="^buildings$", reverse=True),
    Regla("RESEARCHES", "^technologies/", campo="^edificio$", destino="^buildings$", reverse=True),
    Regla("TRAINS", "^buildings/", "^qué entrena", destino="^units$"),
    Regla("RESEARCHES", "^buildings/", "^qué entrena", destino="^technologies$"),
    Regla("AFFECTS", "^technologies/", "^efecto$", destino="^(units|buildings)$"),
    Regla("COUNTERS", "^units/", "^counters$", campo="^fuerte contra", destino="^units$"),
    Regla("COUNTERS", "^units/", "^counters$", campo="^débil contra", destino="^units$", reverse=True),
    Regla("BONUS_ON", "^(units|buildings|technologies)/", r"^bonus(es)? de civilización|^por civilización", destino="^civs$", reverse=True),
    # --- civs -------------------------------------------------------------------
    Regla("BONUS_ON", "^civs/", "^bonificaciones", destino="^(units|technologies|buildings)$"),
    Regla("BENEFITS_FROM", "^civs/", "^team games", campo="ajenos|aprovecha", destino="^civs$"),
    Regla("SYNERGY_WITH", "^civs/", "^team games", destino="^civs$"),
    Regla("HAS_MATCHUP", "^civs/", "^matchups", destino="^matchups$"),
    Regla("RANKS", "^civs/", "^tier", destino="^meta$", reverse=True),
    Regla("FEATURES", "^civs/", destino="^meta$", reverse=True),
    Regla("SUITS", "^civs/", r"^plan de juego|^relacionado", destino="^strategies$", reverse=True),
    # --- matchups ---------------------------------------------------------------
    Regla("FAVORS", "^matchups/", campo="^favorable para", destino="^civs$"),
    Regla("PLAYED_ON", "^matchups/", campo="^mapas", destino="^maps/(?!tipo-)"),
    # --- mapas ------------------------------------------------------------------
    Regla("IS_TYPE", "^maps/", campo="^tipo$", destino="^maps/tipo-"),
    Regla("IS_TYPE", "^maps/", "^mapas de este tipo", destino="^maps/(?!tipo-)", reverse=True),
    Regla("FAVORS", "^maps/", "civs que destacan", destino="^civs$"),
    Regla("SUITS", "^maps/", destino="^strategies$", reverse=True),
    # --- meta -------------------------------------------------------------------
    Regla("CHANGES", "^meta/patch-", destino="^(civs|units|technologies|buildings)$"),
    Regla("RANKS", "^meta/", TIER, destino="^(civs|units)$"),
    Regla("FEATURES", "^meta/", r"^(?!relacionado)", destino="^(civs|units)$"),
    # --- estrategias ------------------------------------------------------------
    Regla("SUITS", "^strategies/", r"civs|^idea$|roles|variantes|build order|cómo se mejora", destino="^civs$"),
    Regla("SUITS", "^strategies/", campo="^civs", destino="^civs$"),
    Regla("USES", "^strategies/", r"tecnologías clave|build order|unidades clave", destino="^(technologies|units|buildings)$"),
    # --- genérico curado --------------------------------------------------------
    Regla("RELATED_TO", seccion=r"^(relacionado|ver también)"),
]

H2_RE = re.compile(r"^## (.+?)\s*$")
LINK_RE = re.compile(r"\[\[([^\]]+)\]\]")
NEGRITA_RE = re.compile(r"\*\*([^*]+?)\*\*")
ROTULO_RE = re.compile(r"^\s*(?:[-|]\s*)?\*\*([^*]+?)\*\*")
FLECHA_RE = re.compile(r"→|->")


def _target(raw: str) -> str:
    raw = raw.replace("\\|", "|")
    return raw.split("|", 1)[0].split("#", 1)[0].rstrip("\\").strip()


def _limpio(etiqueta: str) -> str:
    return etiqueta.strip().rstrip(":").strip()


def typed_links(relpath: str, body: str) -> list[tuple[str, str, bool]]:
    """[(target crudo, tipo, reverse)] de los links de la nota que tienen relación tipada."""
    partes = relpath.split("/")
    carpeta = partes[0]
    origen = relpath[:-3] if relpath.endswith(".md") else relpath
    out: list[tuple[str, str, bool]] = []
    vistos: set[tuple[str, str, bool]] = set()
    seccion, rotulo = "(intro)", ""

    def agregar(t: str, rel: str, rev: bool) -> None:
        clave = (t.lower(), rel, rev)
        if t and clave not in vistos:
            vistos.add(clave)
            out.append((t, rel, rev))

    for linea in body.splitlines():
        m = H2_RE.match(linea)
        if m:
            seccion = re.sub(r"\s*\(.*?\)", "", m.group(1)).strip()
            rotulo = ""
            continue
        # El rótulo vale para las viñetas pegadas a él; una línea en blanco lo corta
        # (si no, "**Débil contra:**" contagiaría al párrafo de prosa siguiente).
        if not linea.strip():
            rotulo = ""
        r = ROTULO_RE.match(linea)
        if r:
            rotulo = _limpio(r.group(1))
        for link in LINK_RE.finditer(linea):
            target = _target(link.group(1))
            if not target:
                continue
            destino_ruta = target[:-3] if target.endswith(".md") else target
            destino = destino_ruta.split("/", 1)[0] if "/" in destino_ruta else ""
            antes = linea[: link.start()]

            # "Cadena de mejora": [[A]] → **Esta** → [[C]]. Lo de la izquierda de la
            # nota (en negrita) evoluciona a ella; ella evoluciona a lo de la derecha.
            if carpeta == "units" and seccion.lower().startswith("cadena de mejora") \
                    and FLECHA_RE.search(linea) and destino == "units":
                propia = NEGRITA_RE.search(linea)
                if propia:
                    agregar(target, "UPGRADES_TO", link.start() < propia.start())
                continue
            # "… Requiere [[X]]." en la misma oración.
            req = antes.lower().rfind("requiere")
            if req >= 0 and "." not in antes[req:] and destino in ("technologies", "buildings"):
                agregar(target, "REQUIRES", False)
                continue
            # "Todas salvo [[X]]" en la línea de acceso: esas civs NO lo tienen.
            if seccion.lower().startswith("civilizaciones con acceso") and "todas salvo" in antes.lower():
                agregar(target, "LACKS", True)
                continue

            campos = NEGRITA_RE.findall(antes)
            ctx = {
                "origen": origen,
                "seccion": seccion,
                "campo": _limpio(campos[-1]) if campos else rotulo,
                "destino": destino_ruta if destino == "maps" else destino,
            }
            regla = next((r for r in REGLAS if r.aplica(ctx)), None)
            if regla:
                agregar(target, regla.rel, regla.reverse)
    # Un matchup pertenece a sus dos civs aunque las fichas de civ no lo enlacen.
    if carpeta == "matchups" and "-vs-" in partes[-1]:
        for civ in partes[-1][:-3].split("-vs-", 1):
            agregar(f"civs/{civ}", "HAS_MATCHUP", True)
    return out
