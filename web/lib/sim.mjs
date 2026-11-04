// Simulador de combate ejército-vs-ejército y matriz de eficiencia de costo.
// Funciones puras. Stats base de public/tree/src/data/units.js (hp, ataque, armadura
// melee/perforante, rango, velocidad, cadencia); clases de armadura y bonus de ataque
// de data/unit-classes.json (generado desde las notas de unidades de la wiki).
//
// MODELO (aproximado, a propósito — igual que los simuladores de la comunidad):
//  - Daño por golpe = max(1, ataque + mejoras − armadura del tipo) + Σ max(0, bonus[c] − armadura_c)
//    sobre las clases c del defensor. Daño por segundo = golpe / cadencia.
//  - Dos filas que se acercan por una distancia inicial; cada grupo ataca cuando el
//    enemigo entra en su rango (los cuerpo a cuerpo, al contacto). Sin hit&run, sin
//    selección de objetivo, sin pathing/tamaño de unidad y sin bonos de civ.
//  - El daño de cada grupo se reparte entre los grupos enemigos en proporción a su cantidad.
//  - Daño en área (Mangonel/Onager): multiplicador simple por radio de explosión.
//  - Bonos de civ y de equipo (data/civ-combat.json, build-civ-combat.mjs) y descuentos de
//    costo (data/civ-mods.json) según la edad elegida. No incluye techs únicas, unidades
//    únicas ni mejoras de herrería reales (se usan los +0..3 genéricos).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(readFileSync(join(__dirname, "..", "data", f), "utf8"));

// id (units.js / item-costs) → slug (unit-classes.json) + nombre visible
export const ROSTER = [
  ["militia", "militia", "Militia"], ["manatarms", "man-at-arms", "Man-at-Arms"],
  ["longsword", "long-swordsman", "Long Swordsman"], ["twohanded", "two-handed-swordsman", "Two-Handed Swordsman"],
  ["champion", "champion", "Champion"],
  ["spearman", "spearman", "Spearman"], ["pikeman", "pikeman", "Pikeman"], ["halberdier", "halberdier", "Halberdier"],
  ["eaglescout", "eagle-scout", "Eagle Scout"], ["eaglewarrior", "eagle-warrior", "Eagle Warrior"],
  ["eliteeagle", "elite-eagle-warrior", "Elite Eagle Warrior"],
  ["skirmisher", "skirmisher", "Skirmisher"], ["eliteskirm", "elite-skirmisher", "Elite Skirmisher"],
  ["archer", "archer", "Archer"], ["crossbow", "crossbowman", "Crossbowman"], ["arbalester", "arbalester", "Arbalester"],
  ["handcannon", "hand-cannoneer", "Hand Cannoneer"],
  ["scout", "scout-cavalry", "Scout Cavalry"], ["lightcav", "light-cavalry", "Light Cavalry"], ["hussar", "hussar", "Hussar"],
  ["knight", "knight", "Knight"], ["cavalier", "cavalier", "Cavalier"], ["paladin", "paladin", "Paladin"],
  ["camel", "camel-rider", "Camel Rider"], ["heavycamel", "heavy-camel-rider", "Heavy Camel Rider"],
  ["battleeleph", "battle-elephant", "Battle Elephant"], ["eliteeleph", "elite-battle-elephant", "Elite Battle Elephant"],
  ["cavarcher", "cavalry-archer", "Cavalry Archer"], ["hcavarcher", "heavy-cavalry-archer", "Heavy Cavalry Archer"],
  ["mangonel", "mangonel", "Mangonel"], ["onager", "onager", "Onager"], ["siegeonager", "siege-onager", "Siege Onager"],
  ["scorpion", "scorpion", "Scorpion"], ["heavyscorpion", "heavy-scorpion", "Heavy Scorpion"],
  ["bombcannon", "bombard-cannon", "Bombard Cannon"],
].map(([id, slug, name]) => ({ id, slug, name }));

