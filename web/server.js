// API REST sobre el grafo de conocimiento AoE2.
import express from "express";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { run, driver } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
// Render/hosts inyectan PORT; API_PORT es el override local.
const PORT = process.env.PORT || process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, "public")));   // sirve el frontend (5b)

// Rate-limit simple en memoria para /api/chat: protege el crédito de Gemini en la
// demo pública (cada chat = una llamada al LLM). Sin dependencias externas.
const CHAT_WINDOW_MS = Number(process.env.CHAT_RL_WINDOW_MS || 600_000);   // 10 min
const CHAT_MAX = Number(process.env.CHAT_RL_MAX || 15);                    // por IP/ventana
const chatHits = new Map();   // ip -> [timestamps]
function chatRateLimit(req, res, next) {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?")
    .toString().split(",")[0].trim();
  const now = Date.now();
  const hits = (chatHits.get(ip) || []).filter((t) => now - t < CHAT_WINDOW_MS);
  if (hits.length >= CHAT_MAX) {
    const retry = Math.ceil((CHAT_WINDOW_MS - (now - hits[0])) / 1000);
    res.set("Retry-After", String(retry));
    return res.status(429).json({
      error: `Límite de consultas alcanzado. Probá de nuevo en ${retry}s.`,
    });
  }
  hits.push(now);
  chatHits.set(ip, hits);
  if (chatHits.size > 5000) chatHits.clear();   // evita crecer sin límite
  next();
}

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    console.error(e);
    res.status(500).json({ error: String(e.message || e) });
  });

// --- salud / stats ---------------------------------------------------------
app.get("/api/health", wrap(async (_req, res) => {
  await run("RETURN 1");
  res.json({ ok: true });
}));

app.get("/api/stats", wrap(async (_req, res) => {
  const [r] = await run(`
    MATCH (n:Note) WITH count(n) AS notes
    MATCH (:Note)-[l:LINKS_TO]->(:Note) WITH notes, count(l) AS links
    OPTIONAL MATCH (:Note)-[u:HAS_UNIQUE_UNIT]->(:Note)
    OPTIONAL MATCH (:Note)-[t:HAS_UNIQUE_TECH]->(:Note)
    RETURN notes, links, count(DISTINCT u) AS uu, count(DISTINCT t) AS ut`);
  res.json(r);
}));

// --- búsqueda (título o alias ES/MX) ---------------------------------------
app.get("/api/search", wrap(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);
  const rows = await run(`
    MATCH (n:Note)
    WHERE toLower(n.title) CONTAINS toLower($q)
       OR any(a IN coalesce(n.aliases, []) WHERE toLower(a) CONTAINS toLower($q))
    RETURN n.path AS path, n.title AS title, n.type AS type, n.aliases AS aliases
    ORDER BY size(n.title) LIMIT 25`, { q });
  res.json(rows);
}));

// --- listado de civs -------------------------------------------------------
app.get("/api/civs", wrap(async (_req, res) => {
  const rows = await run(`
    MATCH (c:Civ)
    OPTIONAL MATCH (c)-[r:RATED]->(tl:TierList) WHERE tl.name CONTAINS 'Hera'
    RETURN c.path AS path, c.title AS title, c.aliases AS aliases,
           r.tier AS tierArabia
    ORDER BY c.title`);
  res.json(rows);
}));

