// API REST sobre el grafo de conocimiento AoE2.
import express from "express";
import { spawn } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { run, driver } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
// Render/hosts inyectan PORT; API_PORT es el override local.
const PORT = process.env.PORT || process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, "public")));   // sirve el frontend (5b)

// Radares por civ (perfil de fuerza). Se generan desde el vault con
// scripts/build-radar.mjs y se commitean: el deploy no monta el vault.
let RADAR = {};
try {
  RADAR = JSON.parse(readFileSync(join(__dirname, "data", "radar.json"), "utf8"));
} catch (e) {
  console.error("[radar] no se pudo cargar data/radar.json:", e.message);
}

// Tier de Phosphor Rush (FC all-in en Arabia) por civ — tier list de Red Fosforu.
// Generado con scripts/build-phosphor.mjs desde el vault y commiteado.
let PHOSPHOR = {};
try {
  PHOSPHOR = JSON.parse(readFileSync(join(__dirname, "data", "phosphor.json"), "utf8"));
} catch (e) {
  console.error("[phosphor] no se pudo cargar data/phosphor.json:", e.message);
}

// Fortalezas/Debilidades autorales por civ — parseadas de las notas del vault con
// scripts/build-civ-traits.mjs. Las "weaknesses" ya nombran las unidades faltantes.
let CIV_TRAITS = {};
try {
  CIV_TRAITS = JSON.parse(readFileSync(join(__dirname, "data", "civ-traits.json"), "utf8"));
} catch (e) {
  console.error("[traits] no se pudo cargar data/civ-traits.json:", e.message);
}

// Reglas curadas: detectan unidades/techs faltantes en el texto de "Debilidades"
// y dan (a) la implicancia para la PROPIA civ y (b) cómo el rival la explota.
// 'demolition ship' se omite a propósito (irrelevante, por pedido del usuario).
const MISSING_RULES = [
  { re: /skirmisher de [eé]lite|elite skirmisher|sin .*skirmisher/i,
    label: "Elite Skirmisher",
    self: "sin Elite Skirmisher: sufrís contra masa de arqueros, salvo que tengas cab. fuerte o cav archers",
    opp:  "no llega a Elite Skirmisher → tus arqueros lo castigan más" },
  { re: /arbalest|thumb ?ring/i,
    label: "Arbalester / Thumb Ring",
    self: "arqueros flojos en Imperial (sin Arbalest/Thumb Ring), salvo cav archers",
    opp:  "sus arqueros no escalan bien → podés pelear la guerra de arqueros" },
  { re: /palad[ií]n/i,
    label: "Paladín",
    self: "sin Paladín: tu caballería pega un techo en Castle Age",
    opp:  "su caballería no escala a Paladín → tus pikes/monjes sufren menos en el late" },
  { re: /hussar/i,
    label: "Hussar",
    self: "sin Hussar: peor limpieza de asedio y raideo barato en Imperial",
    opp:  "sin Hussar para limpiar tu asedio → presioná con mangoneles" },
  { re: /halberd/i,
    label: "Halberdero",
    self: "sin Halberdero: muy vulnerable a caballería pesada (Paladín, Cataphract)",
    opp:  "no tiene Halberdero → tu caballería pesada lo destroza" },
  { re: /champion|two-?hand/i,
    label: "Campeón",
    self: "infantería tope-Castle (sin Campeón): no escala a Imperial",
    opp:  "su infantería no llega a Campeón → tu infantería gana el late" },
  { re: /hand ?cannon/i,
    label: "Hand Cannoneer",
    self: "sin Hand Cannoneer: menos respuesta a infantería masiva en Imperial",
    opp:  "sin Hand Cannoneer → tu infantería masiva es más segura" },
  { re: /siege onager|asedio limitad|siege limitad/i,
    label: "Siege Onager / asedio",
    self: "asedio limitado: te cuesta romper posiciones y arqueros masados",
    opp:  "su asedio es limitado → podés massar arqueros bajo torres/posición" },
  { re: /bombard|bbc/i,
    label: "Bombard Cannon",
    self: "sin Bombard Cannon: menos respuesta a asedio y posiciones en Imperial",
    opp:  "sin Bombard Cannon → tus mangoneles/posición aguantan mejor" },
  { re: /camel|camello/i,
    label: "Camellos",
    self: "sin Camellos: peor respuesta a la caballería pesada del rival",
    opp:  "sin Camellos → tu caballería pesada es más segura contra él" },
  { re: /bloodlines/i,
    label: "Bloodlines",
    self: "sin Bloodlines: tu caballería y scouts tienen menos HP",
    opp:  "sin Bloodlines → su caballería es más frágil de lo normal" },
  { re: /plate barding|plate mail/i,
    label: "Armor de caballería",
    self: "sin el último armor de caballería: tu cab. aguanta menos a distancia",
    opp:  "le falta armor de caballería → tus arqueros le hacen más daño" },
];

