// Genera web/data/icons.json: el catálogo de GameKit (web/public/gamekit.js).
//   items    id → { n, k, i, … detalle para el hover }: nombre, familia (unit|tech|building), ícono y, según el tipo,
//            edad, costo, tiempo, dónde se produce, stats, bonus de ataque, texto del efecto (ES) y disponibilidad por civ.
//   names    índice nombre en inglés (minúsculas) → id, para poner íconos dentro de textos.
//   civs     slugs con emblema (public/img/civs/<slug>.png);  civInfo: ficha corta por civ para su hover.
//   ages / stats / res   íconos de edades, atributos y recursos.
// Fuente: NODES, unitStats y locales del árbol vendorizado (public/tree/src), unit-classes.json, team-roles.json,
// civ-traits.json y phosphor.json. Solo entran ids cuyo archivo existe en public/tree/.
//   node web/scripts/build-icons.mjs        (o: npm run data:icons)
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");
process.env.TREE_DATA_DIR = process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");
const { loadTree, availableIds } = await import("../techtree/load.mjs");
const t = await loadTree();
const readJson = (f, fb = {}) => { try { return JSON.parse(readFileSync(join(WEB, "data", f), "utf8")); } catch { return fb; } };
const UNIT_CLASSES = readJson("unit-classes.json"), TEAM = readJson("team-roles.json"), TRAITS = readJson("civ-traits.json"), PHOS = readJson("phosphor.json");

