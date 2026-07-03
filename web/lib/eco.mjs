// Motor de la calculadora de producción / modelo económico.
// Funciones puras sobre los JSON generados en web/data (item-costs, civ-mods, eco-techs,
// eco-model). No toca Neo4j ni Express. Toda la matemática vive acá.
//
//   DEMANDA  drain_r = Σ (cost_r(item, civ, techs) × lines) / time(item, techs)      [por seg]
//   OFERTA   rate_r  = ratePerAge(source) × Π(1 + tech_pct/100)                       [rec/min]
//   RESULTADO vills_r = ceil( max(0, drain_r·60 − pasivos_r) / rate_r )
//
// Ver [[strategies/military-production]] y [[strategies/resource-values-sotl]].
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const readJson = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));

const ITEMS = readJson("item-costs.json");
const CIV_MODS = readJson("civ-mods.json");
const ECO_TECHS = readJson("eco-techs.json");
const ECO_MODEL = readJson("eco-model.json");

const ITEM_BY_ID = new Map(ITEMS.map((i) => [i.id, i]));
export const RESOURCES = ["food", "wood", "gold", "stone"];
export const AGES = ["dark", "feudal", "castle", "imperial"];
const ageIdx = (age) => Math.max(0, AGES.indexOf(age));
const zero = () => ({ food: 0, wood: 0, gold: 0, stone: 0 });

// Clases nombradas que aparecen en eco-techs.demand[].affects y no son ids directos.
// (La mayoría de UTs listan ids concretos, que se matchean directo por includes.)
const DEMAND_CLASSES = {
  infantry: new Set(["militia", "manatarms", "longsword", "twohanded", "champion", "spearman",
    "pikeman", "halberdier", "eaglescout", "eaglewarrior", "eliteeagle", "legionary",
    "flemish_militia", "jian_swordsman", "condottiero", "huskarl_b"]),
  foot_archer: new Set(["archer", "crossbow", "arbalester", "skirmisher", "eliteskirm",
    "imp_skirmisher", "handcannon", "slinger"]),
  mounted_archer: new Set(["cavarcher", "hcavarcher"]),
  cavalry: new Set(["scout", "lightcav", "hussar", "knight", "cavalier", "paladin", "camel",
    "heavycamel", "steppe_lancer", "elite_steppe_lancer", "battleeleph", "eliteeleph"]),
  navy: new Set(["galley", "wargalley", "galleon", "firegalley", "fireship", "fastfireship",
    "hulk", "war_hulk", "carrack", "cannongalleon", "elitecannon"]),
  trade_units: new Set(["tradecog", "tradecart"]),
  stable: new Set(["scout", "lightcav", "hussar", "knight", "cavalier", "paladin", "camel",
    "heavycamel", "steppe_lancer", "elite_steppe_lancer", "battleeleph", "eliteeleph"]),
  barracks: new Set(["militia", "manatarms", "longsword", "twohanded", "champion", "spearman",
    "pikeman", "halberdier"]),
};
function techAffectsItem(affects, item) {
  for (const a of affects) {
    if (a === item.id) return true;
    if (a === "villager") return false; // techs de aldeano no afectan costo de items
    if (DEMAND_CLASSES[a] && DEMAND_CLASSES[a].has(item.id)) return true;
    if (a === item.category) return true; // p.ej. affects:['stable'] y category stable
  }
  return false;
}