// Una cláusula expresa AUSENCIA si arranca con "sin/no/falta/carece/without" o
// menciona "limitad" → evita falsos positivos como "dependencia total del Paladín".
const ABSENCE_RE = /(^|[\s,])(sin|no|falta|carece|without)\b|limitad/i;

// Devuelve las unidades/techs faltantes de una civ con su implicancia, leyendo
// SOLO las cláusulas de ausencia del texto de "Debilidades" (autoral).
function civMissing(slug) {
  const items = CIV_TRAITS[slug]?.weaknesses || [];
  // Separa cada debilidad en sub-cláusulas por coma y conserva las de ausencia.
  const negative = items
    .flatMap((it) => it.split(/,|→/))
    .map((s) => s.trim())
    .filter((s) => ABSENCE_RE.test(s))
    .join(" ; ");
  if (!negative) return [];
  const seen = new Set();
  const out = [];
  for (const r of MISSING_RULES) {
    if (r.re.test(negative) && !seen.has(r.label)) {
      seen.add(r.label);
      out.push({ unit: r.label, self: r.self, opp: r.opp });
    }
  }
  return out;
}

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

// --- radares por civ (perfil de fuerza, generado desde el vault) ------------
app.get("/api/civ-radar", (_req, res) => res.json(RADAR));
app.get("/api/civ-radar/:slug", (req, res) => {
  const r = RADAR[(req.params.slug || "").toLowerCase()];
  if (!r) return res.status(404).json({ error: "sin radar para esa civilización" });
  res.json(r);
});

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
// Mapa precargado: slug de civ → Set de tree_ids disponibles.
// Lee los archivos JS del árbol al arrancar — evita depender de las relaciones
// HAS_UNIT de Neo4j que pueden estar incompletas si ingest.mjs no se corrió.
const CIV_AVAILABLE = (() => {
  const civDir = join(__dirname, "public/tree/src/data/civ");
  const map = new Map();
  try {
    for (const file of readdirSync(civDir).filter((f) => f.endsWith(".js"))) {
      const slug = file.replace(".js", "");
      const code = readFileSync(join(civDir, file), "utf8");
      const m = code.match(/"available"\s*:\s*\[([\s\S]*?)\]/);
      if (!m) continue;
      const items = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
      if (items.length) map.set(slug, new Set(items));
    }
  } catch (e) {
    console.error("[CIV_AVAILABLE] Error al cargar datos del árbol:", e.message);
  }
  return map;
})();

// Mapeo scope de bonus (civ JS) → line IDs del counter graph.
// "barracks"/"stable"/"archery" mapean a las líneas que producen esos edificios.
// "_eco" es un sentinel: esos bonuses se muestran como contexto de eco, no como
// fortaleza de unidad.
const SCOPE_TO_LINES = {
  "cavalry":              ["knight-line", "steppe-lancer", "camel-line"],
  "cavalry_no_camel":     ["knight-line", "steppe-lancer"],
  "camel":                ["camel-line"],
  "foot_archer":          ["archer-line"],
  "foot_archer_no_skirm": ["archer-line"],
  "light_cavalry":        ["scout-line"],
  "cavalry_archer":       ["cavalry-archer"],
  "infantry":             ["militia-line", "eagle-warrior"],
  "skirmisher":           ["skirmisher-line"],
  "elephant":             ["battle-elephant"],
  "monk":                 ["monk"],
  "mangonel":             ["mangonel-line"],
  "barracks":             ["militia-line", "spearman-line", "eagle-warrior"],
  "stable":               ["knight-line", "scout-line", "camel-line", "cavalry-archer"],
  "archery":              ["archer-line", "skirmisher-line", "cavalry-archer"],
  // scope global: aplica a todas las líneas de combate (Aztecs, Persians TC, etc.)
  "military_unit":        ["knight-line", "archer-line", "militia-line", "skirmisher-line",
                           "spearman-line", "scout-line", "camel-line", "cavalry-archer", "monk"],
  "tc":      ["_eco"], "mill":    ["_eco"], "forager": ["_eco"], "hunter": ["_eco"],
};

// Extrae el array "bonuses" de un archivo JS de civ usando bracket counting.
// El regex simple falla para civs con "teamBonus" entre "bonuses" y "available".
function extractBonusesArray(code) {
  const keyIdx = code.indexOf('"bonuses"');
  if (keyIdx === -1) return null;
  const arrStart = code.indexOf("[", keyIdx);
  if (arrStart === -1) return null;
  let depth = 0;
  for (let i = arrStart; i < code.length; i++) {
    const c = code[i];
    if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") { depth--; if (depth === 0) return code.slice(arrStart, i + 1); }
  }
  return null;
}

