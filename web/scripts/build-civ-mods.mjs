// Genera web/data/civ-mods.json a partir de los bonos estructurados de cada civ del
// árbol (public/tree/src/data/civ/*.js, cargados vía loadTree().CIVS).
//
// Captura tres familias de bonos relevantes a la calculadora de producción:
//   1) cost_modifier   → descuentos de costo por clase de unidad (Magyars scout -15%,
//                        Berbers cavalry -15/-20% por edad, Portuguese -20% oro, …).
//   2) stat_modifier de generación → un aldeano en cierta fuente además genera otro
//                        recurso o rinde más (Portuguese forager +wood, Poles stone→gold,
//                        Tatars food_duration, Jurchens food_decay, …).
//   3) uniqueUnits[].cost → override de costo de la UU de la civ.
//   + building_unlock (feitoria) para saber qué civ puede usar ingresos pasivos únicos.
//
//   node web/scripts/build-civ-mods.mjs
//
// Los `scope` del árbol son clases; acá se traducen a ids concretos de item-costs.json
// (cost) o a `source` del eco-model (generación). Los scopes no mapeados se guardan en
// `_unmappedScopes` para poder afinarlos después sin romper nada.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");
process.env.TREE_DATA_DIR =
  process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");

const { loadTree } = await import("../techtree/load.mjs");
const t = await loadTree();

// ids de unidades reales (para expandir scopes que significan "todas las militares", etc.)
const ITEMS = JSON.parse(readFileSync(join(WEB, "data", "item-costs.json"), "utf8"));
const ALL_UNIT_IDS = ITEMS.filter((i) => i.kind === "unit").map((i) => i.id);
const ITEM_IDS = new Set(ITEMS.map((i) => i.id));
const NON_MILITARY = new Set(["villager", "fishingship", "transportship", "tradecog", "tradecart"]);

// imgPath → id, para resolver la UU propia de cada civ (viene por imgPic, no por id).
const IMG_TO_ID = new Map(ITEMS.filter((i) => i.imgPath).map((i) => [i.imgPath, i.id]));
const uuIdForPic = (pic) => (pic == null ? null : IMG_TO_ID.get(`img/Unit/${pic}.png`) || null);

// ── Mapa scope → ids de unidad (para cost_modifier) ──────────────────────────
const LINES = {
  militia: ["militia", "manatarms", "longsword", "twohanded", "champion", "legionary"],
  spearman: ["spearman", "pikeman", "halberdier"],
  eagle: ["eaglescout", "eaglewarrior", "eliteeagle"],
  champi: ["champiscout", "champirunner", "champiwarrior", "elitechampi"],
  archerLine: ["archer", "crossbow", "arbalester"],
  skirm: ["skirmisher", "eliteskirm", "imp_skirmisher"],
  cavArcher: ["cavarcher", "hcavarcher"],
  scout: ["scout", "lightcav", "hussar", "winged_hussar"],
  knight: ["knight", "cavalier", "paladin", "savar"],
  camel: ["camel", "heavycamel", "camel_scout", "imp_camel", "flaming_camel"],
  battleEleph: ["battleeleph", "eliteeleph", "armored_elephant"],
  steppe: ["steppe_lancer", "elite_steppe_lancer"],
  gunpowder: ["handcannon", "bombcannon", "cannongalleon", "elitecannon", "houfnice"],
  scorpion: ["scorpion", "heavyscorpion"],
  siege: ["batteringram", "cappedram", "siegeram", "mangonel", "onager", "siegeonager",
    "scorpion", "heavyscorpion", "bombcannon", "siegetower", "houfnice", "traction_treb",
    "mounted_treb", "rocket_cart", "heavy_rocket_cart", "siege_elephant", "trebuchet"],
  ship: ["galley", "wargalley", "galleon", "firegalley", "fireship", "fastfireship", "hulk",
    "war_hulk", "carrack", "demoraft", "demoship", "heavydemo", "cannongalleon", "elitecannon",
    "dragon_ship", "dromon", "lou_chuan", "catapult_gall", "turtle_ship", "longboat",
    "caravel_d", "thirisadai", "transportship", "tradecog"],
};
const COST_SCOPE_IDS = {
  unit: ALL_UNIT_IDS,
  military_unit: ALL_UNIT_IDS.filter((id) => !NON_MILITARY.has(id)),
  infantry: [...LINES.militia, ...LINES.spearman, ...LINES.eagle, ...LINES.champi,
    "flemish_militia", "jian_swordsman", "temple_guard", "ibirapema", "condottiero",
    "huskarl_b", "fire_lancer", "elite_fire_lancer"],
  foot_archer: [...LINES.archerLine, ...LINES.skirm, "handcannon", "slinger"],
  archer: LINES.archerLine,
  skirmisher: LINES.skirm,
  spearman: LINES.spearman,
  cavalry_archer: LINES.cavArcher,
  light_cavalry: LINES.scout,
  cavalry: [...LINES.scout, ...LINES.knight, ...LINES.camel, ...LINES.steppe,
    ...LINES.battleEleph, "shrivamsha", "elite_shrivamsha", "hei_guang", "heavy_hei_guang",
    "tarkan_s"],
  camel: LINES.camel,
  battleeleph: LINES.battleEleph,
  siege: LINES.siege,
  scorpion: LINES.scorpion,
  traction_treb: ["traction_treb"],
  gunpowder: LINES.gunpowder,
  gunpowder_tech: LINES.gunpowder,
  fishing_ship: ["fishingship"],
  ship: LINES.ship,
  lou_chuan: ["lou_chuan"],
  villager: ["villager"],
  farmer: ["farm"],       // (edificio granja — costo de granja)
  fish_trap: ["fishtrap"],
};