// ── DEMANDA: costo ajustado por civ + techs ──────────────────────────────────
export function adjustedCost(item, { civ, age, techs = [] } = {}) {
  const i = ageIdx(age);
  const cost = { ...zero(), ...item.cost };

  // (1) Override de costo de UU por civ (si aplica al mismo item por imgPic — heurístico:
  //     solo se usa si el item es la UU de la civ; en v1 no casamos imgPic→id, se omite.)

  // (2) cost_modifier de civ.
  const cm = civ && CIV_MODS[civ];
  if (cm) {
    for (const mod of cm.cost) {
      if (i < (mod.minAge || 0)) continue;
      if (!mod.unitIds.includes(item.id)) continue;
      const val = mod.valueByAge[i] ?? mod.valueByAge[mod.valueByAge.length - 1];
      const targets = mod.resource === "all" ? RESOURCES : [mod.resource];
      for (const r of targets) {
        if (mod.op === "multiply") cost[r] = Math.round(cost[r] * val);
        else if (mod.op === "add") cost[r] = Math.max(0, cost[r] + val);
      }
    }
  }

  // (3) Techs de demanda de costo (cost_pct / *_cost_pct / replace_gold_with_*).
  for (const id of techs) {
    const tech = ECO_TECHS.demand[id];
    if (!tech || !tech.mod) continue;
    if (!techAffectsItem(tech.affects, item)) continue;
    const m = tech.mod;
    if (m.cost_pct) for (const r of RESOURCES) cost[r] = Math.round(cost[r] * (1 + m.cost_pct / 100));
    for (const r of RESOURCES) {
      const k = `${r}_cost_pct`;
      if (m[k]) cost[r] = Math.round(cost[r] * (1 + m[k] / 100));
    }
    if (m.replace_gold_with_food) { cost.food += cost.gold; cost.gold = 0; }
    if (m.replace_gold_with_wood) { cost.wood += cost.gold; cost.gold = 0; }
  }
  return cost;
}

// Tiempo ajustado por production_speed_pct de techs de demanda.
export function adjustedTime(item, { techs = [] } = {}) {
  let factor = 1;
  for (const id of techs) {
    const tech = ECO_TECHS.demand[id];
    if (tech && tech.mod && tech.mod.production_speed_pct && techAffectsItem(tech.affects, item)) {
      factor *= 1 / (1 + tech.mod.production_speed_pct / 100);
    }
  }
  return item.time * factor;
}

// ── OFERTA: tasa efectiva de una fuente (recursos/min por recolector) ─────────
export function effectiveRate(sourceId, { age, techs = [] } = {}) {
  const src = ECO_MODEL.sources[sourceId];
  if (!src) return 0;
  let rate = src.ratePerAge[age] ?? 0;
  for (const id of techs) {
    if (!src.techs || !src.techs.includes(id)) continue;
    const st = ECO_TECHS.supply[id];
    if (!st || !st.mod) continue;
    const pct = st.mod.gather_speed_pct ?? st.mod.carry_capacity ?? st.mod.speed_pct ?? 0;
    rate *= 1 + pct / 100;
  }
  return rate;
}

// Ingreso pasivo por recurso (recursos/min) a partir de reliquias / trade / feitorias.
function passiveIncome({ relics = 0, tradeCarts = 0, feitorias = 0 } = {}) {
  const inc = zero();
  inc.gold += relics * ECO_MODEL.passive.relic.ratePerMin;
  inc.gold += tradeCarts * ECO_MODEL.passive.trade_cart.ratePerMin;
  const fe = ECO_MODEL.passive.feitoria.ratePerMin;
  for (const r of RESOURCES) inc[r] += feitorias * (fe[r] || 0);
  return inc;
}

