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
  const civsMod  = await import(urlOf(join(TREE_DATA, "civ", "index.js")));

  const NODES = nodesMod.NODES;
  const UNIT_STATS = unitsMod.UNIT_STATS;
  const REGIONAL_UNIT_STATS = unitsMod.REGIONAL_UNIT_STATS;
  const UNIQUE_UNIT_STATS = unitsMod.UNIQUE_UNIT_STATS;
  const TECHS = techMod.TECHS;
  const CIVS = civsMod.default || civsMod.CIVS;

  // Nombres legibles: el locale no exporta, lo leemos por regex.
  //   ej:  militia:      { name: 'Militia',  effect: '...' }
  const names = parseLocaleNames(join(TREE_LOCALES, "en.js"));

  // Índice de stats por id de unidad (genérica + regional + única).
  const unitStats = { ...UNIT_STATS, ...REGIONAL_UNIT_STATS, ...UNIQUE_UNIT_STATS };

  return { NODES, unitStats, TECHS, CIVS, names, TREE_DATA };
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