// Bonuses de cada civ precargados al inicio (slug → array de bonuses relevantes).
// Parsea el bloque "bonuses" de cada archivo JS del árbol; filtra por tipos y scopes
// que SCOPE_TO_LINES reconoce.
const CIV_BONUSES = (() => {
  const civDir = join(__dirname, "public/tree/src/data/civ");
  const map = new Map();
  const RELEVANT = new Set(["stat_modifier", "building_work_speed", "cost_modifier", "creation_speed"]);
  try {
    for (const file of readdirSync(civDir).filter((f) => f.endsWith(".js"))) {
      const slug = file.replace(".js", "");
      const code = readFileSync(join(civDir, file), "utf8");
      const raw = extractBonusesArray(code);
      if (!raw) continue;
      try {
        const clean = raw.replace(/\/\/[^\n]*/g, "").replace(/,(\s*[\]}])/g, "$1");
        const all = JSON.parse(clean);
        const kept = all.filter((b) => RELEVANT.has(b.type) && b.scope && SCOPE_TO_LINES[b.scope]);
        if (kept.length) map.set(slug, kept);
      } catch {}
    }
  } catch (e) {
    console.error("[CIV_BONUSES] Error al cargar bonuses:", e.message);
  }
  return map;
})();

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

// Roles del framework de composicion de 3 unidades (military.md — "Composicion
// de 3 Unidades"): oro (power unit, cuesta oro), trash (sin oro, protege al oro
// de su counter) y asedio (rompe edificios y ranged apilados). Default = oro.
const LINE_ROLE = {
  // trash: sin costo de oro ni piedra
  "skirmisher-line": "trash", "spearman-line": "trash", "scout-line": "trash",
  "eagle-warrior": "trash",   "slinger": "trash",
  // siege: rompe edificios y unidades ranged apiladas
  "mangonel-line": "siege", "scorpion-line": "siege", "ram-line": "siege",
  "bombard-cannon": "siege", "siege-elephant": "siege", "rocket-cart": "siege",
  "trebuchet": "siege",
  // support: utility units — excluidas del slot "gold" de la composicion
  "monk": "support",
};
const lineRole = (id) => LINE_ROLE[id] || "gold";

// Genera etiquetas de bonus para una línea de unidades dada la civ.
// Retorna { labels: string[], eco: string[] }:
//   labels → bonuses que fortalecen directamente esa línea (stat, costo, velocidad)
//   eco    → bonuses de eco relacionados (contexto, no afectan el semáforo)
function civLineBonuses(civSlug, lineId) {
  const bonuses = CIV_BONUSES.get(civSlug) || [];
  const labels = [], eco = [];
  for (const b of bonuses) {
    const targets = SCOPE_TO_LINES[b.scope] || [];
    const isEco = targets.includes("_eco");
    if (!targets.includes(lineId) && !isEco) continue;
    const v = Array.isArray(b.value_by_age) ? b.value_by_age[3] : (b.value ?? 1);
    let lbl = null;
    if (b.type === "stat_modifier" && ["hp", "attack", "range", "rof"].includes(b.stat)) {
      const pct = b.op === "multiply" ? `${Math.round((v - 1) * 100)}%` : `+${v}`;
      lbl = `${b.stat} ${pct}`;
    } else if (b.type === "building_work_speed" && !isEco) {
      lbl = `entrena ${Math.round((v - 1) * 100)}% más rápido`;
    } else if (b.type === "creation_speed") {
      // value < 1 means faster: 0.85 = 15% más rápido
      lbl = `entrena ${Math.round((1 - v) * 100)}% más rápido`;
    } else if (b.type === "cost_modifier") {
      lbl = `costo -${Math.round((1 - v) * 100)}%`;
    } else if (isEco) {
      eco.push(b.type === "building_work_speed" ? `${b.scope} +vel` : b.type);
    }
    if (lbl) labels.push(lbl);
  }
  return { labels, eco };
}

// Lineas navales: solo relevantes en mapas de agua (military.md confirma que el
// naval es map-dependent). Se filtran en mapas terrestres.
const NAVAL_LINES = new Set([
  "galley-line", "fire-ship-line", "demo-ship", "hulk-line", "cannon-galleon",
  "lou-chuan", "dromon", "catapult-galleon", "turtle-ship", "caravel",
  "longboat", "thirisadai", "dragon-ship",
]);
const WATER_MAP_KW = ["island", "nomad", "migration", "four lakes", "shoreline",
  "eastmus", "socotra", "archipelago", "water", "lake", "coastal", "team islands"];
const isWaterMap = (map) => {
  const m = (map || "").toLowerCase();
  return WATER_MAP_KW.some((w) => m.includes(w));
};