// ── Mapa scope → source del eco-model (para stat_modifier de generación) ─────
const GEN_SCOPE_SOURCE = {
  forager: "berries",
  lumberjack: "lumberjack",
  stone_miner: "stone_miner",
  gold_miner: "gold_miner",
  farmer: "farm",
  livestock: "sheep",
  hunted_livestock: "hunt",
  fish_trap: "fishtrap",
  relic: "relic",
  resource: "all",
};

const AGES = ["dark", "feudal", "castle", "imperial"];
// Normaliza value | value_by_age → [dark,feudal,castle,imperial].
function toByAge(b) {
  if (Array.isArray(b.value_by_age)) return b.value_by_age.slice(0, 4);
  const v = b.value ?? 1;
  return [v, v, v, v];
}

const out = {};
const unmapped = new Set();

for (const [slug, civ] of Object.entries(t.CIVS)) {
  const rec = { cost: [], gen: [], uuCost: [], unlocks: [], buildable: [] };
  const bonuses = [...(civ.bonuses || [])];

  // Construibilidad: `available` del árbol ∩ items reales, más la(s) UU propia(s)
  // (resueltas por imgPic → id, porque en `available` figuran como placeholders
  // "uniqueunit"/"eliteunique"). Incluye bonus de equipo/mercenarios que ya estén
  // en `available` (genitour, kipchak, condottiero…).
  const buildable = new Set((civ.available || []).filter((id) => ITEM_IDS.has(id)));
  for (const uu of civ.uniqueUnits || []) {
    const a = uuIdForPic(uu.imgPic), b = uuIdForPic(uu.eliteImgPic);
    if (a) buildable.add(a);
    if (b) buildable.add(b);
  }
  rec.buildable = [...buildable].sort();

  for (const b of bonuses) {
    if (b.type === "cost_modifier") {
      const ids = COST_SCOPE_IDS[b.scope];
      if (!ids) { unmapped.add(`cost:${b.scope}`); continue; }
      rec.cost.push({
        scope: b.scope, unitIds: ids, resource: b.resource || "all",
        op: b.op || "multiply", valueByAge: toByAge(b), minAge: b.min_age ?? 0,
      });
    } else if (b.type === "stat_modifier" && /generation|decay|duration/.test(b.stat || "")) {
      const source = GEN_SCOPE_SOURCE[b.scope];
      if (!source) { unmapped.add(`gen:${b.scope}`); continue; }
      rec.gen.push({
        scope: b.scope, source, stat: b.stat, op: b.op || "add",
        valueByAge: toByAge(b), minAge: b.min_age ?? 0,
      });
    } else if (b.type === "building_unlock") {
      rec.unlocks.push(b.scope);
    }
  }

  // Override de costo de UU (cuando la civ lo define en uniqueUnits[].cost).
  for (const uu of civ.uniqueUnits || []) {
    if (uu.cost) rec.uuCost.push({ imgPic: uu.imgPic ?? null, cost: uu.cost });
  }

  // Emitir todas las civs: `buildable` se necesita para el filtro del picker aunque
  // la civ no tenga bonos de costo/generación.
  out[slug] = rec;
}

if (unmapped.size) out._unmappedScopes = [...unmapped].sort();

const OUT = join(WEB, "data", "civ-mods.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
const civCount = Object.keys(out).filter((k) => !k.startsWith("_")).length;
console.log(`civ-mods.json: ${civCount} civs con bonos → ${OUT}`);
if (unmapped.size) console.log(`  scopes sin mapear (se ignoran): ${[...unmapped].join(", ")}`);