// ── SOLVE ────────────────────────────────────────────────────────────────────
// items: [{id, lines}]
// supply: {
//   bySource: {food,wood,gold,stone}   → fuente de RELLENO (marginal) por recurso,
//   contributors: [{source, count}]    → recolectores FIJOS que ya tenés (multi-fuente),
//   techs: [...],                       → techs de recolección activas,
//   passive: {relics, tradeCarts, feitorias},
// }
// Modelo: ingreso fijo (pasivos + contributors) cubre parte de la demanda; el resto lo
// rellena la fuente marginal. Las granjas/trampas de pesca suman madera al vencerse
// (reseed), proporcional a la comida que producen → se agrega a la demanda de madera.
export function solve({ items = [], age = "feudal", civ = null, techs = [], supply = null } = {}) {
  const def = ECO_MODEL.defaults[age] || ECO_MODEL.defaults.feudal;
  const fill = { food: def.food, wood: def.wood, gold: def.gold, stone: def.stone, ...(supply?.bySource || {}) };
  const supplyTechs = supply?.techs || def.techs || [];
  const passive = supply?.passive || {};
  const contributors = Array.isArray(supply?.contributors) ? supply.contributors : [];
  const rateOf = (src) => effectiveRate(src, { age, techs: supplyTechs });

  // DEMANDA: drenaje por recurso (por segundo → luego por minuto).
  const drain = zero();
  const perItem = [];
  for (const { id, lines = 1 } of items) {
    const item = ITEM_BY_ID.get(id);
    if (!item || lines <= 0) continue;
    const cost = adjustedCost(item, { civ, age, techs });
    const time = adjustedTime(item, { techs });
    const d = zero();
    for (const r of RESOURCES) { d[r] = (cost[r] * lines) / time; drain[r] += d[r]; }
    perItem.push({ id, name: item.name, kind: item.kind, lines, cost, time: Math.round(time * 10) / 10, drainPerMin: rMap(d, (v) => round1(v * 60)) });
  }
  const demand = rMap(drain, (v) => v * 60);

  // OFERTA FIJA: pasivos + contributors. Registra la comida por fuente (para reseed).
  const passiveInc = passiveIncome(passive);
  const income = { ...passiveInc };
  const foodBySource = {};
  const contribList = [];
  for (const c of contributors) {
    const src = ECO_MODEL.sources[c.source];
    const count = Math.max(0, Math.floor(c.count || 0));
    if (!src || count <= 0) continue;
    const rate = rateOf(c.source);
    const produced = count * rate;
    income[src.resource] = (income[src.resource] || 0) + produced;
    if (src.resource === "food") foodBySource[c.source] = (foodBySource[c.source] || 0) + produced;
    contribList.push({ source: c.source, label: src.label, resource: src.resource, count, ratePerMin: round1(rate), producedPerMin: round1(produced) });
  }

  const result = {};
  const fillVills = zero();
  const need = (dem, r) => (r > 0 ? Math.ceil(dem / r) : dem > 0 ? Infinity : 0);

  // FOOD primero: su relleno alimenta el cálculo de madera de reseed.
  {
    const rate = rateOf(fill.food);
    const deficit = Math.max(0, demand.food - (income.food || 0));
    fillVills.food = need(deficit, rate);
    if (deficit > 0) foodBySource[fill.food] = (foodBySource[fill.food] || 0) + deficit;
    result.food = { demandPerMin: round1(demand.food), fixedIncomePerMin: round1(income.food || 0), fillSource: fill.food, ratePerMin: round1(rate), fillVillagers: fin(fillVills.food) };
  }

  // Madera de reseed: cada fuente de comida tipo granja/trampa suma madera proporcional.
  let reseedWood = 0;
  const reseedBreakdown = [];
  for (const [srcId, foodMin] of Object.entries(foodBySource)) {
    const src = ECO_MODEL.sources[srcId];
    if (!src?.reseed) continue;
    const cap = src.reseed.foodCapacityPerAge[age] ?? src.reseed.foodCapacityPerAge.feudal;
    const w = foodMin * (src.reseed.wood / cap);
    reseedWood += w;
    reseedBreakdown.push({ source: srcId, label: src.label, woodPerMin: round1(w) });
  }

  // WOOD (demanda directa + reseed de granjas/trampas).
  {
    const rate = rateOf(fill.wood);
    const woodDemand = demand.wood + reseedWood;
    const deficit = Math.max(0, woodDemand - (income.wood || 0));
    fillVills.wood = need(deficit, rate);
    result.wood = { demandPerMin: round1(woodDemand), reseedPerMin: round1(reseedWood), fixedIncomePerMin: round1(income.wood || 0), fillSource: fill.wood, ratePerMin: round1(rate), fillVillagers: fin(fillVills.wood) };
  }

  for (const r of ["gold", "stone"]) {
    const rate = rateOf(fill[r]);
    const deficit = Math.max(0, demand[r] - (income[r] || 0));
    fillVills[r] = need(deficit, rate);
    result[r] = { demandPerMin: round1(demand[r]), fixedIncomePerMin: round1(income[r] || 0), fillSource: fill[r], ratePerMin: round1(rate), fillVillagers: fin(fillVills[r]) };
  }

  const contribCount = contribList.reduce((s, c) => s + c.count, 0);
  const fillTotal = RESOURCES.filter((r) => Number.isFinite(fillVills[r])).reduce((s, r) => s + fillVills[r], 0);
  const bottleneck = RESOURCES.reduce((a, b) => ((fillVills[b] || 0) > (fillVills[a] || 0) ? b : a), "food");

  return {
    input: { age, civ, techs, fillSource: fill, supplyTechs },
    perItem,
    perResource: result,
    contributors: contribList,
    contributorVillagers: contribCount,
    fillVillagers: fillTotal,
    total: contribCount + fillTotal,
    bottleneck,
    reseedWood: { totalPerMin: round1(reseedWood), breakdown: reseedBreakdown },
    passiveIncome: rMap(passiveInc, round1),
    heuristics: heuristics(perItem),
    appliedCivMods: civ && CIV_MODS[civ] ? summarizeCivMods(CIV_MODS[civ]) : null,
  };
}
const fin = (v) => (v === Infinity ? null : v);