// Recetas canonicas del vault (military.md): combos con nombre propio donde cada
// pieza cubre el counter de la otra. Se destacan si tengo ambas y el rival no
// puede contestar limpio.
const CANONICAL_COMBOS = [
  {
    name: "Crossbow + Knights", parts: ["archer-line", "knight-line"], age: "Castle",
    why: "Casi imparable: los knights limpian skirms/siege que matan a tus crossbow; los crossbow hacen trizas a las picas/monjes/camellos que matan a tus knights. El rival necesita dos ejercitos distintos.",
  },
  {
    name: "Scouts + Archers", parts: ["scout-line", "archer-line"], age: "Feudal",
    why: "El combo mas fuerte de Feudal: los arqueros matan lanceros, los scouts limpian skirms (que no danan scouts). Gana casi cualquier mezcla feudal.",
  },
  {
    name: "Paladin + Elite Skirm + Siege", parts: ["knight-line", "skirmisher-line"], age: "Imperial",
    why: "Composicion clasica de late game (Hera): el Skirm mata halbardiers que countered al Paladin; el siege destruye edificios y unidades ranged apiladas. Requiere knight-line y skirm disponibles.",
  },
  {
    name: "Arbalest + Halberdier + Bombard", parts: ["archer-line", "spearman-line", "bombard-cannon"], age: "Imperial",
    why: "Arbalest domina infanteria y camellos; los Halbs matan caballeria que contesta arbalest; el Bombard destruye scorpions/onagers y torres. Composicion completa de late game.",
  },
  {
    name: "Camello + Skirm + Siege", parts: ["camel-line", "skirmisher-line"], age: "Imperial",
    why: "Composicion de civs con camellos (Saracenos, Hindustanis, Beduinos): el Camel anula caballeria rival; el Skirm cubre vs arqueros que countered a los camellos; el siege finaliza el juego.",
  },
];

// Clases de las descripciones in-game ("Weak vs. Cavalry and Archery Units") →
// líneas genéricas del counter graph. El orden importa: los términos compuestos
// ('cavalry archer') se chequean antes que los genéricos ('cavalry', 'archer').
const CLASS_TO_LINES = [
  // ── Archery — compuestos antes que sus componentes ──────────────────────────
  ['cavalry archer',  ['cavalry-archer']],
  ['elephant archer', ['elephant-archer']],      // antes de 'archer' y 'elephant'
  ['mounted archer',  ['cavalry-archer']],
  ['foot archer',     ['archer-line']],
  ['archery unit',    ['archer-line']],
  ['archer',          ['archer-line']],
  ['ranged soldier',  ['archer-line', 'skirmisher-line']],
  ['skirmisher',      ['skirmisher-line']],
  ['gunner',          ['hand-cannoneer']],
  ['gunpowder',       ['hand-cannoneer']],
  ['hand cannoneer',  ['hand-cannoneer']],
  // ── Infantry ───────────────────────────────────────────────────────────────
  ['spearman',        ['spearman-line']],
  ['pikemen',         ['spearman-line']],
  ['halberdier',      ['spearman-line']],
  ['militia',         ['militia-line']],
  ['infantry',        ['militia-line']],
  ['fire lancer',     ['fire-lancer']],          // antes de 'fire ship'/'fire galley'
  // ── Cavalry ───────────────────────────────────────────────────────────────
  ['steppe lancer',   ['steppe-lancer']],        // antes de 'cavalry'
  ['camel',           ['camel-line']],
  ['mounted unit',    ['knight-line']],
  ['cavalry',         ['knight-line']],
  ['monk',            ['monk']],
  // ── Siege ─────────────────────────────────────────────────────────────────
  ['mangonel',        ['mangonel-line']],
  ['onager',          ['mangonel-line']],
  ['scorpion',        ['scorpion-line']],
  ['battering ram',   ['ram-line']],             // antes de 'ram'
  ['bombard cannon',  ['bombard-cannon']],       // antes de 'bombard' / 'siege'
  ['siege elephant',  ['siege-elephant']],       // antes de 'siege' y 'elephant'
  ['armored elephant',['siege-elephant']],       // antes de 'elephant'
  ['siege weapon',    ['mangonel-line', 'scorpion-line', 'bombard-cannon', 'ram-line', 'siege-elephant']],
  ['siege',           ['mangonel-line', 'bombard-cannon', 'ram-line']],
  ['ram',             ['ram-line']],
  ['bombard',         ['bombard-cannon']],
  ['rocket cart',     ['rocket-cart']],
  // ── Other land ────────────────────────────────────────────────────────────
  ['eagle',           ['eagle-warrior']],
  ['elephant',        ['battle-elephant']],
  ['close range',     ['militia-line']],
  // ── Naval — compuestos antes que sus componentes ───────────────────────────
  ['long range warship', ['cannon-galleon', 'catapult-galleon', 'lou-chuan', 'dromon']],
  ['cannon galleon',  ['cannon-galleon']],       // antes de 'galleon'
  ['catapult galleon',['catapult-galleon']],     // antes de 'galleon'
  ['turtle ship',     ['turtle-ship']],
  ['dragon ship',     ['dragon-ship']],
  ['demolition',      ['demo-ship']],
  ['fire ship',       ['fire-ship-line']],
  ['fire galley',     ['fire-ship-line']],
  ['war hulk',        ['hulk-line']],
  ['hulk',            ['hulk-line']],
  ['galley',          ['galley-line']],
  ['longboat',        ['longboat']],
  ['caravel',         ['caravel']],
  ['dromon',          ['dromon']],
  ['lou chuan',       ['lou-chuan']],
  ['thirisadai',      ['thirisadai']],
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
  const slug = (req.query.civ || "").trim().toLowerCase();
  if (!slug) return res.status(400).json({ error: "falta ?civ=" });
  // Resolución case-insensitive: el path del nodo Civ es "civs/Britons.md".
  const [civ] = await run(
    `MATCH (c:Civ) WHERE toLower(c.path) = toLower($path)
     RETURN c.title AS title, c.path AS path`,
    { path: `civs/${slug}.md` });
  if (!civ) return res.status(404).json({ error: "civ no encontrada", slug });
  const path = civ.path;

  // Disponibilidad desde el árbol vendorizado (CIV_AVAILABLE) — completo y no
  // depende de las aristas HAS_UNIT del grafo (que el sync no recrea). Es la misma
  // fuente que usa matchupLines.
  const available = CIV_AVAILABLE.get(slug) || new Set();
  const units = Object.entries(LINE_MEMBERS)
    .filter(([, members]) => members.some((m) => available.has(m)))
    .map(([line]) => line);

  // Unidades únicas de la civ (sin las Elite — son la misma línea).
  const uuRows = await run(
    `MATCH (:Civ {path:$path})-[:HAS_UNIQUE_UNIT]->(u)
     WHERE NOT u.title STARTS WITH 'Elite'
     RETURN u.title AS title, u.tree_id AS treeId ORDER BY u.title`, { path });
  res.json({ civ: civ.title, slug, units, uniqueUnits: uuRows });
}));

