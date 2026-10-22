// Genera web/data/eco-techs.json: el subconjunto de tecnologías del árbol que afectan
// la calculadora de producción, con su efecto numérico. Dos familias:
//   • demanda  → cost_pct / *_cost_pct / replace_gold_with_* / production_speed_pct
//                (cambian el costo o el tiempo de entreno de las unidades).
//   • oferta   → gather_speed_pct / carry_capacity / speed_pct
//                (cambian la tasa de recolección de los aldeanos / barcos).
//
//   node web/scripts/build-eco-techs.mjs
//
// El eco-model.json referencia por id qué techs de oferta aplican a cada fuente; el
// motor aplica las de demanda a los items. Nombres legibles desde el locale del árbol.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");
process.env.TREE_DATA_DIR =
  process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");

const { loadTree } = await import("../techtree/load.mjs");
const t = await loadTree();

const DEMAND_KEYS = ["cost_pct", "food_cost_pct", "wood_cost_pct", "gold_cost_pct",
  "stone_cost_pct", "trade_cost_pct", "replace_gold_with_food", "replace_gold_with_wood",
  "production_speed_pct"];
const SUPPLY_KEYS = ["gather_speed_pct", "carry_capacity", "speed_pct"];

const nameOf = (id) => t.names[id] || t.names[id.replace(/_m$/, "")] || id.replace(/_m$/, "");

const out = { demand: {}, supply: {} };
for (const [id, tech] of Object.entries(t.TECHS)) {
  const mod = tech.mod || {};
  const demandMod = {}, supplyMod = {};
  for (const k of DEMAND_KEYS) if (k in mod) demandMod[k] = mod[k];
  for (const k of SUPPLY_KEYS) if (k in mod) supplyMod[k] = mod[k];

  if (Object.keys(demandMod).length) {
    out.demand[id] = { name: nameOf(id), affects: tech.affects || [], mod: demandMod };
  }
  if (Object.keys(supplyMod).length) {
    out.supply[id] = { name: nameOf(id), affects: tech.affects || [], mod: supplyMod };
  }
}

const OUT = join(WEB, "data", "eco-techs.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`eco-techs.json: ${Object.keys(out.demand).length} de demanda, ` +
  `${Object.keys(out.supply).length} de oferta → ${OUT}`);