// --- líneas genéricas del Counter Graph disponibles para una civ -----------
// Mapeo línea (id de :Unit del counter graph) → tree_ids de sus miembros en el
// árbol. Una civ tiene la línea si tiene HAS_UNIT a cualquiera de sus miembros
// (p.ej. Franks sin Arbalester igual tienen archer-line por Archer/Crossbowman).
const LINE_MEMBERS = {
  "archer-line":     ["archer", "crossbow", "arbalester"],
  "skirmisher-line": ["skirmisher", "eliteskirm", "imp_skirmisher"],
  "hand-cannoneer":  ["handcannon"],
  "cavalry-archer":  ["cavarcher", "hcavarcher"],
  "elephant-archer": ["elephant_archer", "elite_elephant_archer"],
  "militia-line":    ["militia", "manatarms", "longsword", "twohanded", "champion"],
  "spearman-line":   ["spearman", "pikeman", "halberdier"],
  "eagle-warrior":   ["eaglescout", "eaglewarrior", "eliteeagle"],
  "scout-line":      ["scout", "lightcav", "hussar", "winged_hussar"],
  "knight-line":     ["knight", "cavalier", "paladin"],
  "camel-line":      ["camel", "heavycamel", "imp_camel"],
  "battle-elephant": ["battleeleph", "eliteeleph"],
  "steppe-lancer":   ["steppe_lancer", "elite_steppe_lancer"],
  "ram-line":        ["batteringram", "cappedram", "siegeram"],
  "siege-elephant":  ["armored_elephant", "siege_elephant"],
  "mangonel-line":   ["mangonel", "onager", "siegeonager"],
  "scorpion-line":   ["scorpion", "heavyscorpion"],
  "bombard-cannon":  ["bombcannon"],
  "monk":            ["monk"],
  "galley-line":     ["galley", "wargalley", "galleon"],
  "fire-ship-line":  ["firegalley", "fireship", "fastfireship"],
  "demo-ship":       ["demoraft", "demoship", "heavydemo"],
  "hulk-line":       ["hulk", "war_hulk", "carrack"],
  // Naval de largo alcance + regionales (post-overhaul / DLC)
  "cannon-galleon":  ["cannongalleon", "elitecannon", "elitecannongalleon"],
  "lou-chuan":       ["lou_chuan"],
  "dromon":          ["dromon"],
  "catapult-galleon":["catapult_gall"],
  "fire-lancer":     ["fire_lancer", "elite_fire_lancer"],
  "hei-guang-cavalry":["hei_guang", "heavy_hei_guang"],
  "rocket-cart":     ["rocket_cart", "heavy_rocket_cart"],
  "champi-line":     ["champirunner", "champiscout", "champiwarrior", "elitechampi"],
  "slinger":         ["slinger"],
};

// Clases de las descripciones in-game ("Weak vs. Cavalry and Archery Units") →
// líneas genéricas del counter graph. El orden importa: los términos compuestos
// ('cavalry archer') se chequean antes que los genéricos ('cavalry', 'archer').
const CLASS_TO_LINES = [
  ['cavalry archer',  ['cavalry-archer']],
  ['mounted archer',  ['cavalry-archer']],
  ['foot archer',     ['archer-line']],
  ['archery unit',    ['archer-line']],
  ['archer',          ['archer-line']],
  ['ranged soldier',  ['archer-line', 'skirmisher-line']],
  ['skirmisher',      ['skirmisher-line']],
  ['gunner',          ['hand-cannoneer']],
  ['gunpowder',       ['hand-cannoneer']],
  ['hand cannoneer',  ['hand-cannoneer']],
  ['spearman',        ['spearman-line']],
  ['pikemen',         ['spearman-line']],
  ['halberdier',      ['spearman-line']],
  ['militia',         ['militia-line']],
  ['infantry',        ['militia-line']],
  ['camel',           ['camel-line']],
  ['mounted unit',    ['knight-line']],
  ['cavalry',         ['knight-line']],
  ['monk',            ['monk']],
  ['mangonel',        ['mangonel-line']],
  ['onager',          ['mangonel-line']],
  ['scorpion',        ['scorpion-line']],
  ['siege weapon',    ['mangonel-line', 'bombard-cannon']],
  ['siege',           ['mangonel-line', 'bombard-cannon']],
  ['eagle',           ['eagle-warrior']],
  ['elephant',        ['battle-elephant']],
  ['demolition',      ['demo-ship']],
  ['fire ship',       ['fire-ship-line']],
  ['fire galley',     ['fire-ship-line']],
  ['war hulk',        ['hulk-line']],
  ['hulk',            ['hulk-line']],
  ['galley',          ['galley-line']],
  ['close range',     ['militia-line']],
];
function mapClassesToLines(phrase) {
  let p = phrase.toLowerCase();
  const out = [];
  for (const [kw, lines] of CLASS_TO_LINES) {
    if (!p.includes(kw)) continue;
    p = p.split(kw).join(" ");   // consumir el término: 'cavalry archer' no debe re-disparar 'cavalry'/'archer'
    for (const l of lines) if (!out.includes(l)) out.push(l);
  }
  return out;
}

