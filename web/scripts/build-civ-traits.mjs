// Genera web/data/civ-traits.json a partir de las notas de civ del vault: extrae
// las líneas "**Fortalezas:**" y "**Debilidades:**" (que ya nombran explícitamente
// las unidades que la civ NO tiene). El matchup las usa en las "Notas tácticas".
//   node web/scripts/build-civ-traits.mjs   (usa VAULT_PATH, default D:\Boveda\Aoe)
// El JSON se commitea: el deploy (query-only, sin vault) lo sirve vía el matchup.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.VAULT_PATH || "D:\\Boveda\\Aoe";
const civDir = join(VAULT, "civs");

const FORT_RE = /\*\*Fortalezas:\*\*\s*(.+)/;
const DEB_RE = /\*\*Debilidades:\*\*\s*(.+)/;

// Parte una línea de prosa en ítems por ; o · (conserva comas internas).
function toItems(s) {
  if (!s) return [];
  return s
    .replace(/\s{2,}$/, "") // line-break markdown (dos espacios finales)
    .split(/\s*[;·]\s*/)
    .map((x) => x.trim())
    .filter(Boolean);
}

const out = {};
let conTraits = 0;
const sinTraits = [];

for (const file of readdirSync(civDir).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(civDir, file), "utf8");
  const slug = file.replace(/\.md$/, "").toLowerCase();
  const fort = text.match(FORT_RE)?.[1]?.trim() || "";
  const deb = text.match(DEB_RE)?.[1]?.trim() || "";
  out[slug] = { strengths: toItems(fort), weaknesses: toItems(deb) };
  if (fort || deb) conTraits++;
  else sinTraits.push(slug);
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "civ-traits.json"), JSON.stringify(out) + "\n");
console.log(`civ-traits.json: ${Object.keys(out).length} civs (${conTraits} con traits)`);
if (sinTraits.length) console.warn(`sin Fortalezas/Debilidades: ${sinTraits.join(", ")}`);
