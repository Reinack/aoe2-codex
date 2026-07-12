// Genera web/data/counter-play.json a partir del bloque `## Cómo jugar CONTRA
// {Civ}` de las fichas de civ del vault: bullets ya invertidos (mecánica propia
// de la civ → consejo de counter-play para el rival). El Matchup Lab los usa
// para mostrar "Cómo ganarle a {vs}" del lado del rival.
//   node web/scripts/build-counter-play.mjs   (usa VAULT_PATH, default D:\Boveda\Aoe)
// El JSON se commitea: el deploy (query-only, sin vault) lo sirve vía /api/matchup.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.VAULT_PATH || "D:\\Boveda\\Aoe";
const civDir = join(VAULT, "civs");

// Quita el markdown de énfasis (**negrita**) para que el bullet se pueda
// mostrar como texto plano (los componentes de la UI no renderizan markdown).
function stripBold(s) {
  return s.replace(/\*\*(.+?)\*\*/g, "$1").trim();
}

const out = {};
let sinSeccion = [];

for (const file of readdirSync(civDir).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(civDir, file), "utf8").replace(/\r\n/g, "\n");
  const slug = file.replace(/\.md$/, "").toLowerCase();

  const idx = text.indexOf("## Cómo jugar CONTRA");
  if (idx < 0) {
    sinSeccion.push(slug);
    continue;
  }
  const after = text.slice(idx);
  const end = after.indexOf("\n## ", 3);
  const block = end >= 0 ? after.slice(0, end) : after;

  const bullets = block
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => stripBold(l.trim().slice(2).trim()))
    .filter(Boolean);

  if (bullets.length) out[slug] = bullets;
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "counter-play.json"), JSON.stringify(out) + "\n");
console.log(`counter-play.json: ${Object.keys(out).length} civs`);
if (sinSeccion.length) console.warn(`sin sección "Cómo jugar CONTRA": ${sinSeccion.join(", ")}`);