app.get("/api/civ-units", wrap(async (req, res) => {
  const slug = (req.query.civ || "").trim();
  if (!slug) return res.status(400).json({ error: "falta ?civ=" });
  const path = `civs/${slug}.md`;
  const [civ] = await run(
    `MATCH (c:Civ {path:$path}) RETURN c.title AS title`, { path });
  if (!civ) return res.status(404).json({ error: "civ no encontrada", path });

  const allIds = [...new Set(Object.values(LINE_MEMBERS).flat())];
  const rows = await run(
    `MATCH (:Civ {path:$path})-[:HAS_UNIT]->(u)
     WHERE u.tree_id IN $ids
     RETURN DISTINCT u.tree_id AS id`, { path, ids: allIds });
  const have = new Set(rows.map((r) => r.id));
  const units = Object.entries(LINE_MEMBERS)
    .filter(([, members]) => members.some((m) => have.has(m)))
    .map(([line]) => line);

  // Unidades únicas de la civ (sin las Elite — son la misma línea).
  const uuRows = await run(
    `MATCH (:Civ {path:$path})-[:HAS_UNIQUE_UNIT]->(u)
     WHERE NOT u.title STARTS WITH 'Elite'
     RETURN u.title AS title, u.tree_id AS treeId ORDER BY u.title`, { path });
  res.json({ civ: civ.title, slug, units, uniqueUnits: uuRows });
}));

// --- detalle de una civ (kit único + tiers + vecinos) ----------------------
app.get("/api/civ/:slug", wrap(async (req, res) => {
  const path = `civs/${req.params.slug}.md`;
  const [base] = await run(
    `MATCH (c:Note {path:$path})
     RETURN c.title AS title, c.aliases AS aliases, c.type AS type`, { path });
  if (!base) return res.status(404).json({ error: "civ no encontrada", path });

  const units = await run(
    `MATCH (:Note {path:$path})-[:HAS_UNIQUE_UNIT]->(u)
     RETURN u.title AS title, u.path AS path ORDER BY u.title`, { path });
  const techs = await run(
    `MATCH (:Note {path:$path})-[:HAS_UNIQUE_TECH]->(t)
     RETURN t.title AS title, t.path AS path ORDER BY t.title`, { path });
  const tiers = await run(
    `MATCH (:Note {path:$path})-[r:RATED]->(tl:TierList)
     RETURN tl.name AS list, r.tier AS tier`, { path });

  res.json({ path, ...base, uniqueUnits: units, uniqueTechs: techs, tiers });
}));

// --- nota genérica + vecinos (para explorar el grafo) ----------------------
app.get("/api/note", wrap(async (req, res) => {
  const path = (req.query.path || "").trim();
  if (!path) return res.status(400).json({ error: "falta ?path=" });
  const [base] = await run(
    `MATCH (n:Note {path:$path})
     RETURN n.title AS title, n.type AS type, n.aliases AS aliases`, { path });
  if (!base) return res.status(404).json({ error: "nota no encontrada", path });
  const neighbors = await run(
    `MATCH (n:Note {path:$path})-[r]-(m:Note)
     RETURN DISTINCT m.path AS path, m.title AS title, m.type AS type,
            type(r) AS rel ORDER BY type LIMIT 60`, { path });
  res.json({ path, ...base, neighbors });
}));

