// Genera web/data/icons.json: catálogo de íconos del árbol (unidades, mejoras, tecnologías,
// edificios) por id, más un índice nombre → id para poner íconos en textos del Lab.
// Fuente: NODES + nombres del locale en inglés del árbol vendorizado (public/tree/src).
//   node web/scripts/build-icons.mjs
// Solo entran ids cuyo archivo existe en public/tree/. Los emblemas de civ no van acá: viven en
// public/img/civs/<slug>.png (los de las 56 civs del juego).
import { writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");
process.env.TREE_DATA_DIR = process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");
const { loadTree } = await import("../techtree/load.mjs");
const t = await loadTree();

// kind visible: a qué familia de pigmento del árbol pertenece el ícono
const KIND = { unit: "unit", upgrade: "unit", tech: "tech", building: "building", defencive: "building" };
const PRIORITY = { unit: 0, upgrade: 1, building: 2, defencive: 2, tech: 3 };   // gana el menor si dos ids comparten nombre

// Respaldo: edificios sin archivo propio en el nodo (ej. house) se resuelven por el `pic` de la grilla de civ.
const PIC = {};
for (const tree of Object.values(t.CIV_TREES || {})) for (const b of tree.b || []) if (b.pic != null && !(b.id in PIC)) PIC[b.id] = `img/Building/${b.pic}.png`;

const items = {};
const byName = {};
let missingFile = 0;
for (const n of t.NODES) {
  const kind = KIND[n.type];
  if (!kind || !n.imgPath) continue;                                 // 'unique' son placeholders por civ: se omiten
  const name = t.names?.[n.id];
  const label = typeof name === "string" ? name : name?.name;
  if (!label) continue;
  let img = n.imgPath;
  if (!existsSync(join(WEB, "public", "tree", img))) {
    if (PIC[n.id] && existsSync(join(WEB, "public", "tree", PIC[n.id]))) img = PIC[n.id];
    else { missingFile++; continue; }
  }
  items[n.id] = { n: label, k: kind, i: img };
  const key = label.toLowerCase();
  const prev = byName[key];
  if (!prev || PRIORITY[n.type] < prev.p) byName[key] = { id: n.id, p: PRIORITY[n.type] };
}
const index = Object.fromEntries(Object.entries(byName).map(([k, v]) => [k, v.id]));

// emblemas de civ disponibles
const civs = readdirSync(join(WEB, "public", "img", "civs")).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, ""));
const ages = { dark: "img/Ages/base_dark_age.png", feudal: "img/Ages/base_feudal_age.png", castle: "img/Ages/base_castle_age.png", imperial: "img/Ages/base_imperial_age.png" };
const stats = { hp: "img/Icon/hp.webp", attack: "img/Icon/attack.webp", armor: "img/Icon/armor.webp", pierce: "img/Icon/pierce_armor.webp",
  range: "img/Icon/range.webp", speed: "img/Icon/speed.webp", rof: "img/Icon/reload.webp" };
const res = { food: "img/food.png", wood: "img/wood.png", gold: "img/gold.png", stone: "img/stone.png" };

writeFileSync(join(WEB, "data", "icons.json"), JSON.stringify({ items, names: index, civs, ages, stats, res }) + "\n");
const byKind = Object.values(items).reduce((a, x) => ((a[x.k] = (a[x.k] || 0) + 1), a), {});
console.log(`icons.json: ${Object.keys(items).length} íconos ${JSON.stringify(byKind)} · ${Object.keys(index).length} nombres · ${civs.length} emblemas · sin archivo: ${missingFile}`);