let CACHE = null;
async function data() {
  if (CACHE) return CACHE;
  const mod = await import(pathToFileURL(join(__dirname, "..", "public/tree/src/data/units.js")).href);
  const stats = { ...mod.UNIT_STATS, ...mod.REGIONAL_UNIT_STATS };
  const classes = read("unit-classes.json");
  const costs = Object.fromEntries(read("item-costs.json").map((x) => [x.id, x]));
  const units = {};
  for (const r of ROSTER) {
    const s = stats[r.id], c = classes[r.slug], k = costs[r.id];
    if (!s || !c || !k) continue;
    units[r.id] = {
      id: r.id, name: r.name, hp: s.hp, attack: s.attack, armor: s.armor, range: s.range || 0,
      speed: s.speed, rof: s.rof || 2, blast: s.blast_radius || 0,
      classes: c.classes || {}, bonus: c.bonus || {},
      cost: k.cost, value: (k.cost.food || 0) + (k.cost.wood || 0) + (k.cost.gold || 0) + (k.cost.stone || 0),
      imgPath: k.imgPath || null,
      // mangonel/onager: el "ataque" melee de asedio golpea armadura melee; arqueros/pólvora/escorpión, perforante
      type: (s.range || 0) > 0 && !/mangonel|onager/.test(r.id) ? "pierce" : "melee",
    };
  }
  CACHE = { units };
  return CACHE;
}

let EXTRA = null;
function extra() {
  if (EXTRA) return EXTRA;
  let combat = {}, mods = {};
  try { combat = read("civ-combat.json"); } catch {}
  try { mods = read("civ-mods.json"); } catch {}
  return (EXTRA = { combat, mods });
}

const STAT_ES = { hp: "HP", attack: "ataque", rof: "cadencia", speed: "velocidad", range: "rango", armor_melee: "armadura melee",
  armor_pierce: "armadura perf.", armor_melee_and_pierce: "armadura (ambas)", bonus_damage: "daño bonus",
  bonus_damage_reduction: "daño bonus recibido", attack_vs: "ataque vs" };
const SCOPE_ES = { cavalry: "Caballería", mounted: "Montadas", knight: "Knights", light_cavalry: "Scouts", camel: "Camellos",
  battle_elephant: "Elefantes", battleeleph: "Elefantes", elephant: "Elefantes", cavalry_archer: "Cav. archers", cavarcher: "Cav. archers",
  infantry: "Infantería", spearman: "Lanceros", skirmisher: "Skirmishers", foot_archer: "Arqueros a pie", foot_archer_no_skirm: "Arqueros",
  gunpowder: "Pólvora", siege: "Asedio", scorpion: "Escorpiones", soldier: "Soldados", unit: "Unidades" };

// Valor del bono en la edad dada (0 dark … 3 imperial) o null si todavía no aplica.
function modValue(m, age) {
  if (age < (m.minAge ?? 0)) return null;
  const v = m.byAge ? m.byAge[Math.min(age, m.byAge.length - 1)] : m.value;
  return v === undefined || v === null ? null : v;
}
function modText(m, v) {
  const val = m.op === "multiply" ? `×${+v.toFixed(2)}` : `${v >= 0 ? "+" : ""}${v}`;
  return `${m.team ? "[equipo] " : ""}${SCOPE_ES[m.scope] || m.scope}: ${STAT_ES[m.stat] || m.stat}${m.vsClass ? " " + m.vsClass : ""} ${val}`;
}

// Copia de la unidad base con los bonos de la civ (+ bonos de equipo propio y del aliado) y costos de civ.
function forCivs(base, { civ, ally, age }) {
  const { combat, mods } = extra();
  const u = { ...base, armor: [...base.armor], bonus: { ...base.bonus }, cost: { ...base.cost },
              bonusMult: 1, bonusTaken: 1, applied: [] };
  const list = [];
  if (civ && combat[civ]) { list.push(...combat[civ].mods); if (combat[civ].team) list.push(combat[civ].team); }
  if (ally && ally !== civ && combat[ally]?.team) list.push(combat[ally].team);
  for (const m of list) {
    if (!m.ids.includes(u.id)) continue;
    const v = modValue(m, age); if (v === null) continue;
    const mul = m.op === "multiply";
    switch (m.stat) {
      case "hp": u.hp = mul ? u.hp * v : u.hp + v; break;
      case "attack": u.attack = mul ? u.attack * v : u.attack + v; break;
      case "rof": u.rof *= v; break;
      case "speed": u.speed *= v; break;
      case "range": u.range += v; break;
      case "armor_melee": u.armor[0] += v; break;
      case "armor_pierce": u.armor[1] += v; break;
      case "armor_melee_and_pierce": u.armor[0] += v; u.armor[1] += v; break;
      case "bonus_damage": u.bonusMult *= v; break;
      case "bonus_damage_reduction": u.bonusTaken *= v; break;
      case "attack_vs": u.bonus[m.vsClass] = (u.bonus[m.vsClass] || 0) + v; break;
      default: continue;
    }
    u.applied.push(modText(m, v));
  }
  // descuentos de costo de la civ (civ-mods.json)
  for (const c of (civ && mods[civ]?.cost) || []) {
    if (!c.unitIds?.includes(u.id) || age < (c.minAge ?? 0)) continue;
    const v = c.valueByAge ? c.valueByAge[Math.min(age, c.valueByAge.length - 1)] : c.value;
    if (c.op !== "multiply" || v == null || v === 1) continue;
    for (const r of ["food", "wood", "gold", "stone"]) if (c.resource === "all" || c.resource === r) u.cost[r] = Math.round(u.cost[r] * v);
    u.applied.push(`[costo] ${SCOPE_ES[c.scope] || c.scope} ×${+v.toFixed(2)}`);
  }
  u.value = (u.cost.food || 0) + (u.cost.wood || 0) + (u.cost.gold || 0) + (u.cost.stone || 0);
  u.hp = Math.round(u.hp * 10) / 10;
  return u;
}