// --- subgrafo para visualización -------------------------------------------
app.get("/api/graph", wrap(async (req, res) => {
  const path = (req.query.path || "").trim();
  if (!path) return res.status(400).json({ error: "falta ?path=" });
  const rows = await run(
    `MATCH (c:Note {path:$path})-[r]-(m:Note)
     RETURN c.path AS src, c.title AS srcTitle, c.type AS srcType,
            m.path AS dst, m.title AS dstTitle, m.type AS dstType,
            type(r) AS rel LIMIT 80`, { path });
  const nodes = new Map();
  const edges = [];
  for (const e of rows) {
    nodes.set(e.src, { id: e.src, label: e.srcTitle, type: e.srcType });
    nodes.set(e.dst, { id: e.dst, label: e.dstTitle, type: e.dstType });
    edges.push({ from: e.src, to: e.dst, rel: e.rel });
  }
  res.json({ nodes: [...nodes.values()], edges });
}));

// --- entidad del tech-tree por tree_id (puente visual → grafo) -------------
// Devuelve los stats que viven en el grafo + la nota de prosa vinculada (si la
// hay) + cuántas civs tienen acceso. Es lo que el árbol consulta al hacer click.
const STAT_KEYS = ["hp", "attack", "armor_melee", "armor_pierce", "range", "speed",
  "rof", "los", "train_time", "cost_food", "cost_wood", "cost_gold", "cost_stone",
  "research_food", "research_wood", "research_gold", "research_stone", "research_time",
  "age", "building", "tree_type", "tree_variant"];

app.get("/api/tree/:treeId", wrap(async (req, res) => {
  const id = req.params.treeId;
  const [node] = await run(
    `MATCH (n {tree_id:$id})
     RETURN labels(n) AS labels, n.title AS title, n.path AS path,
            n.patched AS patched, n.source AS source, properties(n) AS props`, { id });
  if (!node) return res.status(404).json({ error: "sin entidad en el grafo", tree_id: id });

  const stats = {};
  for (const k of STAT_KEYS) if (node.props[k] != null) stats[k] = node.props[k];

  // Civs con acceso (HAS_UNIT/HAS_TECH/HAS_BUILDING).
  const civs = await run(
    `MATCH (c:Civ)-[r]->(n {tree_id:$id})
     WHERE type(r) IN ['HAS_UNIT','HAS_TECH','HAS_BUILDING']
     RETURN c.title AS title ORDER BY c.title`, { id });

  // Extracto de prosa de la nota, si está documentada. Sale del GRAFO (texto de
  // los chunks en Neo4j) → no depende del vault en disco, anda igual en el deploy.
  let note = null;
  if (node.path) {
    note = { path: node.path, title: node.title, excerpt: await noteExcerpt(node.path) };
  }

  const label = (node.labels || []).find((l) => l !== "Note") || node.labels?.[0];
  res.json({
    tree_id: id, label, title: node.title, stats,
    patched: node.patched || null, documented: !!node.path,
    civAccess: { count: civs.length, civs: civs.map((c) => c.title) },
    note,
  });
}));

