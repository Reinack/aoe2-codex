// Carga el data-layer del Aoe2-Tech-Tree-Advanced (ES modules) dentro de Node.
//
// El repo del árbol está pensado para el browser: los módulos hacen `window.X = ...`
// y no exportan los nombres legibles (el locale `en.js` define `const LOCALE_EN`
// sin export). Acá:
//   1) shimeamos globalThis.window para que los `window.X = ...` no exploten,
//   2) importamos los módulos hoja directos (evitamos data/index.js que ademas
//      toca window de forma más agresiva),
//   3) parseamos los nombres legibles del locale por regex.
//
// Exporta un objeto consolidado y normalizado, listo para mapear/ingestar.

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

// Raíz del data-layer del árbol (repo clonado al lado del codex).
const TREE_DATA = process.env.TREE_DATA_DIR
  || "D:/Proyectos/Aoe2-Tech-Tree-Advanced/public/src/data";
const TREE_LOCALES = join(TREE_DATA, "..", "locales");

// Shim mínimo: los módulos del árbol asignan a window.* al cargarse.
if (!globalThis.window) globalThis.window = {};

const urlOf = (p) => pathToFileURL(p).href;

export async function loadTree() {
  const nodesMod = await import(urlOf(join(TREE_DATA, "nodes.js")));
  const unitsMod = await import(urlOf(join(TREE_DATA, "units.js")));
  const techMod  = await import(urlOf(join(TREE_DATA, "tech_data.js")));
  // Desde el Update 185872 no hay civ/index.js: el índice de civs vive en data/index.js.
  const civsMod  = await import(urlOf(join(TREE_DATA, "index.js")));
  const { CIV_TREES } = await import(urlOf(join(TREE_DATA, "civ_trees.js")));
  const { UP_NODES } = await import(urlOf(join(TREE_DATA, "upstream_nodes.js")));

  const NODES = nodesMod.NODES;
  const UNIT_STATS = unitsMod.UNIT_STATS;
  const REGIONAL_UNIT_STATS = unitsMod.REGIONAL_UNIT_STATS;
  const UNIQUE_UNIT_STATS = unitsMod.UNIQUE_UNIT_STATS;
  const TECHS = techMod.TECHS;
  const UNIT_CLASSES = techMod.UNIT_CLASSES;             // clase -> [ids] (para expandir affects)
  const UNIQUE_UNIT_CLASSES = techMod.UNIQUE_UNIT_CLASSES; // UU (por nombre ES) -> [clases]
  const CIVS = civsMod.default || civsMod.CIVS;

  // Los civ/*.js ya no traen `available`: la disponibilidad sale de la grilla del
  // árbol del juego (CIV_TREES). Se reconstruye con la misma regla que app.js
  // (availableIds) para que ingest / build-civ-mods sigan leyendo `civ.available`.
  for (const [key, civ] of Object.entries(CIVS)) {
    if (CIV_TREES[key]) civ.available = [...availableIds(CIV_TREES[key])];
  }

  // Nombres legibles: el locale no exporta, lo leemos por regex.
  //   ej:  militia:      { name: 'Militia',  effect: '...' }
  // Los ids que solo existen en el árbol del juego toman el nombre oficial de UP_NODES.
  const names = parseLocaleNames(join(TREE_LOCALES, "en.js"));
  for (const [id, n] of Object.entries(UP_NODES)) {
    if (!names[id] && n.n?.en) names[id] = n.n.en;
  }

  // Índice de stats por id de unidad (genérica + regional + única).
  const unitStats = { ...UNIT_STATS, ...REGIONAL_UNIT_STATS, ...UNIQUE_UNIT_STATS };

  return { NODES, unitStats, TECHS, UNIT_CLASSES, UNIQUE_UNIT_CLASSES, CIVS, CIV_TREES, UP_NODES, names, TREE_DATA };
}

// ids disponibles para una civ según su árbol: edificios con `s` y celdas de la
// grilla con estado 1 (celda = [id, estado, código, …]).
export function availableIds(civTree) {
  const set = new Set();
  for (const b of civTree.b) {
    if (b.s) set.add(b.id);
    for (const row of b.g || []) for (const cell of row) if (cell && cell[1]) set.add(cell[0]);
  }
  return set;
}

// Extrae { id: "Nombre legible" } de los bloques `id: { name: '...' }` del locale.
function parseLocaleNames(localePath) {
  const txt = readFileSync(localePath, "utf-8");
  const names = {};
  // Las claves pueden venir con o sin comillas, y el name con comilla simple o doble.
  //   militia:               { name: 'Militia', ... }
  //   "franks_uniquetech1":  { name: "Chivalry", ... }
  const re = /^\s*['"]?([a-z0-9_]+)['"]?\s*:\s*\{\s*name\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/gim;
  let m;
  while ((m = re.exec(txt)) !== null) {
    names[m[1]] = (m[2] ?? m[3]).replace(/\\(['"])/g, "$1");
  }
  return names;
}

// slug consistente para emparejar con nombres de notas/títulos del vault.
export function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Permite `node load.mjs` para inspección rápida.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const t = await loadTree();
  const byType = {};
  for (const n of t.NODES) byType[n.type] = (byType[n.type] || 0) + 1;
  console.log("NODES por tipo:", byType);
  console.log("total NODES:", t.NODES.length);
  console.log("unit stats:", Object.keys(t.unitStats).length);
  console.log("techs (con modificador):", Object.keys(t.TECHS).length);
  console.log("civs:", Object.keys(t.CIVS).length);
  console.log("nombres locale:", Object.keys(t.names).length);
  console.log("muestra nombres:", Object.entries(t.names).slice(0, 5));
}
