// Rutas del "Lab": build orders, timings, scouting, equipos, draft, comparador,
// simulador y modo estudio. Todo sale de web/data/*.json (generado desde el vault
// con scripts/build-*.mjs) y de los datos del árbol; no toca Neo4j.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { simCatalog, simCivs, simulate, simMatrix } from "./sim.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "data");
const load = (f, fb) => {
  try { return JSON.parse(readFileSync(join(DATA, f), "utf8")); }
  catch (e) { console.error(`[lab] no se pudo cargar data/${f}:`, e.message); return fb; }
};

const BUILD_ORDERS = load("build-orders.json", []);
const TIMINGS = load("timings.json", { builds: [], imperial: [], windows: [] });
const SCOUTING = load("scouting-tree.json", { stages: [] });
const TEAM = load("team-roles.json", {});
const RADAR_ = load("radar.json", {});
const PHOS = load("phosphor.json", {});
const TRAITS = load("civ-traits.json", {});
const COUNTER_PLAY_ = load("counter-play.json", {});
const ITEMS = Object.fromEntries(load("item-costs.json", []).map((x) => [x.id, x]));

const slugOk = (s) => /^[a-z0-9_-]{2,30}$/.test(String(s || "").toLowerCase());
const list = (v, max = 8) => String(v || "").split(",").map((x) => x.trim().toLowerCase()).filter(slugOk).slice(0, max);
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });

// Para cada civ de equipo: ¿puede producir alguna de estas unidades? (mejor → peor)
function bestAnswer(civAvail, ids) {
  for (const id of ids) if (civAvail?.has(id)) return id;
  return null;
}

// Categorías de cobertura del equipo (qué respuesta tiene cada civ).
const COVERAGE = [
  { key: "cav", label: "Caballería pesada", top: ["paladin", "cavalier", "knight"] },
  { key: "pike", label: "Picas (anti-caballería)", top: ["halberdier", "pikeman", "spearman"] },
  { key: "inf", label: "Infantería de línea", top: ["champion", "twohanded", "longsword"] },
  { key: "arch", label: "Arqueros", top: ["arbalester", "crossbow", "archer"] },
  { key: "skirm", label: "Anti-arqueros (Skirmishers)", top: ["eliteskirm", "skirmisher"] },
  { key: "camel", label: "Camellos", top: ["heavycamel", "camel"] },
  { key: "ele", label: "Elefantes", top: ["eliteeleph", "battleeleph"] },
  { key: "cavarch", label: "Cavalry Archers", top: ["hcavarcher", "cavarcher"] },
  { key: "gun", label: "Pólvora", top: ["handcannon"] },
  { key: "siege", label: "Asedio de campo", top: ["siegeonager", "onager", "mangonel"] },
  { key: "bomb", label: "Bombard / Trebuchet", top: ["bombcannon", "trebuchet"] },
  { key: "monk", label: "Monjes", top: ["monk"] },
  { key: "navy", label: "Naval (Galleon)", top: ["galleon", "galley"] },
];

// Posiciones por tamaño de equipo: 2v2 = 1 flanco + 1 pocket; 3v3 = 2 flancos + 1 pocket; 4v4 = 2+2.
const SLOTS = { 1: ["flex"], 2: ["flank", "pocket"], 3: ["flank", "pocket", "flank"], 4: ["flank", "pocket", "pocket", "flank"] };

function fit(civ, slot) {
  const p = TEAM[civ]?.position || "flex";
  if (slot === "flex") return 1;
  if (p === slot) return 3;
  if (p === "flex") return 1.5;
  return 0;
}

function permutations(arr) {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
}

const MAP_AXIS = { open: 4, closed: 5, water: 6, nomad: 7 };   // índices de RADAR.phase
const PHOS_BONUS = { S: 2, A: 1.4, B: 0.7, C: 0.2, D: 0 };