// Notas de validación contra heurísticas de coaches (Sebas / Hera). Se reportan POR
// EDIFICIO (dividiendo por las líneas en paralelo) para casar con las reglas del vault.
function heuristics(perItem) {
  const notes = [];
  const sum = (cat, res) => perItem
    .filter((p) => p.kind === "unit" && ITEM_BY_ID.get(p.id)?.category === cat)
    .reduce((a, p) => ({ drain: a.drain + p.drainPerMin[res], lines: a.lines + p.lines }), { drain: 0, lines: 0 });

  const ar = sum("archery", "gold");
  if (ar.drain > 0) {
    notes.push(`Arquería: ~${Math.round(ar.drain / ar.lines)} oro/min por edificio → ~${Math.ceil(ar.drain / ar.lines / 20)} mineros c/u ` +
      `(Sebas: ~4-5 de oro por arquería).`);
  }
  const st = sum("stable", "food");
  if (st.drain > 0) {
    notes.push(`Establo: ~${Math.round(st.drain / st.lines)} comida/min por edificio → ~${Math.ceil(st.drain / st.lines / 20)} en comida c/u ` +
      `(Sebas: ~6-7 de comida por establo).`);
  }
  return notes;
}

function summarizeCivMods(cm) {
  const out = [];
  for (const m of cm.cost) out.push({ type: "cost", scope: m.scope, resource: m.resource, valueByAge: m.valueByAge, minAge: m.minAge });
  for (const g of cm.gen) out.push({ type: "gen", scope: g.scope, source: g.source, stat: g.stat });
  if (cm.unlocks.length) out.push({ type: "unlock", scope: cm.unlocks });
  return out;
}

// Unidades únicas "huérfanas": variant unique que ninguna civ tiene en su `buildable`
// (nodo del árbol sin civ asociada — dato muerto, ej. tras un imgPic sin match). Se
// calcula una sola vez sobre el universo de civs y se excluye del catálogo entero,
// para que no aparezcan ni en el picker genérico ni al elegir ninguna civ puntual.
const CIV_ENTRIES = Object.entries(CIV_MODS).filter(([k]) => !k.startsWith("_"));
const ANY_CIV_BUILDABLE = new Set(CIV_ENTRIES.flatMap(([, v]) => v.buildable || []));
const CATALOG_ITEMS = ITEMS.filter((i) => i.variant !== "unique" || ANY_CIV_BUILDABLE.has(i.id));

// Catálogo para poblar los pickers de ambos frontends.
const stripDocs = (obj) => Object.fromEntries(Object.entries(obj).filter(([k]) => !k.startsWith("_")));
export function catalog() {
  return {
    items: CATALOG_ITEMS,
    sources: stripDocs(ECO_MODEL.sources),
    defaults: stripDocs(ECO_MODEL.defaults),
    passive: stripDocs(ECO_MODEL.passive),
    supplyTechs: ECO_TECHS.supply,
    demandTechs: ECO_TECHS.demand,
    resources: RESOURCES,
    ages: AGES,
    civs: CIV_ENTRIES.map(([k]) => k).sort(),
    // Construibilidad por civ: ids de item que cada civ puede producir (para filtrar el
    // picker). Deriva de `available` del árbol + la UU propia resuelta por imgPic.
    buildable: Object.fromEntries(CIV_ENTRIES.map(([k, v]) => [k, v.buildable || []])),
  };
}

// helpers
function round1(v) { return Math.round(v * 10) / 10; }
function rMap(obj, fn) { const o = {}; for (const r of RESOURCES) o[r] = fn(obj[r]); return o; }
