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