export function simCivs() {
  const { combat, mods } = extra();
  return Object.keys(combat).filter((k) => !k.startsWith("_")).sort()
    .map((slug) => ({ slug, bonuses: combat[slug].mods.length + (combat[slug].team ? 1 : 0), cost: (mods[slug]?.cost || []).length }));
}

export async function simCatalog() {
  const { units } = await data();
  return ROSTER.filter((r) => units[r.id]).map((r) => {
    const u = units[r.id];
    return { id: u.id, name: u.name, hp: u.hp, attack: u.attack, armor: u.armor, range: u.range,
             speed: u.speed, rof: u.rof, cost: u.cost, value: u.value, imgPath: u.imgPath };
  });
}

// Bonus de ataque de A contra el defensor B (clase a clase).
function bonusVs(a, b) {
  let t = 0;
  for (const [cls, v] of Object.entries(a.bonus)) {
    if (b.classes[cls] === undefined) continue;
    t += Math.max(0, v - (b.classes[cls] || 0));
  }
  return t * (a.bonusMult ?? 1) * (b.bonusTaken ?? 1);
}

// Daño por segundo de una unidad de A contra una de B, con mejoras de herrería.
function dpsVs(a, b, upA, upB) {
  const armor = (a.type === "pierce" ? b.armor[1] + upB.armPierce : b.armor[0] + upB.armMelee);
  const base = a.attack + (a.attack > 0 ? upA.attack : 0);
  const hit = Math.max(1, base - armor) + bonusVs(a, b);
  const splash = 1 + (a.blast || 0) * 0.8;
  return (hit / a.rof) * splash;
}

const norm = (u) => ({
  attack: Math.max(0, Math.min(3, +u?.attack || 0)),
  armMelee: Math.max(0, Math.min(3, +u?.armMelee || 0)),
  armPierce: Math.max(0, Math.min(3, +u?.armPierce || 0)),
});