// Extrae un párrafo de prosa de los primeros chunks de la nota (Neo4j). El chunk
// guarda el texto de cada sección H2 → sale del grafo, sin tocar el vault en disco.
async function noteExcerpt(path) {
  const rows = await run(
    `MATCH (c:Chunk {note:$path}) RETURN c.text AS text ORDER BY c.ord LIMIT 3`,
    { path });
  for (const { text } of rows) {
    for (let para of String(text || "").split(/\n\s*\n/)) {
      let t = para.trim();
      if (!t) continue;
      if (t.startsWith(">")) t = t.replace(/^>\s?/gm, "").trim();   // blockquote→prosa
      if (/^[#|\-*]|^\d+\.|^!\[/.test(t)) continue;   // saltar heading/tabla/lista
      t = t.replace(/\s+/g, " ");
      if (t.length < 25) continue;
      return t.length > 400 ? t.slice(0, 400) + "…" : t;
    }
  }
  return null;
}

// --- counters por unidad (búsqueda en chunks de la carpeta counters/) ------
app.get("/api/counters", wrap(async (req, res) => {
  const unit = (req.query.unit || "").trim();
  if (!unit) return res.status(400).json({ error: "falta ?unit=" });
  const rows = await run(
    `MATCH (c:Chunk)-[:PART_OF]->(n:Note)
     WHERE n.path STARTS WITH 'counters/'
       AND (toLower(c.heading) CONTAINS toLower($u)
         OR toLower(c.text) CONTAINS toLower($u))
     RETURN c.heading AS heading, c.text AS text, n.title AS note
     ORDER BY
       CASE WHEN toLower(c.heading) CONTAINS toLower($u) THEN 0 ELSE 1 END,
       size(c.heading)
     LIMIT 4`,
    { u: unit },
  );
  res.json(rows);
}));

// --- counter graph: tabla de counters → nodos + aristas para Cytoscape -----
const TIER_MAP = {
  'primario':   { weight: 0.9,  strength: 'hard' },
  'muy sólido': { weight: 0.85, strength: 'hard' },
  'sólido':     { weight: 0.75, strength: 'soft' },
  'secundario': { weight: 0.7,  strength: 'soft' },
  'largo plazo':{ weight: 0.6,  strength: 'situational' },
  'early':      { weight: 0.6,  strength: 'situational' },
  'late':       { weight: 0.6,  strength: 'situational' },
  '50/50':      { weight: 0.5,  strength: 'situational' },
  'situacional':{ weight: 0.5,  strength: 'situational' },
};
function parseTierEntry(t) {
  const tl = t.toLowerCase();
  for (const [k, v] of Object.entries(TIER_MAP)) if (tl.includes(k)) return v;
  return { weight: 0.5, strength: 'situational' };
}
function parseCounterTableRows(text) {
  const lines = text.split('\n')
    .filter(l => l.trim().startsWith('|') && !/^\|[\s\-:|]+\|/.test(l.trim()));
  if (lines.length < 2) return [];
  const hdrs = lines[0].split('|').slice(1,-1).map(h => h.trim().toLowerCase());
  const tI = hdrs.findIndex(h => h.includes('tier'));
  const cI = hdrs.findIndex(h => h.includes('contra'));
  const nI = hdrs.findIndex(h => h.includes('nota'));
  if (tI < 0 || cI < 0) return [];
  return lines.slice(1).flatMap(line => {
    const cells = line.split('|').slice(1,-1).map(c => c.trim().replace(/\*\*/g,''));
    const tier = cells[tI] || '';
    const contra = cells[cI] || '';
    if (!contra || !tier || tier.toLowerCase() === 'tier') return [];
    if (tier.toLowerCase().includes('evitar')) return [];
    return [{ contra, tier, nota: nI >= 0 ? (cells[nI]||'') : '', ...parseTierEntry(tier) }];
  });
}

app.get("/api/counter-graph", wrap(async (req, res) => {
  const unit = (req.query.unit || "").trim();
  if (!unit) return res.status(400).json({ error: "falta ?unit=" });

  // Intentar primero con nodos Unit + relaciones COUNTERS (importadas desde YAML)
  const [targetRow] = await run(
    `MATCH (target:Unit)
     WHERE toLower(target.label) CONTAINS toLower($u)
        OR toLower(target.id)    CONTAINS toLower($u)
     RETURN target LIMIT 1`,
    { u: unit },
  );

  if (targetRow) {
    const target = targetRow.target.properties;
    const counterRows = await run(
      `MATCH (counter:Unit)-[r:COUNTERS]->(t:Unit {id: $id})
       RETURN counter.id AS cid, counter.label AS clabel,
              counter.img_key AS cimg,
              r.weight AS weight, r.strength AS strength,
              r.context AS context, r.notes AS notes
       ORDER BY r.weight DESC`,
      { id: target.id },
    );

    // Dirección opuesta: a quién VENCE la unidad seleccionada (fuerte / levemente fuerte)
    const beatsRows = await run(
      `MATCH (t:Unit {id: $id})-[r:COUNTERS]->(victim:Unit)
       RETURN victim.id AS cid, victim.label AS clabel, victim.img_key AS cimg,
              r.weight AS weight, r.strength AS strength,
              r.context AS context, r.notes AS notes
       ORDER BY r.weight DESC`,
      { id: target.id },
    );

    const strengthOf = (w) => w >= 0.9 ? 'hard' : w >= 0.65 ? 'soft' : 'situational';

    const nodes = [
      { data: { id: 'center', label: target.label, full: target.label,
                type: 'center', imgKey: target.img_key || '' } },
    ];
    const edges = [];

    // Agrupa edges por unidad (varios contextos → un solo nodo) y los emite.
    // dir='counter' (entrante, te counterea) | 'beats' (saliente, la vencés).
    const emit = (rows, dir, prefix) => {
      const byUnit = new Map();
      for (const r of rows) {
        if (!byUnit.has(r.cid)) byUnit.set(r.cid, []);
        byUnit.get(r.cid).push(r);
      }
      let i = 0;
      for (const grp of byUnit.values()) {
        const best = grp[0];                       // ORDER BY weight DESC → más fuerte primero
        const w = Number(best.weight);
        const base = strengthOf(w);
        const nodeId = `${prefix}${i}`;
        nodes.push({ data: {
          id: nodeId, uid: best.cid, label: best.clabel, full: best.clabel,
          type: dir === 'beats' ? `beats-${base}` : base,
          dir, tier: best.strength, nota: best.notes || '',
          weight: w, context: best.context || 'general',
          contexts: grp.map(r => ({
            context: r.context || 'general', tier: r.strength,
            weight: Number(r.weight), nota: r.notes || '',
          })),
          imgKey: best.cimg || '',
        } });
        grp.forEach((r, j) => {
          const rw = Number(r.weight);
          const eStrength = dir === 'beats' ? `beats-${strengthOf(rw)}` : strengthOf(rw);
          edges.push({ data: {
            id: `${prefix}e${i}_${j}`,
            source: dir === 'beats' ? 'center' : nodeId,
            target: dir === 'beats' ? nodeId : 'center',
            weight: rw, strength: eStrength, dir, context: r.context || 'general',
          } });
        });
        i++;
      }
    };
    emit(counterRows, 'counter', 'c');
    emit(beatsRows, 'beats', 'b');

    return res.json({ heading: target.label, unitId: target.id, nodes, edges, notes: [], source: 'graph' });
  }

  // Unidades únicas: no hay COUNTERS curados (scope del YAML = genéricas), pero
  // la ficha del vault trae la descripción in-game ("Strong vs. X. Weak vs. Y.")
  // en el chunk intro → se derivan counters suaves mapeando las clases a líneas.
  const [uu] = await run(
    `MATCH (n:Note)
     WHERE n.path STARTS WITH 'units/unique/'
       AND toLower(n.title) CONTAINS toLower($u)
     MATCH (c:Chunk {note: n.path, heading: 'intro'})
     OPTIONAL MATCH (civ:Civ)-[:HAS_UNIQUE_UNIT]->(n)
     RETURN n.title AS title, n.path AS path, c.text AS text,
            collect(civ.title) AS civs
     ORDER BY size(n.title) LIMIT 1`,
    { u: unit },
  );

  if (uu) {
    const weakM   = uu.text.match(/(?:weak vs\.?|d[eé]bil contra)\s+([^.\n]+)/i);
    const strongM = uu.text.match(/(?:strong vs\.?|fuerte contra)\s+([^.\n]+)/i);
    const lineIds = weakM ? mapClassesToLines(weakM[1]) : [];

    const counters = lineIds.length
      ? await run(
          `MATCH (u:Unit) WHERE u.id IN $ids
           RETURN u.id AS id, u.label AS label, u.img_key AS img`,
          { ids: lineIds })
      : [];

    const nodes = [
      { data: { id: 'center', label: uu.title, full: uu.title, type: 'center', imgKey: '' } },
      ...counters.map((c, i) => ({
        data: { id: `c${i}`, label: c.label, full: c.label, type: 'soft',
                tier: 'SÓLIDO', nota: 'Según descripción in-game', weight: 0.7,
                context: 'general', imgKey: c.img || '' },
      })),
    ];
    const edges = counters.map((_, i) => ({
      data: { id: `e${i}`, source: `c${i}`, target: 'center', weight: 0.7, strength: 'soft' },
    }));
    const notes = [];
    if (strongM) notes.push(`Fuerte contra: ${strongM[1].trim()}`);
    if (weakM)   notes.push(`Débil contra: ${weakM[1].trim()} (descripción in-game — sin análisis curado todavía)`);
    else         notes.push('Sin counters documentados para esta unidad única todavía.');
    return res.json({ heading: uu.title, nodes, edges, notes,
                      uuCivs: uu.civs || [], source: 'unique-desc' });
  }

  // Fallback: parser de chunks de texto (si los Unit nodes aún no fueron importados)
  const [chunk] = await run(
    `MATCH (c:Chunk)-[:PART_OF]->(n:Note)
     WHERE n.path STARTS WITH 'counters/'
       AND toLower(c.heading) CONTAINS toLower($u)
     RETURN c.heading AS heading, c.text AS text
     ORDER BY size(c.heading) LIMIT 1`,
    { u: unit },
  );
  if (!chunk) return res.status(404).json({ error: "unidad no encontrada en los counters" });
  const rows = parseCounterTableRows(chunk.text);
  const notes = (chunk.text.match(/^>\s*(.+)$/gm) || []).map(n => n.replace(/^>\s*/,''));
  const nodes = [
    { data: { id:'center', label:chunk.heading, full:chunk.heading, type:'center' } },
    ...rows.map((r,i) => ({
      data: { id:`c${i}`, label:r.contra, full:r.contra,
              type:r.strength, tier:r.tier, nota:r.nota, weight:r.weight },
    })),
  ];
  const edges = rows.map((r,i) => ({
    data: { id:`e${i}`, source:`c${i}`, target:'center', weight:r.weight, strength:r.strength },
  }));
  res.json({ heading: chunk.heading, nodes, edges, notes, source: 'chunks' });
}));

// --- chat GraphRAG (shell-out al pipeline Python) --------------------------
const PY = process.env.PYTHON_BIN || "python";
app.post("/api/chat", chatRateLimit, (req, res) => {
  const q = (req.body?.question || "").trim();
  if (!q) return res.status(400).json({ error: "falta 'question'" });

  const py = spawn(PY, ["-m", "codex_rag.query", q], {
    env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" },
  });
  let out = "", err = "";
  py.stdout.on("data", (d) => (out += d));
  py.stderr.on("data", (d) => (err += d));
  py.on("error", (e) => res.status(500).json({ error: String(e) }));
  py.on("close", (code) => {
    if (code !== 0) return res.status(500).json({ error: err || "pipeline falló" });
    try {
      const line = out.trim().split("\n").pop();   // última línea = JSON
      res.json(JSON.parse(line));
    } catch {
      res.status(500).json({ error: "respuesta no parseable", raw: out, stderr: err });
    }
  });
});

app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));

process.on("SIGINT", async () => { await driver.close(); process.exit(0); });
