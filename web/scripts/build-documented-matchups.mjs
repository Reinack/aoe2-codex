// Genera web/data/documented-matchups.json a partir del bloque `## En Matchups
// Documentados` de las fichas de civ del vault: cada entrada cita un matchup
// real (o teórico) de matchups/*.md con su propia síntesis táctica desde la
// perspectiva de ESA civ. El Matchup Lab cruza esto por civ rival para
// reemplazar la búsqueda léxica genérica de "notas que mencionan a ambas" por
// contenido curado cuando existe.
//   node web/scripts/build-documented-matchups.mjs   (usa VAULT_PATH, default D:\Boveda\Aoe)
// El JSON se commitea: el deploy (query-only, sin vault) lo sirve vía /api/matchup.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.VAULT_PATH || "D:\\Boveda\\Aoe";
const civDir = join(VAULT, "civs");

function stripBold(s) {
  return s.replace(/\*\*(.+?)\*\*/g, "$1").trim();
}

// Variantes de nombre pre-existentes en matchups/*.md (residuo conocido del
// vault, ver pendientes.md) que no coinciden con el slug real de la ficha de civ.
const FILE_ALIAS = { bengali: "bengalis", tupis: "tupi", mayas: "mayans" };
const normSlug = (s) => FILE_ALIAS[s] || s;

// "Armenians-vs-Berbers" + civ propia "berbers" -> "armenians" (el otro lado).
// Partidos espejo (A-vs-A) devuelven la propia civ (se descartan al indexar).
function opponentFromFile(matchupFile, ownSlug) {
  const m = matchupFile.match(/^(.+?)-vs-(.+)$/i);
  if (!m) return null;
  const [, a, b] = m;
  const aSlug = normSlug(a.toLowerCase());
  const bSlug = normSlug(b.toLowerCase());
  if (aSlug === ownSlug) return bSlug;
  if (bSlug === ownSlug) return aSlug;
  return null; // ninguno de los dos lados coincide con la civ propia (no debería pasar)
}

const out = {};
let sinSeccion = [];

for (const file of readdirSync(civDir).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(civDir, file), "utf8").replace(/\r\n/g, "\n");
  const slug = file.replace(/\.md$/, "").toLowerCase();

  const idx = text.indexOf("## En Matchups Documentados");
  if (idx < 0) {
    sinSeccion.push(slug);
    continue;
  }
  const after = text.slice(idx);
  const end = after.indexOf("\n## ", 3);
  const block = end >= 0 ? after.slice(0, end) : after;

  const entries = [];
  const subBlocks = block.split(/\n(?=### )/).slice(1); // descarta el heading "## En..." inicial
  for (const sub of subBlocks) {
    const lines = sub.split("\n");
    const heading = lines[0].replace(/^###\s*/, "").trim();

    const linkLine = lines.find((l) => l.includes("[[matchups/"));
    const linkMatch = linkLine?.match(/\[\[matchups\/([^\]|]+)/);
    const matchupFile = linkMatch ? linkMatch[1].trim() : null;

    const bulletLines = lines
      .filter((l) => l.trim().startsWith("- "))
      .map((l) => stripBold(l.trim().slice(2).trim()));

    let recordar = null;
    const bullets = [];
    for (const b of bulletLines) {
      if (!recordar && /^Recordar:\s*/i.test(b)) {
        recordar = b.replace(/^Recordar:\s*/i, "").trim();
      } else {
        bullets.push(b);
      }
    }

    if (!matchupFile && !bullets.length) continue; // bloque vacío/ruido
    const opponent = matchupFile ? opponentFromFile(matchupFile, slug) : null;

    entries.push({ heading, matchupFile, opponent, bullets, recordar });
  }

  if (entries.length) out[slug] = entries;
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "documented-matchups.json"), JSON.stringify(out) + "\n");
const total = Object.values(out).reduce((n, arr) => n + arr.length, 0);
console.log(`documented-matchups.json: ${Object.keys(out).length} civs, ${total} entradas`);
if (sinSeccion.length) console.warn(`sin sección "En Matchups Documentados": ${sinSeccion.join(", ")}`);
