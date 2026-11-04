// Draft contra rivales concretos: puntúa cada civ candidata contra una o varias civs rivales.
// Funciones puras sobre los datos del vault ya generados (web/data/*.json):
//   radar.json (0–10 por fase/mapa/categoría), phosphor.json (tier FC all-in en Arabia),
//   documented-matchups.json (partidas analizadas, con "Favorable para: …") y team-roles.json (nombres, posición).
// Es una GUÍA basada en los radares y partidas documentadas del vault, no un veredicto.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const load = (f) => { try { return JSON.parse(readFileSync(join(__dirname, "..", "data", f), "utf8")); } catch { return {}; } };
const RADAR = load("radar.json"), PHOS = load("phosphor.json"), DOC = load("documented-matchups.json"), TEAM = load("team-roles.json");

export const CATEGORIES = ["Infantería", "Caballería", "Arqueros", "Asedio", "Naval", "Monjes", "Defensa", "Pólvora"];
const MAP_AXIS = { open: 4, closed: 5, water: 6, nomad: 7 };
const MAP_ES = { open: "Abierto", closed: "Cerrado", water: "Agua", nomad: "Nómada" };
const PHB = { S: 2, A: 1.4, B: 0.7, C: 0.2, D: 0 };
const nameOf = (s) => TEAM[s]?.name || s;
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z]/g, "");

// Partidas documentadas entre `me` y `vs` (ambas perspectivas, sin duplicar el mismo cruce).
export function documented(me, vs) {
  const seen = new Set(), out = [];
  for (const [owner, other] of [[me, vs], [vs, me]]) {
    for (const e of DOC[owner] || []) {
      if (e.opponent !== other) continue;
      const fav = /Favorable para:\s*([^·]+?)(?:\s*·|$)/.exec(e.heading)?.[1]?.trim() || "";
      const map = /—\s*([^·]+?)\s*·/.exec(e.heading)?.[1]?.trim() || "";
      // el mismo cruce aparece en las fichas de ambas civs: se cuenta una vez por archivo+mapa
      const key = e.matchupFile + "|" + map;
      if (seen.has(key)) continue;
      seen.add(key);
      const f = norm(fav);
      const favors = !f || /parejo|equilibr|even/.test(f) ? "even" : f === norm(nameOf(me)) ? "me" : f === norm(nameOf(vs)) ? "vs" : "even";
      out.push({ file: e.matchupFile, map, favors, recordar: e.recordar || "", fromOwner: owner });
    }
  }
  return out;
}

// Puntaje de `me` contra `vs` en el tipo de mapa. total más alto = mejor para `me`.
export function pairScore(me, vs, map = "open") {
  const a = RADAR[me], b = RADAR[vs];
  const reasons = [];
  const axis = MAP_AXIS[map] ?? 4;
  const tier = PHOS[me]?.tier;
  const mapScore = (a?.phase?.[axis] ?? 0) + (map === "open" ? (PHB[tier] ?? 0) : 0);
  if (a) reasons.push(`Mapa ${MAP_ES[map] || map}: ${a.phase[axis]}${map === "open" && tier ? ` + Phosphor ${tier}` : ""}`);

  let edge = 0, exploit = [];
  if (a?.category && b?.category) {
    const w = CATEGORIES.map((c) => (c === "Naval" ? (map === "water" ? 2 : 0.2) : 1));
    const sw = w.reduce((x, y) => x + y, 0);
    edge = CATEGORIES.reduce((acc, _, i) => acc + w[i] * (a.category[i] - b.category[i]), 0) / sw;
    exploit = CATEGORIES.map((c, i) => ({ c, mine: a.category[i], theirs: b.category[i], w: w[i] }))
      .filter((x) => x.w > 0.5 && x.theirs <= 4 && x.mine >= 7);
    reasons.push(`Radar vs ${nameOf(vs)}: ${edge >= 0 ? "+" : ""}${edge.toFixed(1)}`);
    for (const x of exploit) reasons.push(`Explota ${x.c} débil del rival (${x.theirs}) con ${x.mine}`);
  }
  const docs = documented(me, vs);
  const favMe = docs.filter((d) => d.favors === "me").length, favVs = docs.filter((d) => d.favors === "vs").length;
  const docDelta = Math.max(-3, Math.min(3, favMe - favVs));
  if (docs.length) reasons.push(`Documentado: ${docs.length} partida(s)${favMe || favVs ? ` — favorable a ${favMe >= favVs ? nameOf(me) : nameOf(vs)}` : " — parejo"}`);
  const total = 0.4 * mapScore + 1.0 * edge + 0.5 * exploit.length + 1.2 * docDelta;
  return { total: +total.toFixed(2), mapScore, edge: +edge.toFixed(2), exploit, docDelta, docs, reasons };
}

// Ranking de candidatas contra un pool de rivales + bans sugeridos.
export function draftVs({ vs, map = "open", exclude = [], slot = "flex", limit = 8, bans = 1 }) {
  const rivals = [...new Set(vs)].filter((s) => RADAR[s]);
  if (!rivals.length) return { error: "elegí al menos un rival con radar" };
  const banned = new Set(exclude);
  const cands = Object.keys(RADAR).filter((c) => TEAM[c] && !banned.has(c) && !rivals.includes(c) &&
    (slot === "flex" || TEAM[c].position === slot || TEAM[c].position === "flex"));
  const rows = cands.map((c) => {
    const per = rivals.map((r) => ({ vs: r, name: nameOf(r), ...pairScore(c, r, map) }));
    const avg = per.reduce((x, p) => x + p.total, 0) / per.length;
    const worst = per.reduce((m, p) => (p.total < m.total ? p : m), per[0]);
    return { civ: c, name: nameOf(c), position: TEAM[c].position, score: +avg.toFixed(2), worst: { vs: worst.vs, name: worst.name, total: worst.total },
             per, reasons: per.length === 1 ? per[0].reasons : [`Promedio contra ${per.length} rivales`, `Peor cruce: ${worst.name} (${worst.total})`] };
  }).sort((a, b) => b.score - a.score);
  const top = rows.slice(0, limit);
  // bans: civs del pool rival que más dañan a mis mejores picks
  const mine = top.slice(0, 3).map((r) => r.civ);
  const banRows = rivals.map((r) => ({
    civ: r, name: nameOf(r),
    threat: +(mine.reduce((x, m) => x + pairScore(r, m, map).total, 0) / (mine.length || 1)).toFixed(2),
  })).sort((a, b) => b.threat - a.threat).slice(0, bans);
  const phosphorAlert = map === "open"
    ? rivals.filter((r) => ["S", "A"].includes(PHOS[r]?.tier)).map((r) => ({ civ: r, name: nameOf(r), tier: PHOS[r].tier, uu: PHOS[r].uu }))
    : [];
  return { map, rivals: rivals.map((r) => ({ slug: r, name: nameOf(r) })), candidates: top, bans: banRows, phosphorAlert,
           note: "Guía basada en los radares y partidas documentadas del vault; no es un veredicto." };
}
