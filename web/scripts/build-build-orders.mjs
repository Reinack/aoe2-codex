// Genera web/data/build-orders.json a partir de las notas de estrategia de la wiki pública
// (strategies/*.md con tag `build-order`): extrae las tablas "Población | Acción" /
// "Paso | Acción" bajo cada sección y la ficha (Civs · Mapas · Tipo · Dificultad).
//   node web/scripts/build-build-orders.mjs   (usa AOE_WIKI, default D:\Boveda\AoE-Wiki)
// El JSON se commitea: el deploy (sin vault) lo sirve vía /api/build-orders.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.AOE_WIKI || "D:\\Boveda\\AoE-Wiki";
const dir = join(VAULT, "strategies");

// [[a/b|Alias]] → Alias ; [[a/b]] → b ; \| escapado de tablas → |
const clean = (s) =>
  s
    .replace(/\\\|/g, "|")
    .replace(/\[\[[^\]|]+?\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[(?:[^\]]*\/)?([^\]]+)\]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

// Parte una fila de tabla respetando \| dentro de wikilinks.
function cells(line) {
  const t = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return t.split(/(?<!\\)\|/).map((c) => clean(c));
}

const STEP_HEAD = /^(poblaci[oó]n|paso|pop|acci[oó]n)\b/i;
// Cabecera con tiempo/edad como primera columna también sirve como build.
const out = [];

for (const file of readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "index.md")) {
  const text = readFileSync(join(dir, file), "utf8").replace(/\r\n/g, "\n");
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  if (!/tags:.*build-order/.test(fm) && !/^## Build order/m.test(text)) continue;
  const slug = file.replace(/\.md$/, "");
  const lines = text.split(/\r?\n/);
  const title = clean(lines.find((l) => l.startsWith("# "))?.slice(2) || slug);
  const quote = clean((lines.find((l) => l.startsWith("> ")) || "").slice(2));
  const ficha = lines.find((l) => /^\*\*Civs:\*\*/.test(l)) || "";
  const pick = (k) => clean(ficha.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*([^·]+)`))?.[1] || "");
  const tags = (fm.match(/tags:\s*\[([^\]]*)\]/)?.[1] || "").split(",").map((s) => s.trim()).filter(Boolean);

  let h2 = "", h3 = "";
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^## /.test(l)) { h2 = clean(l.slice(3)); h3 = ""; continue; }
    if (/^### /.test(l)) { h3 = clean(l.slice(4)); continue; }
    if (!/^\|/.test(l)) continue;
    const head = cells(l);
    if (!STEP_HEAD.test(head[0] || "")) continue;
    // tabla: saltar separador y leer filas
    const rows = [];
    let j = i + 2;
    for (; j < lines.length && /^\|/.test(lines[j]); j++) {
      const c = cells(lines[j]);
      if (c.length < 2) continue;
      if (/^acci[oó]n/i.test(head[0])) rows.push({ at: "•", do: c.filter(Boolean).join(" — ") });
      else rows.push({ at: c[0], do: c.slice(1).filter(Boolean).join(" — ") });
    }
    i = j - 1;
    if (!rows.length) continue;
    const underVariants = /variante|variant/i.test(h2);
    const underBuild = /build order|apertura|ejecuci[oó]n/i.test(h2);
    if (!underVariants && !underBuild) continue;
    sections.push({
      title: h3 || h2,
      group: h2,
      variant: underVariants,
      unit: /^paso/i.test(head[0]) ? "step" : /^acci/i.test(head[0]) ? "list" : "pop",
      steps: rows,
    });
  }
  if (!sections.length) continue;
  out.push({
    id: slug,
    title,
    quote,
    civs: pick("Civs"),
    maps: pick("Mapas"),
    type: pick("Tipo"),
    difficulty: pick("Dificultad"),
    tags: tags.filter((t) => t !== "build-order"),
    note: `strategies/${file}`,
    sections,
  });
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "build-orders.json"), JSON.stringify(out) + "\n");
const nSec = out.reduce((a, b) => a + b.sections.length, 0);
const nSteps = out.reduce((a, b) => a + b.sections.reduce((x, s) => x + s.steps.length, 0), 0);
console.log(`build-orders.json: ${out.length} builds, ${nSec} secciones, ${nSteps} pasos`);
for (const b of out) console.log(" -", b.id, b.sections.map((s) => `${s.title}(${s.steps.length})`).join(" | "));
