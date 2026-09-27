// Genera web/data/castle-uu.json: la unidad única de Castillo (roster, con su Elite)
// de cada civilización. El árbol vendorizado modela esta unidad como un placeholder
// genérico (`uniqueunit`/`eliteunique`) cuyo contenido depende de la civ, así que
// no existe como item con costo real: acá se materializa uno por civ.
//
// Fuente de nombre + costo + tiempo + ícono: CIV_TREES[civ].u (civ_trees.js), que
// el árbol genera desde los datos del juego de aoe2techtree (parche vigente). Antes
// era una tabla a mano sacada de all-units-stats.md; quedó desactualizada con el
// Update 185872 (8 civs con costo/tiempo viejo, Tupí con la UU equivocada).
//
// Excluye: cumans/goths/huns/wu — su UU YA es un nodo real y correcto del árbol
// (kipchak_c, huskarl_b, tarkan_s, jian_swordsman, ver build-civ-mods.mjs).
//
//   node web/scripts/build-castle-uus.mjs
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");
process.env.TREE_DATA_DIR =
  process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");

const { loadTree } = await import("../techtree/load.mjs");
const t = await loadTree();

const EXCLUDE = new Set(["cumans", "goths", "huns", "wu"]);

const zero = { food: 0, wood: 0, gold: 0, stone: 0 };
const items = [];
let missingIcons = 0;

const iconPath = (rel) => {
  if (!rel) return null;
  if (!existsSync(join(WEB, "public", "tree", rel))) { missingIcons++; return null; }
  return rel;
};

const civs = Object.keys(t.CIV_TREES).filter((slug) => !EXCLUDE.has(slug)).sort();
for (const slug of civs) {
  const { uniqueunit: uu, eliteunique: elite } = t.CIV_TREES[slug].u || {};
  if (!uu?.tc) { console.warn(`[castle-uu] ${slug}: sin uniqueunit en civ_trees.js, se omite`); continue; }
  const name = uu.n?.en || slug;

  items.push({
    id: `castle_uu_${slug}`,
    name,
    kind: "unit",
    category: "castle",
    variant: "unique",
    age: "castle",
    cost: { ...zero, ...uu.tc },
    time: uu.tt,
    imgPath: iconPath(uu.pic),
    civSlug: slug,
  });
  items.push({
    id: `castle_uu_${slug}_elite`,
    name: `Elite ${name}`,
    kind: "unit",
    category: "castle",
    variant: "unique",
    age: "imperial",
    cost: { ...zero, ...(elite?.tc || uu.tc) },
    time: elite?.tt ?? uu.tt,
    imgPath: iconPath(elite?.pic),
    civSlug: slug,
  });
}

const OUT = join(WEB, "data", "castle-uu.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(items, null, 2) + "\n");
console.log(`castle-uu.json: ${items.length} items (${items.length / 2} civs × 2) → ${OUT}` +
  (missingIcons ? ` (${missingIcons} íconos no encontrados en disco)` : ""));