// side: [{ id, count }]  →  resultado
export async function simulate(sideA, sideB, opts = {}) {
  const { units } = await data();
  const gap0 = Math.max(1, Math.min(30, +opts.gap || 10));
  const upA = norm(opts.upgradesA), upB = norm(opts.upgradesB);
  const age = Math.max(0, Math.min(3, Number.isFinite(+opts.age) ? +opts.age : 3));
  const okSlug = (x) => (/^[a-z0-9_-]{2,30}$/.test(x || "") ? x : null);
  const cA = { civ: okSlug(opts.civA), ally: okSlug(opts.allyA), age };
  const cB = { civ: okSlug(opts.civB), ally: okSlug(opts.allyB), age };
  const mk = (side, c) => side.filter((g) => units[g.id] && g.count > 0).map((g) => {
    const u = forCivs(units[g.id], c); const n = Math.min(500, Math.floor(g.count));
    return { u, n0: n, pool: u.hp * n };
  });
  const A = mk(sideA, cA), B = mk(sideB, cB);
  if (!A.length || !B.length) throw new Error("cada ejército necesita al menos una unidad válida");
  const alive = (g) => Math.max(0, Math.ceil(g.pool / g.u.hp - 1e-9));
  const total = (S) => S.reduce((a, g) => a + alive(g), 0);

  const DT = 0.25, MAX_T = 900;
  let gap = gap0, t = 0;
  const reach = (g) => Math.max(g.u.range, 0.7);
  while (t < MAX_T && total(A) > 0 && total(B) > 0) {
    // acercamiento: los grupos que todavía no llegan a su objetivo caminan
    const walkers = (S) => {
      const w = S.filter((g) => alive(g) > 0 && gap > reach(g));
      const n = w.reduce((a, g) => a + alive(g), 0);
      return n ? w.reduce((a, g) => a + alive(g) * g.u.speed, 0) / n : 0;
    };
    const closing = (walkers(A) + walkers(B)) * DT;
    // daño simultáneo de este tick
    const dmgToA = A.map(() => 0), dmgToB = B.map(() => 0);
    const volley = (S, T, dmgT, upS, upT) => {
      const nT = total(T);
      for (const g of S) {
        const n = alive(g);
        if (!n || gap > reach(g)) continue;
        if (g.u.attack <= 0) continue;
        for (let j = 0; j < T.length; j++) {
          const m = alive(T[j]);
          if (!m) continue;
          dmgT[j] += n * dpsVs(g.u, T[j].u, upS, upT) * DT * (m / nT);
        }
      }
    };
    volley(A, B, dmgToB, upA, upB);
    volley(B, A, dmgToA, upB, upA);
    A.forEach((g, i) => { g.pool = Math.max(0, g.pool - dmgToA[i]); });
    B.forEach((g, i) => { g.pool = Math.max(0, g.pool - dmgToB[i]); });
    if (closing > 0) gap = Math.max(0, gap - closing);
    t += DT;
  }
  const summarize = (S) => {
    const rows = S.map((g) => ({ id: g.u.id, name: g.u.name, start: g.n0, left: alive(g),
                                 hpLeft: Math.round(g.pool) }));
    const startValue = S.reduce((a, g) => a + g.n0 * g.u.value, 0);
    const leftValue = S.reduce((a, g) => a + alive(g) * g.u.value, 0);
    return { rows, startValue, leftValue, lostValue: startValue - leftValue };
  };
  const a = summarize(A), b = summarize(B);
  const aLeft = total(A), bLeft = total(B);
  const winner = aLeft > 0 && bLeft === 0 ? "A" : bLeft > 0 && aLeft === 0 ? "B" : "draw";
  const info = (S, c) => {
    const { mods } = extra();
    const warnings = [];
    for (const g of S) if (c.civ && mods[c.civ]?.buildable && !mods[c.civ].buildable.includes(g.u.id)) warnings.push(`${c.civ} no puede producir ${g.u.name}`);
    return { civ: c.civ, ally: c.ally, applied: [...new Set(S.flatMap((g) => g.u.applied))], warnings };
  };
  return {
    winner, seconds: Math.round(t), a, b, age, civs: { a: info(A, cA), b: info(B, cB) },
    // eficiencia de cada lado: valor enemigo destruido / valor propio perdido
    efficiency: {
      a: a.lostValue > 0 ? +(b.lostValue / a.lostValue).toFixed(2) : null,
      b: b.lostValue > 0 ? +(a.lostValue / b.lostValue).toFixed(2) : null,
    },
    caveats: ["sin hit&run ni selección de objetivo", "solo bonos de civ/equipo (sin techs únicas ni unidades únicas)", "mejoras de herrería genéricas +0..3", "daño repartido en proporción entre grupos"],
  };
}

// Matriz de eficiencia: cada par con igual valor en recursos (`budget`).
// score ∈ [-1, 1]: + gana la fila (A), − gana la columna (B); magnitud = valor sobrante / presupuesto.
export async function simMatrix(ids, { budget = 2000, gap = 10, upgradesA, upgradesB, civA, civB, allyA, allyB, age } = {}) {
  const { units } = await data();
  const list = ids.filter((id) => units[id]);
  const cells = [];
  for (const a of list) {
    const row = [];
    for (const b of list) {
      if (a === b) { row.push(0); continue; }
      const ag = age ?? 3;
      const ca = forCivs(units[a], { civ: civA, ally: allyA, age: ag });
      const cb = forCivs(units[b], { civ: civB, ally: allyB, age: ag });
      const nA = Math.max(1, Math.round(budget / ca.value));
      const nB = Math.max(1, Math.round(budget / cb.value));
      const r = await simulate([{ id: a, count: nA }], [{ id: b, count: nB }], { gap, upgradesA, upgradesB, civA, civB, allyA, allyB, age });
      const s = r.winner === "A" ? r.a.leftValue / r.a.startValue
              : r.winner === "B" ? -(r.b.leftValue / r.b.startValue) : 0;
      row.push(+s.toFixed(2));
    }
    cells.push(row);
  }
  return { ids: list, names: list.map((i) => units[i].name), cells, budget };
}