// --- detalle de una civ (kit único + tiers + vecinos) ----------------------
async function matchupCiv(slug) {
  const clean = String(slug || "").trim().toLowerCase();
  if (!/^[a-z0-9_-]+$/.test(clean)) return null;
  const path = `civs/${clean}.md`;
  const [base] = await run(
    `MATCH (c:Civ)
     WHERE toLower(c.path) = toLower($path)
     RETURN c.path AS path, c.title AS title, c.aliases AS aliases`,
    { path },
  );
  return base ? { slug: clean, ...base } : null;
}

async function matchupKit(path) {
  // Una sola query: UU, UT y tiers de la civ en una round-trip (antes eran 3).
  // collect() puede traer entradas nulas cuando un OPTIONAL MATCH no encaja;
  // se filtran/ordenan en JS para conservar el shape y el orden originales.
  const [row] = await run(
    `MATCH (c:Civ {path:$path})
     OPTIONAL MATCH (c)-[:HAS_UNIQUE_UNIT]->(u) WHERE NOT u.title STARTS WITH 'Elite'
     WITH c, collect(DISTINCT {title:u.title, path:u.path, treeId:u.tree_id}) AS units
     OPTIONAL MATCH (c)-[:HAS_UNIQUE_TECH]->(t)
     WITH c, units, collect(DISTINCT {title:t.title, path:t.path, treeId:t.tree_id}) AS techs
     OPTIONAL MATCH (c)-[r:RATED]->(tl:TierList)
     RETURN units, techs, collect(DISTINCT {list:tl.name, tier:r.tier}) AS tiers`,
    { path },
  );
  const byTitle = (a, b) => String(a.title).localeCompare(String(b.title));
  const uniqueUnits = (row?.units ?? []).filter((x) => x.title).sort(byTitle);
  const uniqueTechs = (row?.techs ?? []).filter((x) => x.title).sort(byTitle);
  const tiers = (row?.tiers ?? [])
    .filter((x) => x.list)
    .sort((a, b) => String(a.list).localeCompare(String(b.list)));
  return { uniqueUnits, uniqueTechs, tiers };
}

