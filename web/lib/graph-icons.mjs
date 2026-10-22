// Ícono de cada nota del grafo, resuelto contra el árbol vendorizado (public/tree).
//
// Devuelve rutas relativas a /tree/ (mismo formato que `imgPath` del árbol:
// "img/Unit/8.png", "img/Civs/britons.png"), así el frontend Express las sirve
// same-origin y codex-web las pasa por su proxy /api/icon sin cambios.
//
// Solo tienen ícono las notas que son una entidad del juego: civs, unidades,
// tecnologías y edificios. Matchups, estrategias, jugadores, mapas… quedan sin
// ícono (el frontend dibuja el círculo de color de su tipo).
//
// Resolución, en orden:
//   1) civs/X.md                    → emblema img/Civs/x.png
//   2) tree_id de la nota (ingest)  → imgPath del nodo del árbol
//   3) nombre (archivo o título)    → índice de nombres EN/ES del árbol
//      (nodos genéricos, nodos del juego y unidades/techs únicas por civ)

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { slugify } from "../techtree/load.mjs";

// Placeholders del árbol (UU/UT genéricas): su ícono no identifica a nadie.
const PLACEHOLDERS = new Set(["uniqueunit", "eliteunique", "uniquetech1", "uniquetech2"]);
// Carpetas del vault que son entidades del juego (el `type` de la nota).
const ENTITY_TYPES = new Set(["units", "technologies", "buildings"]);

// Los locales del árbol son scripts de browser (`const LOCALE_EN = {…}` sin export).
function readLocale(file, name) {
  const src = readFileSync(file, "utf-8").replace(/^﻿/, "");
  return new Function(`${src}\nreturn ${name};`)();
}

export async function buildIconIndex(treeDir) {
  const data = join(treeDir, "src", "data");
  const imp = (f) => import(pathToFileURL(join(data, f)).href);
  const { NODES } = await imp("nodes.js");
  const { UP_NODES } = await imp("upstream_nodes.js");
  const civsMod = await imp("index.js");
  const CIVS = civsMod.default || civsMod.CIVS;
  const en = readLocale(join(treeDir, "src", "locales", "en.js"), "LOCALE_EN");
  const es = readLocale(join(treeDir, "src", "locales", "es.js"), "LOCALE_ES");

  const civIcons = new Set(
    readdirSync(join(treeDir, "img", "Civs")).map((f) => f.replace(/\.png$/i, "").toLowerCase()));

  // El árbol referencia algunos PNG que no vendorizamos (ej. la casa): esos no cuentan.
  const exists = (img) => img && existsSync(join(treeDir, img));

  const byId = new Map();
  for (const n of NODES) if (exists(n.imgPath) && !PLACEHOLDERS.has(n.id)) byId.set(n.id, n.imgPath);
  for (const [id, n] of Object.entries(UP_NODES)) if (exists(n.pic) && !byId.has(id)) byId.set(id, n.pic);

  // nombre (slug) → ícono. El primero gana: genéricos antes que variantes.
  const byName = new Map();
  const add = (name, img) => {
    const k = name && slugify(name);
    if (k && exists(img) && !byName.has(k)) byName.set(k, img);
  };
  for (const [id, img] of byId) {
    add(id.replace(/_/g, " "), img);
    add(en.nodes?.[id]?.name, img);
    add(es.nodes?.[id]?.name, img);
    add(UP_NODES[id]?.n?.en, img);
    add(UP_NODES[id]?.n?.es, img);
  }
  for (const [id, label] of Object.entries(en.buildings || {})) add(label, byId.get(id));
  for (const [id, label] of Object.entries(es.buildings || {})) add(label, byId.get(id));

  // Únicas por civ: la UU toma su imgPic (y la élite eliteImgPic); las UT, el
  // nodo `{civ}_uniquetechN` del árbol (ícono de castillo/imperial).
  for (const [civ, data] of Object.entries(CIVS || {})) {
    const key = civ.toLowerCase();
    for (const loc of [en, es]) {
      const names = loc.civs?.[key];
      if (!names) continue;
      (names.uniqueUnits || []).forEach((u, i) => {
        const pics = data.uniqueUnits?.[i];
        if (!pics) return;
        if (pics.imgPic != null) add(u.name, `img/Unit/${pics.imgPic}.png`);
        if (pics.eliteImgPic != null) add(u.upgradeName, `img/Unit/${pics.eliteImgPic}.png`);
      });
      (names.uniqueTechs || []).forEach((t, i) => add(t.name, byId.get(`${key}_uniquetech${i + 1}`)));
    }
  }

  return function iconFor({ path, title, type, treeId }) {
    const file = String(path || "").split("/").pop().replace(/\.md$/i, "");
    if (type === "civs") {
      const slug = file.toLowerCase();
      return civIcons.has(slug) ? `img/Civs/${slug}.png` : null;
    }
    if (!ENTITY_TYPES.has(type)) return null;
    if (treeId && byId.has(treeId)) return byId.get(treeId);
    for (const name of [file, title]) {
      const k = name && slugify(name);
      if (k && byName.has(k)) return byName.get(k);
    }
    return null;
  };
}
