// Genera web/data/radar.json a partir de los bloques `## Radar` de las fichas de
// civ del vault. Correr cuando cambien esos bloques:
//   node web/scripts/build-radar.mjs   (usa VAULT_PATH, default D:\Boveda\Aoe)
// El JSON se commitea: el deploy (query-only, sin vault) lo sirve vía /api/civ-radar.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.VAULT_PATH || "D:\\Boveda\\Aoe";
const civDir = join(VAULT, "civs");

const PHASE = ["Dark", "Feudal", "Castle", "Imperial", "Abierto", "Cerrado", "Agua", "Nómada"];
const CATE = ["Infantería", "Caballería", "Arqueros", "Asedio", "Naval", "Monjes", "Defensa", "Pólvora"];

// Mapea filas "| Eje | ~7 | fuente |" -> { eje: 7 } (ignora el ~ de estimado).
function parseTable(section) {
  const map = {};
  for (const line of section.split("\n")) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|\s*~?(\d+)\s*\|/);
    if (m) map[m[1].trim()] = Number(m[2]);
  }
  return map;
}

const out = {};
let incompletas = [];
for (const file of readdirSync(civDir).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(civDir, file), "utf8");
  const radarIdx = text.indexOf("## Radar");
  if (radarIdx < 0) continue;
  const after = text.slice(radarIdx);
  const end = after.indexOf("\n## ", 3); // próximo heading de nivel 2
  const block = end >= 0 ? after.slice(0, end) : after;

  const faseStart = block.indexOf("### Fase y mapa");
  const catStart = block.indexOf("### Categoría");
  const faseSec = block.slice(faseStart, catStart >= 0 ? catStart : undefined);
  const catSec = catStart >= 0 ? block.slice(catStart) : "";

  const pm = parseTable(faseSec);
  const cm = parseTable(catSec);
  const slug = file.replace(/\.md$/, "").toLowerCase();
  const phase = PHASE.map((a) => pm[a]);
  const category = CATE.map((a) => cm[a]);

  if (phase.some((v) => v == null) || category.some((v) => v == null)) {
    incompletas.push(slug);
    continue;
  }
  out[slug] = { phase, category };
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "radar.json"), JSON.stringify(out) + "\n");
console.log(`radar.json: ${Object.keys(out).length} civs`);
if (incompletas.length) console.warn(`incompletas (saltadas): ${incompletas.join(", ")}`);