// Nombres legibles { id → "Name" } del locale en inglés del árbol (misma regex que techtree/load.mjs).
const LOCALE_NAMES = (() => {
  try {
    const txt = readFileSync(join(__dirname, "..", "public/tree/src/locales/en.js"), "utf8");
    const names = {};
    const re = /^\s*['"]?([a-z0-9_]+)['"]?\s*:\s*\{\s*name\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/gim;
    let m;
    while ((m = re.exec(txt)) !== null) names[m[1]] = (m[2] ?? m[3]).replace(/\\(['"])/g, "$1");
    return names;
  } catch (e) { console.error("[lab] locale:", e.message); return {}; }
})();

export function registerLab(app, { CIV_AVAILABLE }) {
  // ---------- 1. Build orders ----------
  app.get("/api/build-orders", (_req, res) => res.json({ builds: BUILD_ORDERS }));

  // ---------- 2. Benchmarks de timings ----------
  app.get("/api/timings", (_req, res) => res.json(TIMINGS));

  // ---------- 5. Scouting ----------
  // ?vs=<civ rival>&team=a,b,c → árbol + counter-play del rival + quién del equipo responde.
  app.get("/api/scouting", (req, res) => {
    const vs = list(req.query.vs, 1)[0] || null;
    const team = list(req.query.team, 4);
    const stages = SCOUTING.stages.map((st) => ({
      ...st,
      signals: st.signals.map((s) => ({
        ...s,
        who: team.map((c) => {
          const id = s.answer?.length ? bestAnswer(CIV_AVAILABLE.get(c), s.answer) : null;
          return { civ: c, unit: id ? (ITEMS[id]?.name || id) : null, can: s.answer?.length ? !!id : null };
        }),
      })),
    }));
    res.json({
      stages,
      vs: vs ? {
        civ: vs,
        name: TEAM[vs]?.name || vs,
        counterPlay: COUNTER_PLAY_[vs] || [],
        phosphor: PHOS[vs] || null,
        weaknesses: TRAITS[vs]?.weaknesses || [],
        specialty: TEAM[vs]?.specialty || "",
      } : null,
    });
  });

  // ---------- 4. Team Lab ----------
  app.get("/api/team-civs", (_req, res) => {
    res.json(Object.entries(TEAM).map(([slug, t]) => ({
      slug, name: t.name, position: t.position, specialty: t.specialty, teamBonus: t.teamBonus,
    })).sort((a, b) => a.name.localeCompare(b.name)));
  });

  app.get("/api/team", (req, res) => {
    const civs = list(req.query.civs, 4).filter((c) => TEAM[c]);
    if (civs.length < 1) return bad(res, "elegí al menos una civilización");
    // asignación óptima a posiciones (fuerza bruta; ≤ 4! = 24 permutaciones)
    const slots = SLOTS[civs.length];
    let best = null;
    for (const p of permutations(civs)) {
      const score = p.reduce((a, c, i) => a + fit(c, slots[i]), 0);
      if (!best || score > best.score) best = { score, order: p };
    }
    const players = best.order.map((c, i) => ({
      civ: c, name: TEAM[c].name, slot: slots[i], fit: fit(c, slots[i]) === 3 ? "ideal" : fit(c, slots[i]) === 0 ? "contra su perfil" : "aceptable",
      position: TEAM[c].position, positionNote: TEAM[c].positionNote, specialty: TEAM[c].specialty,
      teamBonus: TEAM[c].teamBonus, notes: TEAM[c].notes,
    }));
    // sinergias dirigidas: A nombra a B como sinergia, o A aprovecha el bonus de B
    const links = [];
    for (const a of civs) for (const b of civs) {
      if (a === b) continue;
      if (TEAM[a].synergies?.includes(b)) links.push({ from: a, to: b, kind: "synergy", text: `${TEAM[a].name} marca a ${TEAM[b].name} como sinergia` });
      if (TEAM[a].usesFrom?.includes(b)) links.push({ from: a, to: b, kind: "bonus", text: `${TEAM[a].name} aprovecha el bonus de equipo de ${TEAM[b].name}: ${TEAM[b].teamBonus}` });
    }
    // cobertura de respuestas: qué civ tiene la mejor versión de cada línea
    const coverage = COVERAGE.map((cv) => {
      const who = civs.map((c) => {
        const id = bestAnswer(CIV_AVAILABLE.get(c), cv.top);
        return { civ: c, unit: id ? (ITEMS[id]?.name || id) : null, tier: id ? cv.top.indexOf(id) : null };
      });
      const have = who.filter((w) => w.unit);
      const topCiv = have.filter((w) => w.tier === Math.min(...have.map((x) => x.tier)));
      return { key: cv.key, label: cv.label, who, gap: have.length === 0, best: topCiv.map((w) => w.civ) };
    });
    res.json({
      size: civs.length, score: best.score, maxScore: civs.length * 3, players, links, coverage,
      gaps: coverage.filter((c) => c.gap).map((c) => c.label),
    });
  });

  // ---------- 3. Draft ----------
  // Datos para el helper (cliente): mapa por civ + tier Phosphor + posición.
  app.get("/api/draft-data", (_req, res) => {
    const civs = Object.entries(TEAM).map(([slug, t]) => {
      const r = RADAR_[slug];
      return {
        slug, name: t.name, position: t.position,
        axes: r ? { open: r.phase[4], closed: r.phase[5], water: r.phase[6], nomad: r.phase[7] } : null,
        phase: r?.phase || null,
        category: r?.category || null,
        phosphor: PHOS[slug]?.tier || null,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    res.json({ civs, axes: Object.keys(MAP_AXIS) });
  });

  // ---------- 7. Comparador civ vs civ ----------
  const typeOf = (id) => ITEMS[id]?.kind || "tech";
  app.get("/api/compare", (req, res) => {
    const [a, b] = list(req.query.a, 1).concat(list(req.query.b, 1));
    if (!a || !b || a === b) return bad(res, "elegí dos civilizaciones distintas");
    const A = CIV_AVAILABLE.get(a), B = CIV_AVAILABLE.get(b);
    if (!A || !B) return bad(res, "civilización sin árbol", 404);
    const nm = (id) => LOCALE_NAMES[id] || ITEMS[id]?.name || id;
    const diff = (X, Y) => [...X].filter((id) => !Y.has(id) && !/^(uniqueunit|eliteunique|uniquetech)/.test(id)
      && !/_uniquetech|castle_uu|^t_/.test(id) && !/^(palisade|stonewall|gate|fortifiedwall|house|outpost|tc_castle|wonder)/.test(id))
      .map((id) => ({ id, name: nm(id), kind: typeOf(id), age: ITEMS[id]?.age || null,
                      imgPath: ITEMS[id]?.imgPath || null }))
      .filter((x, i, arr) => arr.findIndex((y) => y.name === x.name) === i)
      .sort((p, q) => p.kind.localeCompare(q.kind) || p.name.localeCompare(q.name));
    const card = (slug) => ({
      slug, name: TEAM[slug]?.name || slug, specialty: TEAM[slug]?.specialty || "",
      teamBonus: TEAM[slug]?.teamBonus || "", position: TEAM[slug]?.position || "flex",
      strengths: TRAITS[slug]?.strengths || [], weaknesses: TRAITS[slug]?.weaknesses || [],
      phosphor: PHOS[slug]?.tier || null, uu: PHOS[slug]?.uu || null,
      phase: RADAR_[slug]?.phase || null, category: RADAR_[slug]?.category || null,
    });
    res.json({
      a: card(a), b: card(b),
      onlyA: diff(A, B), onlyB: diff(B, A),
      shared: [...A].filter((id) => B.has(id)).length,
      note: "Se muestran solo unidades, edificios y techs que difieren (sin únicas ni muros/casas comunes).",
    });
  });

  // ---------- 6. Simulador ----------
  app.get("/api/sim/catalog", async (_req, res) => {
    try { res.json({ units: await simCatalog() }); }
    catch (e) { console.error(e); bad(res, String(e.message || e), 500); }
  });
  app.get("/api/sim/civs", (_req, res) => res.json({ civs: simCivs().map((c) => ({ ...c, name: TEAM[c.slug]?.name || c.slug })) }));
  app.post("/api/sim", async (req, res) => {
    try {
      const { a, b, gap, upgradesA, upgradesB, civA, civB, allyA, allyB, age } = req.body || {};
      if (!Array.isArray(a) || !Array.isArray(b)) return bad(res, "a y b deben ser listas de {id, count}");
      res.json(await simulate(a.slice(0, 6), b.slice(0, 6), { gap, upgradesA, upgradesB, civA, civB, allyA, allyB, age }));
    } catch (e) { bad(res, String(e.message || e)); }
  });
  app.get("/api/sim/matrix", async (req, res) => {
    try {
      const ids = String(req.query.units || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 16);
      if (ids.length < 2) return bad(res, "elegí al menos 2 unidades");
      const q = req.query;
      res.json(await simMatrix(ids, { budget: Math.max(500, Math.min(10000, +q.budget || 2000)), gap: +q.gap || 10,
        civA: q.civA, civB: q.civB, allyA: q.allyA, allyB: q.allyB, age: q.age === undefined ? undefined : +q.age }));
    } catch (e) { console.error(e); bad(res, String(e.message || e), 500); }
  });

  // ---------- 12. Modo estudio ----------
  app.get("/api/quiz", (_req, res) => {
    const cards = [];
    for (const [slug, t] of Object.entries(TEAM)) {
      if (t.teamBonus) cards.push({ id: `tb:${slug}`, type: "teambonus", q: `¿Qué civ tiene este bonus de equipo?\n«${t.teamBonus}»`, a: t.name, source: `civs/${t.name}.md` });
      if (t.specialty) cards.push({ id: `sp:${slug}`, type: "specialty", q: `¿Qué civ tiene esta especialidad?\n«${t.specialty}»`, a: t.name, source: `civs/${t.name}.md` });
      if (t.hasTeamSection && t.position !== "flex")
        cards.push({ id: `pos:${slug}`, type: "position", q: `En equipos, ¿cuál es la posición ideal de ${t.name}?`, a: t.position === "pocket" ? "Pocket" : "Flanco", source: `civs/${t.name}.md#Team games`, fixed: ["Pocket", "Flanco"] });
      const ph = PHOS[slug];
      if (ph?.tier && ph?.uu) cards.push({ id: `uu:${slug}`, type: "phosphor", q: `¿Cuál es la unidad/plan del Fast Castle all-in de ${t.name}? (tier ${ph.tier})`, a: ph.uu, source: "strategies/fc-tier-list-redfosforu.md" });
    }
    res.json({ cards });
  });
}
