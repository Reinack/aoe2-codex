// Genera web/data/unit-classes.json a partir de las notas de unidades de la wiki
// pública: por unidad, sus clases de armadura, sus bonus de ataque, el HP y las
// frases "Fuerte contra / Débil contra". El grafo de counters lo usa para inferir
// los counters de las unidades únicas (que no tienen edges curados en el YAML):
// descripción + clase de armadura × bonus de ataque + tipo (línea genérica).
//   node web/scripts/build-unit-classes.mjs   (usa AOE_WIKI, default D:\Boveda\AoE-Wiki)
// El JSON se commitea: el deploy (query-only, sin vault) lo lee al arrancar.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.AOE_WIKI || "D:\\Boveda\\AoE-Wiki";
const unitsDir = join(VAULT, "units");

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : f.endsWith(".md") ? [p] : [];
  });
}

// Cuerpo de una sección "## Título" hasta la próxima "## ".
function section(text, title) {
  const m = text.match(new RegExp(`^## ${title}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"));
  return m ? m[1] : "";
}

// Tabla markdown de dos columnas → { col1: número }. Saltea encabezado y separador.
function numTable(body) {
  const out = {};
  for (const line of body.split("\n")) {
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 2 || /^-+$/.test(cells[0]) || /^(Clase|Contra)$/i.test(cells[0])) continue;
    const n = cells[1].match(/[-+]?\d+(?:[.,]\d+)?/);
    if (n) out[cells[0]] = Number(n[0].replace(",", "."));
  }
  return out;
}

const unlink = (s) =>
  s
    .replace(/\[\[[^\]|]+?\\?\|([^\]]+)\]\]/g, "$1") // wikilink con alias → alias
    .replace(/\[\[(?:[^\]]*\/)?([^\]]+)\]\]/g, "$1")
    .replace(/\*\*/g, "")
    .trim();

// "**Fuerte contra:** …" de la sección Counters: el resto de la línea o, si está
// vacío, la lista de viñetas que sigue (de cada una, el título en negrita).
function counterLine(body, label) {
  const lines = body.split("\n");
  const i = lines.findIndex((l) => new RegExp(`^\\*\\*${label} contra:\\*\\*`, "i").test(l));
  if (i < 0) return "";
  const rest = lines[i].replace(/^\*\*[^*]+\*\*\s*/, "").trim();
  if (rest) return rest.replace(/\.$/, "");
  const items = [];
  for (const l of lines.slice(i + 1)) {
    if (!/^\s*-\s/.test(l)) break;
    items.push((l.match(/^\s*-\s*\*\*([^*]+?):?\*\*/) || [])[1] || l.replace(/^\s*-\s*/, ""));
  }
  return items.join(", ");
}

// "Fuerte contra … / Débil contra …": primero la sección Counters, si no la intro.
function strongWeak(text) {
  const counters = section(text, "Counters");
  const intro = (text.match(/^> (.+)$/m) || [])[1] || "";
  let strong = counterLine(counters, "Fuerte");
  let weak = counterLine(counters, "D[eé]bil");
  if (!strong) strong = intro.match(/Fuerte contra\s+([^;\n]+?)(?:[.;]\s|[.;]?$|\s*d[eé]bil)/i)?.[1] || "";
  if (!weak) weak = intro.match(/D[eé]bil contra\s+([^\n]+?)(?:\.\s|\.?$)/i)?.[1] || "";
  const same = counters.match(/Los mismos que (?:el |la |los )?\[\[(?:[^\]|]*\/)?([^\]|]+)/i)?.[1];
  return {
    strong: strong ? unlink(strong) : "",
    weak: weak ? unlink(weak) : "",
    sameAs: same ? same.toLowerCase() : "",
  };
}

const out = {};
for (const file of walk(unitsDir)) {
  const text = readFileSync(file, "utf8");
  const classes = numTable(section(text, "Clases de armadura"));
  if (!Object.keys(classes).length) continue; // overviews / comparativas
  const rel = relative(VAULT, file).replace(/\\/g, "/");
  const slug = basename(file, ".md").toLowerCase();
  const tags = (text.match(/^tags:\s*\[([^\]]*)\]/m) || [])[1] || "";
  const kind = rel.startsWith("units/unique/") ? "unique" : /\bregional\b/.test(tags) ? "regional" : "generic";
  const hp = Number((text.match(/\|\s*\*\*HP\*\*\s*\|\s*(\d+)/) || [])[1]) || null;
  const age = (tags.match(/\b(dark|feudal|castle|imperial)-age\b/) || [])[1] || null;
  // Cadena de mejora: todas las notas enlazadas (la propia va en negrita, sin link).
  const chain = [...section(text, "Cadena de mejora").matchAll(/\[\[(?:[^\]|]*\/)?([^\]|]+)/g)]
    .map((m) => m[1].toLowerCase());
  out[slug] = {
    title: (text.match(/^# (.+)$/m) || [])[1]?.trim() || slug,
    path: rel,
    kind,
    age,
    hp,
    classes,
    bonus: numTable(section(text, "Bonus de ataque")),
    ...strongWeak(text),
    chain,
  };
}

const dest = join(__dirname, "..", "data", "unit-classes.json");
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(out, null, 0) + "\n");
const byKind = Object.values(out).reduce((a, u) => ((a[u.kind] = (a[u.kind] || 0) + 1), a), {});
const sinDesc = Object.entries(out).filter(([, u]) => u.kind === "unique" && !u.weak && !u.sameAs).map(([s]) => s);
console.log(`[OK] ${Object.keys(out).length} unidades → ${relative(process.cwd(), dest)}`, byKind);
if (sinDesc.length) console.log(`  Únicas sin "Débil contra": ${sinDesc.join(", ")}`);
