// Genera web/data/map-guides.json a partir de las notas de maps/ de la wiki pública: una guía
// por mapa con su ficha (tipo, datos), las civs que destacan, las estrategias enlazadas y
// el resto de las secciones en Markdown crudo (se renderiza en el cliente).
//   node web/scripts/build-map-guides.mjs   (usa AOE_WIKI, default D:\Boveda\AoE-Wiki)
// El JSON se commitea: el deploy (sin vault) lo sirve vía /api/maps.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.AOE_WIKI || "D:\\Boveda\\AoE-Wiki";
const dir = join(VAULT, "maps");

export const slugify = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const plain = (s) => s
  .replace(/\\\|/g, "|")
  .replace(/\[\[[^\]|]+?\|([^\]]+)\]\]/g, "$1")
  .replace(/\[\[(?:[^\]]*\/)?([^\]]+)\]\]/g, "$1")
  .replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
const cells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => plain(c));

const TYPE_ES = { abierto: "Abierto", cerrado: "Cerrado", agua: "Agua", nomada: "Nómada", hibrido: "Híbrido", semiabierto: "Semiabierto", caotico: "Caótico" };
const TYPE_AXIS = { abierto: "open", cerrado: "closed", agua: "water", nomada: "nomad" };   // eje del radar equivalente
const SKIP = /^(relacionado|fuentes|datos)$/i;
const TEAM = JSON.parse(readFileSync(join(__dirname, "..", "data", "team-roles.json"), "utf8"));
const CIV_NAMES = Object.values(TEAM).map((t) => t.name).sort((a, b) => b.length - a.length);
// los nombres de civ son solo letras y espacios: no necesitan escape
const CIV_RE = new RegExp(`(?<![A-Za-z])(${CIV_NAMES.join("|")})(?![A-Za-z])`, "g");

const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "index.md" && !f.startsWith("tipo-"));
const out = [];
for (const file of files) {
  const text = readFileSync(join(dir, file), "utf8").replace(/\r\n/g, "\n");
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  const tags = (fm.match(/tags:\s*\[([^\]]*)\]/)?.[1] || "").split(",").map((s) => s.trim());
  const aliases = [...(fm.match(/aliases:\s*\[([^\]]*)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const body = text.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const lines = body.split("\n");
  const name = plain(lines.find((l) => l.startsWith("# "))?.slice(2) || file.replace(/\.md$/, ""));
  const quote = plain((lines.find((l) => l.startsWith("> ")) || "").slice(2));
  const typeTag = tags.find((t) => TYPE_ES[t]) || "";
  const tipoLine = lines.find((l) => /^\*\*Tipo:\*\*/.test(l)) || "";
  const strategies = plain(tipoLine.match(/Estrategias típicas:\*\*\s*(.+)$/)?.[1] || "");

  // secciones H2
  const sections = [];
  let cur = null;
  for (const l of lines) {
    if (/^## /.test(l)) { cur = { title: plain(l.slice(3)), md: [] }; sections.push(cur); continue; }
    if (cur) cur.md.push(l);
  }
  sections.forEach((s) => { s.md = s.md.join("\n").trim(); });

  // ficha: tabla de "Datos"
  const data = {};
  const datos = sections.find((s) => /^datos$/i.test(s.title));
  for (const l of (datos?.md || "").split("\n")) {
    if (!/^\|/.test(l) || /^\|\s*-/.test(l)) continue;
    const c = cells(l); if (c.length >= 2 && c[0] && c[1]) data[c[0]] = c[1];
  }

  // civs que destacan: tablas con columna "Civs" (primera columna = perfil). Los nombres de civ
  // se detectan contra la lista conocida (team-roles.json), en el orden en que aparecen.
  const highlights = [];
  const civSec = sections.find((s) => /civs que destacan/i.test(s.title));
  let civCol = false;
  for (const l of (civSec?.md || "").split("\n")) {
    if (!/^\|/.test(l)) { civCol = false; continue; }
    if (/^\|\s*-/.test(l)) continue;
    const c = cells(l);
    if (/^civs$/i.test(c[1] || "")) { civCol = true; continue; }
    if (!civCol || c.length < 2) continue;
    const civs = [...c[1].matchAll(CIV_RE)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i);
    if (civs.length) highlights.push({ profile: c[0].replace(/\s*\([^)]*\)\s*$/, ""), civs, negative: /cuesta|sufren|débil|malas/i.test(c[0]) });
  }

  // enlaces
  const links = (re) => [...new Set([...text.matchAll(re)].map((m) => m[1]))];
  const strategyLinks = links(/\[\[strategies\/([^\]|\\]+)/g);
  const mapLinks = links(/\[\[maps\/([^\]|\\]+)/g).map(slugify).filter((s) => !s.startsWith("tipo-"));
  const metaLinks = links(/\[\[meta\/([^\]|\\]+)/g);

  out.push({
    slug: slugify(file.replace(/\.md$/, "")), name, aliases, type: typeTag || null, typeLabel: TYPE_ES[typeTag] || null,
    axis: TYPE_AXIS[typeTag] || null, water: tags.includes("agua"), quote, strategies, data, highlights,
    strategyLinks, mapLinks, metaLinks, note: `maps/${file}`,
    sections: sections.filter((s) => !SKIP.test(s.title) && s.md),
  });
}
out.sort((a, b) => a.name.localeCompare(b.name));

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "map-guides.json"), JSON.stringify(out) + "\n");
const byType = out.reduce((a, m) => ((a[m.type || "?"] = (a[m.type || "?"] || 0) + 1), a), {});
console.log(`map-guides.json: ${out.length} mapas · ${JSON.stringify(byType)} · con civs destacadas ${out.filter((m) => m.highlights.length).length}`);