async function matchupLines(civPath) {
  // Extraer slug del path Neo4j ("civs/Franks.md" → "franks")
  const slug = civPath.replace(/^civs\//, "").replace(/\.md$/, "").toLowerCase();
  const available = CIV_AVAILABLE.get(slug);
  if (!available) return [];

  const lineIds = Object.entries(LINE_MEMBERS)
    .filter(([, members]) => members.some((m) => available.has(m)))
    .map(([lineId]) => lineId);
  if (!lineIds.length) return [];

  const labels = await run(
    `MATCH (u:Unit) WHERE u.id IN $ids
     RETURN u.id AS id, u.label AS label, u.img_key AS imgKey`,
    { ids: lineIds },
  );
  const byId = new Map(labels.map((r) => [r.id, r]));
  return lineIds.map((id) => ({
    id,
    label: byId.get(id)?.label || id.replace(/-/g, " "),
    imgKey: byId.get(id)?.imgKey || "",
  }));
}

async function matchupCounterEdges(fromIds, toIds) {
  if (!fromIds.length || !toIds.length) return [];
  return run(
    `MATCH (a:Unit)-[r:COUNTERS]->(b:Unit)
     WHERE a.id IN $fromIds AND b.id IN $toIds
     RETURN a.id AS fromId, a.label AS from, a.img_key AS fromImg,
            b.id AS toId, b.label AS target, b.img_key AS targetImg,
            r.weight AS weight, r.strength AS strength,
            r.context AS context, r.notes AS notes
     ORDER BY r.weight DESC, a.label
     LIMIT 10`,
    { fromIds, toIds },
  );
}

// Buscador de huecos: una linea propia es un EXPLOIT cuando el rival no tiene
// acceso a sus counters. Pregunta invertida vs matchupCounterEdges: miramos los
// COUNTERS *entrantes* a cada linea mia y cuales le faltan al rival. Sobre eso
// armamos una composicion gold/trash/siege (military.md) y destacamos recetas
// canonicas. En mapas terrestres se filtran las lineas navales.
async function matchupExploits(meLines, vsLines, { map } = {}) {
  const water = isWaterMap(map);
  const keep = (l) => water || !NAVAL_LINES.has(l.id);
  const myLines = meLines.filter(keep);
  const oppLines = vsLines.filter(keep);
  const meIds = myLines.map((x) => x.id);
  if (!meIds.length) return { lines: [], recipes: [], composition: null };
  const vsHas = new Set(oppLines.map((x) => x.id));
  const meSet = new Set(meIds);
  const meLabels = new Map(myLines.map((x) => [x.id, x.label]));

  const rows = await run(
    `MATCH (counter:Unit)-[r:COUNTERS]->(mine:Unit)
     WHERE mine.id IN $meIds
     RETURN mine.id AS lineId, mine.label AS lineLabel,
            counter.id AS counterId, counter.label AS counterLabel,
            r.weight AS weight, r.context AS context`,
    { meIds },
  );

  // Agrupar por linea propia, separando gaps (rival NO tiene) de risks (rival SI).
  const byLine = new Map();
  for (const r of rows) {
    if (!byLine.has(r.lineId)) {
      byLine.set(r.lineId, { id: r.lineId, label: r.lineLabel, gaps: [], risks: [] });
    }
    const slot = vsHas.has(r.counterId) ? "risks" : "gaps";
    byLine.get(r.lineId)[slot].push({
      id: r.counterId, label: r.counterLabel,
      weight: r.weight || 0, context: r.context || "general",
    });
  }
  for (const l of myLines) {
    if (!byLine.has(l.id)) byLine.set(l.id, { id: l.id, label: l.label, gaps: [], risks: [] });
  }

  // Preservar bonus/eco que vienen de la civ (enriquecidos antes de llamar esta fn).
  const bonusByLineId = new Map(myLines.filter((l) => l.bonus).map((l) => [l.id, l.bonus]));
  const ecoByLineId = new Map(myLines.filter((l) => l.eco?.length).map((l) => [l.id, l.eco]));

  const lines = [...byLine.values()].map((l) => {
    const primaryRisk = l.risks.some((r) => r.weight >= 1.0);
    const solidRisk = l.risks.some((r) => r.weight >= 0.7 && r.weight < 1.0);
    const status = primaryRisk ? "red" : solidRisk ? "yellow" : "green";
    return {
      ...l, role: lineRole(l.id), status,
      bonus: bonusByLineId.get(l.id) || null,
      eco: ecoByLineId.get(l.id) || [],
    };
  });
  const rank = { green: 0, yellow: 1, red: 2 };
  lines.sort((a, b) => rank[a.status] - rank[b.status] || b.gaps.length - a.gaps.length);
  const byId = new Map(lines.map((l) => [l.id, l]));

  // Cobertura: que lineas propias counterean a un riesgo dado (edge saliente).
  const allRiskIds = [...new Set(lines.flatMap((l) => l.risks.map((r) => r.id)))];
  const coverByRisk = new Map();
  if (allRiskIds.length) {
    const coverRows = await run(
      `MATCH (mine:Unit)-[r:COUNTERS]->(risk:Unit)
       WHERE mine.id IN $meIds AND risk.id IN $riskIds
       RETURN mine.id AS coverId, risk.id AS riskId, r.weight AS weight`,
      { meIds, riskIds: allRiskIds },
    );
    for (const c of coverRows) {
      if (!coverByRisk.has(c.riskId)) coverByRisk.set(c.riskId, []);
      coverByRisk.get(c.riskId).push({ id: c.coverId, weight: c.weight || 0 });
    }
  }

  // ── Composicion de 3 unidades (military.md) ───────────────────────────────
  // Oro = mejor linea explotable que cuesta oro. Trash = la que cubre el riesgo
  // residual del oro. Asedio = mejor linea de asedio disponible.
  const exploitable = lines.filter((l) => l.status !== "red");
  // Slot gold: preferir una linea de oro no-red; si todas son red, tomar la mejor
  // de igual forma — nunca usar siege/trash/support como fallback del slot oro.
  const gold = exploitable.find((l) => l.role === "gold")
    || lines.find((l) => l.role === "gold")
    || null;
  let composition = null;
  if (gold) {
    // Trash que cubre el riesgo principal del oro.
    let trash = null, covers = null;
    for (const risk of gold.risks) {
      const cand = (coverByRisk.get(risk.id) || [])
        .filter((c) => c.id !== gold.id && lineRole(c.id) === "trash")
        .sort((a, b) => b.weight - a.weight)[0];
      if (cand) { trash = byId.get(cand.id); covers = risk.label; break; }
    }
    // Fallback: cualquier trash disponible (proteccion generica).
    if (!trash) trash = lines.find((l) => l.role === "trash" && l.status !== "red")
      || lines.find((l) => l.role === "trash") || null;
    // Asedio: preferir el que el rival no contesta limpio.
    const siege = lines.find((l) => l.role === "siege" && l.status !== "red")
      || lines.find((l) => l.role === "siege") || null;
    composition = {
      gold: gold.label,
      goldBonus: gold.bonus || null,
      trash: trash ? trash.label : null,
      trashBonus: trash?.bonus || null,
      trashCovers: trash && covers ? covers : null,
      siege: siege ? siege.label : null,
    };
  }

  // ── Recetas canonicas ─────────────────────────────────────────────────────
  const recipes = [];
  for (const c of CANONICAL_COMBOS) {
    if (!c.parts.every((p) => meSet.has(p))) continue;
    // Los combos canonicos siempre se muestran cuando la civ tiene acceso a todas
    // las piezas — son fuertes precisamente por su sinergia, no por la fortaleza
    // individual de cada unidad. Marcamos como "risky" si alguna pieza es roja
    // para que el usuario sepa que el combo tiene riesgos en este matchup.
    const risky = c.parts.some((p) => byId.get(p)?.status === "red");
    recipes.push({ name: c.name, age: c.age, why: c.why, risky });
  }

  return { lines: lines.slice(0, 6), recipes, composition };
}

// --- matchup lab: civ vs civ briefing from graph data ----------------------
function buildPlan(myKit, oppKit, myLines, myAnswers, myThreats, myExploits) {
  const plan = [];
  if (myLines.length) {
    plan.push(`Abrí con tus líneas más sólidas: ${myLines.slice(0, 3).map((x) => x.label).join(", ")}.`);
  }
  const strongAnswers = myAnswers.filter((a) => (a.weight || 0) >= 0.8);
  const modAnswers    = myAnswers.filter((a) => (a.weight || 0) < 0.8 && (a.weight || 0) >= 0.5);
  if (strongAnswers.length) {
    const nExtra = strongAnswers.length - 1;
    const extras = nExtra > 0 ? ` (y ${nExtra} ${nExtra > 1 ? "opciones" : "opción"} más para castigarlo)` : "";
    plan.push(`Tu mejor respuesta: con ${strongAnswers[0].from} aplastás al ${strongAnswers[0].target}${extras}.`);
  } else if (modAnswers.length) {
    plan.push(`Tenés un counter decente: ${modAnswers[0].from} contra ${modAnswers[0].target}, pero hay que micrearlo para que rinda.`);
  } else if (!myAnswers.length && myLines.length) {
    plan.push(`No hay counters directos curados para este cruce: jugá con tus líneas y adaptá en partida.`);
  }
  const strongThreats = myThreats.filter((t) => (t.weight || 0) >= 0.8);
  if (strongThreats.length) {
    plan.push(`Cuidado serio: el ${strongThreats[0].from} del rival destroza a tu ${strongThreats[0].target}. Respetalo.`);
  } else if (myThreats.length) {
    plan.push(`Ojo con el ${myThreats[0].from} rival contra tu ${myThreats[0].target}.`);
  }
  const topExploit = myExploits.lines.find((l) => l.status === "green" && l.gaps.length);
  if (topExploit) {
    const missing = topExploit.gaps.slice(0, 2).map((g) => g.label).join(", ");
    plan.push(`Hueco para explotar: tu ${topExploit.label} pega justo donde al rival le faltan counters (${missing}).`);
  }
  if (myKit.uniqueUnits.length) {
    const uu = myKit.uniqueUnits[0].title;
    plan.push(`Apuntá a tu unidad única (${uu}): entra en Castle Age, construí hacia ella si el cruce lo permite.`);
  }
  if (myKit.uniqueTechs.length) {
    const ut = myKit.uniqueTechs.slice(0, 2).map((x) => x.title).join(" y ");
    plan.push(`No te olvides de tus tecnologías únicas clave: ${ut}.`);
  }
  const myTier  = myKit.tiers.find((t) => t.list.toLowerCase().includes("arabia"));
  const oppTier = oppKit.tiers.find((t) => t.list.toLowerCase().includes("arabia"));
  if (myTier && oppTier && myTier.tier !== oppTier.tier) {
    plan.push(`En Arabia el ranking te pone en ${myTier.tier} vs ${oppTier.tier} del rival: ajustá la agresividad acorde.`);
  }
  return plan;
}

app.get("/api/matchup", wrap(async (req, res) => {
  const [me, vs] = await Promise.all([
    matchupCiv(req.query.me),
    matchupCiv(req.query.vs),
  ]);
  const map = (req.query.map || "").toString().trim();
  if (!me || !vs) return res.status(404).json({ error: "civilizacion no encontrada" });
  if (me.slug === vs.slug) return res.status(400).json({ error: "elegi dos civilizaciones distintas" });

  const [meKit, vsKit, meLines, vsLines] = await Promise.all([
    matchupKit(me.path),
    matchupKit(vs.path),
    matchupLines(me.path),
    matchupLines(vs.path),
  ]);
  const meIds = meLines.map((x) => x.id);
  const vsIds = vsLines.map((x) => x.id);
  // Enriquecer líneas con bonuses de cada civ: propio (mis líneas) y ajeno (rival).
  const slug_me = me.path.replace(/^civs\//, "").replace(/\.md$/, "").toLowerCase();
  const slug_vs = vs.path.replace(/^civs\//, "").replace(/\.md$/, "").toLowerCase();
  const enrichLines = (lines, civSlug, tag) => lines.map((l) => {
    const { labels, eco } = civLineBonuses(civSlug, l.id);
    return { ...l, bonus: labels.length ? { tag, labels } : null, eco };
  });
  const meLinesB = enrichLines(meLines, slug_me, "propio");
  const vsLinesB = enrichLines(vsLines, slug_vs, "ajeno");
  const [answers, threats, exploits, vsExploits, sharedNotes] = await Promise.all([
    matchupCounterEdges(meIds, vsIds),
    matchupCounterEdges(vsIds, meIds),
    matchupExploits(meLinesB, vsLinesB, { map }),
    matchupExploits(vsLinesB, meLinesB, { map }),
    run(
      `MATCH (c:Chunk)
       WHERE (toLower(c.text) CONTAINS toLower($me) OR ANY(a IN $meAliases WHERE toLower(c.text) CONTAINS toLower(a)))
         AND (toLower(c.text) CONTAINS toLower($vs) OR ANY(a IN $vsAliases WHERE toLower(c.text) CONTAINS toLower(a)))
       RETURN c.note AS note, c.heading AS heading,
              substring(c.text, 0, 420) AS excerpt
       ORDER BY size(c.text) LIMIT 5`,
      { me: me.title, meAliases: me.aliases || [], vs: vs.title, vsAliases: vs.aliases || [] },
    ),
  ]);

  const plan   = buildPlan(meKit, vsKit, meLinesB, answers, threats, exploits);
  const planVs = buildPlan(vsKit, meKit, vsLinesB, threats, answers, vsExploits);

  // Alerta de Phosphor Rush (FC all-in Arabia): tier de cada civ según Red Fosforu.
  const phosphorRush = {
    me: PHOSPHOR[me.slug] ? { civ: me.title, ...PHOSPHOR[me.slug] } : null,
    vs: PHOSPHOR[vs.slug] ? { civ: vs.title, ...PHOSPHOR[vs.slug] } : null,
  };

  // Fortalezas/Debilidades autorales + unidades faltantes con implicancia.
  const traits = {
    me: CIV_TRAITS[me.slug] || { strengths: [], weaknesses: [] },
    vs: CIV_TRAITS[vs.slug] || { strengths: [], weaknesses: [] },
  };
  const missing = { me: civMissing(me.slug), vs: civMissing(vs.slug) };

  res.json({
    me,
    vs,
    kits: { me: meKit, vs: vsKit },
    lines: { me: meLinesB, vs: vsLinesB },
    counters: { answers, threats },
    exploits,
    vsExploits,
    sharedNotes,
    plan,
    planVs,
    phosphorRush,
    traits,
    missing,
  });
}));

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
    `MATCH (c:Note)-[r]-(m:Note)
     WHERE toLower(c.path) = toLower($path)
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
