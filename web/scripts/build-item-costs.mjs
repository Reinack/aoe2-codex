// Genera web/data/item-costs.json a partir del árbol tecnológico vendorizado.
// Para cada nodo entrenable (unidad, con `train_cost`) o construible (edificio, con
// `build_cost`) emite { id, name, kind, category, age, cost, time }. Es la fuente de
// verdad de la "demanda" de la calculadora de producción.
//
//   node web/scripts/build-item-costs.mjs
//
// Usa TREE_DATA_DIR apuntando a la copia vendorizada (web/public/tree/src/data) para
// que funcione en el deploy (query-only, sin el clon externo del árbol). El JSON se
// commitea. Ver [[strategies/military-production]].
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");

// Apuntar el data-layer del árbol a la copia vendorizada dentro de web/public.
process.env.TREE_DATA_DIR =
  process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");

const { loadTree } = await import("../techtree/load.mjs");

// Placeholders genéricos del árbol que no son unidades reales seleccionables.
const SKIP = new Set(["uniqueunit", "eliteunique"]);

// Edad numérica → clave legible (el árbol usa 0=Dark en edificios, 1=Feudal en units…).
const AGE_NAME = ["dark", "feudal", "castle", "imperial"];

// Categoría amigable de edificios para agrupar en el picker.
const BUILDING_CATEGORY = {
  barracks: "military", archery: "military", stable: "military", siege: "military",
  castle: "military", dock: "military", monastery: "military", fortified_church: "military",
  tc: "economy", tc_castle: "economy", house: "economy", mill: "economy", farm: "economy",
  folwark: "economy", pasture: "economy", fishtrap: "economy", mining: "economy",
  lumber: "economy", market: "economy", mulecart: "economy", tahsili: "economy",
  university: "economy", blacksmith: "economy", harbor: "economy",
  feitoria: "economy", caravanserai: "economy", wonder: "special",
  outpost: "defense", watchtower: "defense", guardtower: "defense", keep: "defense",
  bombardtower: "defense", palisadewall: "defense", palisadegate: "defense",
  stonewall: "defense", gate: "defense", fortifiedwall: "defense",
  krepost: "defense", donjon: "defense",
};

const t = await loadTree();

// Correcciones puntuales: el árbol vendorizado trae costos incorrectos para estas 2
// unidades únicas (verificado contra D:\Boveda\Aoe\counters\all-units-stats.md, que
// extrae de empires2_x2_p1.dat). tarkan_s no necesita corrección (ya coincide).
const COST_FIX = {
  kipchak_c: { food: 0, wood: 60, gold: 35 },  // era { food: 40, gold: 35 }
  huskarl_b: { food: 75, gold: 35 },           // era { food: 52, gold: 26 }
};

const items = [];
for (const n of t.NODES) {
  if (SKIP.has(n.id)) continue;
  const isUnit = !!n.train_cost;
  const isBuilding = !!n.build_cost;
  if (!isUnit && !isBuilding) continue;

  const cost = COST_FIX[n.id] || (isUnit ? n.train_cost : n.build_cost);
  // Tiempo: unidades → `train` de unitStats; edificios → `build_time` del nodo.
  const stat = t.unitStats[n.id];
  let time = isUnit ? (stat && stat.train) : n.build_time;
  const timeApprox = time == null;
  if (time == null) time = isUnit ? 30 : 50; // fallback razonable

  const name = n.name || t.names[n.id] || n.id;
  const kind = isUnit ? "unit" : "building";
  const category = isUnit
    ? (n.building || "other")               // arquería/establo/… (edificio productor)
    : (BUILDING_CATEGORY[n.id] || "economy");

  items.push({
    id: n.id,
    name,
    kind,
    category,                                // agrupador del picker
    variant: n.variant || "generic",        // generic | regional | unique
    age: AGE_NAME[n.age] ?? "feudal",
    cost: { food: cost.food || 0, wood: cost.wood || 0, gold: cost.gold || 0, stone: cost.stone || 0 },
    time,
    imgPath: n.imgPath || null,            // p.ej. "img/Unit/17.png" → icono del árbol
    ...(timeApprox ? { timeApprox: true } : {}),
  });
}

// Orden estable: primero unidades por edificio, luego edificios por categoría.
items.sort((a, b) =>
  (a.kind === b.kind ? 0 : a.kind === "unit" ? -1 : 1) ||
  a.category.localeCompare(b.category) ||
  a.name.localeCompare(b.name));

const OUT = join(WEB, "data", "item-costs.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(items, null, 2) + "\n");
console.log(`item-costs.json: ${items.length} items ` +
  `(${items.filter(i => i.kind === "unit").length} unidades, ` +
  `${items.filter(i => i.kind === "building").length} edificios) → ${OUT}`);