const slugify = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ── textos en español del árbol (locales/es.js): nombre y efecto por id ──
const es = readFileSync(join(WEB, "public", "tree", "src", "locales", "es.js"), "utf8");
const ES = {};
const rx = /^\s*['"]?([a-z0-9_]+)['"]?\s*:\s*\{\s*name\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")\s*(?:,\s*effect\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"))?/gm;
for (let m; (m = rx.exec(es)); ) ES[m[1]] = { n: (m[2] ?? m[3] ?? "").replace(/\\(['"])/g, "$1"), e: (m[4] ?? m[5] ?? "").replace(/\\(['"])/g, "$1") };
const rxPlain = /^\s*['"]?([a-z0-9_]+)['"]?\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")\s*,?\s*$/gm;
for (let m; (m = rxPlain.exec(es)); ) if (!ES[m[1]]) ES[m[1]] = { n: (m[2] ?? m[3] ?? "").replace(/\\(['"])/g, "$1"), e: "" };

// kind visible: a qué familia de pigmento del árbol pertenece el ícono
const KIND = { unit: "unit", upgrade: "unit", tech: "tech", building: "building", defencive: "building" };
const PRIORITY = { unit: 0, upgrade: 1, building: 2, defencive: 2, tech: 3 };   // gana el menor si dos ids comparten nombre

// Respaldo: edificios sin archivo propio en el nodo (ej. house) se resuelven por el `pic` de la grilla de civ.
const PIC = {};
for (const tree of Object.values(t.CIV_TREES || {})) for (const b of tree.b || []) if (b.pic != null && !(b.id in PIC)) PIC[b.id] = `img/Building/${b.pic}.png`;

// Disponibilidad por civ (grilla del juego): id → slugs
const AVAIL = {};
for (const [slug, tree] of Object.entries(t.CIV_TREES || {})) for (const id of availableIds(tree)) (AVAIL[id] ||= []).push(slug);
const TOTAL_CIVS = Object.keys(t.CIV_TREES || {}).length;

// Producción: edificio → ids que produce o investiga (nodo.building)
const PRODUCES = {};
for (const n of t.NODES) if (n.building && KIND[n.type]) (PRODUCES[n.building] ||= []).push(n.id);

const compact = (o) => (o && Object.values(o).some((v) => v) ? Object.fromEntries(Object.entries(o).filter(([, v]) => v)) : undefined);
const items = {}, byName = {};
let missingFile = 0;
for (const n of t.NODES) {
  const kind = KIND[n.type];
  if (!kind || !n.imgPath) continue;                                 // 'unique' son placeholders por civ: se omiten
  const name = t.names?.[n.id];
  const label = typeof name === "string" ? name : name?.name;
  if (!label) continue;
  let img = n.imgPath;
  if (!existsSync(join(WEB, "public", "tree", img))) {
    if (PIC[n.id] && existsSync(join(WEB, "public", "tree", PIC[n.id]))) img = PIC[n.id];
    else { missingFile++; continue; }
  }
  const it = { n: label, k: kind, i: img, ty: n.type, a: n.age ?? 0 };
  if (ES[n.id]?.n && ES[n.id].n.toLowerCase() !== label.toLowerCase()) it.es = ES[n.id].n;
  if (ES[n.id]?.e) it.ef = ES[n.id].e;
  if (n.building) it.w = n.building;                                          // dónde se produce / investiga
  const cost = compact(n.type === "building" || n.type === "defencive" ? n.build_cost : n.train_cost);
  if (cost) it.c = cost;
  const rcost = compact(n.research_cost); if (rcost) it.rc = rcost;
  const st = t.unitStats?.[n.id];
  if (n.type === "unit" || n.type === "upgrade") {
    if (st?.train || n.train_time) it.t = st?.train ?? n.train_time;
    if (st) it.st = { hp: st.hp, atk: st.attack, arm: st.armor, rng: st.range, spd: st.speed, rof: st.rof };
    const uc = UNIT_CLASSES[slugify(label)];
    if (uc) {
      if (uc.strong) it.sg = uc.strong;
      if (uc.weak) it.wk = uc.weak;
      const top = Object.entries(uc.bonus || {}).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 4);
      if (top.length) it.bo = Object.fromEntries(top);
    }
  }
  if (n.research_time) it.rt = n.research_time;
  if (n.build_time) it.bt = n.build_time;
  if ((n.type === "building" || n.type === "defencive") && n.stats) it.st = { hp: n.stats.hp, arm: n.stats.armor, atk: n.stats.attack, rng: n.stats.range };
  if (it.k === "building" && PRODUCES[n.id]) it.pr = PRODUCES[n.id].slice(0, 12);
  const av = AVAIL[n.id];
  if (av) { it.nv = av.length; if (av.length <= 8 && av.length < TOTAL_CIVS) it.av = av; }
  items[n.id] = it;
  const key = label.toLowerCase();
  const prev = byName[key];
  if (!prev || PRIORITY[n.type] < prev.p) byName[key] = { id: n.id, p: PRIORITY[n.type] };
}
// 'pr' solo con ids que existen en el catálogo
for (const it of Object.values(items)) if (it.pr) it.pr = it.pr.filter((id) => items[id]);
const index = Object.fromEntries(Object.entries(byName).map(([k, v]) => [k, v.id]));

// ── civs: emblemas y ficha corta para el hover ──
const civs = readdirSync(join(WEB, "public", "img", "civs")).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, ""));
const civInfo = {};
for (const [slug, c] of Object.entries(TEAM)) {
  civInfo[slug] = {
    n: c.name, sp: c.specialty || "", tb: c.teamBonus || "", pos: c.position,
    st: (TRAITS[slug]?.strengths || []).slice(0, 2), wk: (TRAITS[slug]?.weaknesses || []).slice(0, 2),
    ...(PHOS[slug]?.tier ? { ph: PHOS[slug].tier, uu: PHOS[slug].uu || "" } : {}),
  };
}

const ages = { dark: "img/Ages/base_dark_age.png", feudal: "img/Ages/base_feudal_age.png", castle: "img/Ages/base_castle_age.png", imperial: "img/Ages/base_imperial_age.png" };
const stats = { hp: "img/Icon/hp.webp", attack: "img/Icon/attack.webp", armor: "img/Icon/armor.webp", pierce: "img/Icon/pierce_armor.webp",
  range: "img/Icon/range.webp", speed: "img/Icon/speed.webp", rof: "img/Icon/reload.webp" };
const res = { food: "img/food.png", wood: "img/wood.png", gold: "img/gold.png", stone: "img/stone.png" };

writeFileSync(join(WEB, "data", "icons.json"), JSON.stringify({ items, names: index, civs, civInfo, ages, stats, res, totalCivs: TOTAL_CIVS }) + "\n");
const byKind = Object.values(items).reduce((a, x) => ((a[x.k] = (a[x.k] || 0) + 1), a), {});
const withEf = Object.values(items).filter((x) => x.ef).length, withSt = Object.values(items).filter((x) => x.st).length;
console.log(`icons.json: ${Object.keys(items).length} ítems ${JSON.stringify(byKind)} · ${Object.keys(index).length} nombres · ${civs.length} emblemas · ${Object.keys(civInfo).length} fichas de civ · con efecto ES ${withEf} · con stats ${withSt} · sin archivo ${missingFile}`);
