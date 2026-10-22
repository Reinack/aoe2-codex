// Genera web/data/documented-matchups.json a partir de las notas de matchups de la
// wiki pública (matchups/CivA-vs-CivB.md): cada nota sintetiza las partidas
// analizadas de ese par, con una sección "## Claves para <Civ>" por lado. El
// Matchup Lab cruza esto por civ rival para reemplazar la búsqueda léxica genérica
// de "notas que mencionan a ambas" por contenido curado cuando existe.
//   node web/scripts/build-documented-matchups.mjs   (usa AOE_WIKI, default D:\Boveda\AoE-Wiki)
// El JSON se commitea: el deploy (query-only, sin wiki) lo sirve vía /api/matchup.
// Las notas públicas no nombran jugadores, así que el JSON tampoco.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI = process.env.AOE_WIKI || "D:\\Boveda\\AoE-Wiki";
const matchupDir = join(WIKI, "matchups");

// Texto plano para la UI: sin negritas y con los wikilinks reducidos a su alias.
function plain(s) {
  return s
    .replace(/\[\[[^\]|]+?\\?\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[(?:[^\]]*\/)?([^\]]+)\]\]/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .trim();
}

// Bloque de una sección "## Título" hasta la próxima "## ".
function section(text, title) {
  const re = new RegExp(`^## ${title}\\s*$`, "im");
  const m = re.exec(text);
  if (!m) return null;
  const after = text.slice(m.index + m[0].length);
  const end = after.search(/^## /m);
  return end >= 0 ? after.slice(0, end) : after;
}

const bullets = (block) =>
  (block || "")
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => plain(l.trim().slice(2)));

// "**Favorable para:** Franks · **Mapas:** [[maps/Arabia|Arabia]] · **Partidas analizadas:** 1"
function field(text, name) {
  const m = text.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*([^·\\n]+)`));
  return m ? plain(m[1]) : null;
}

const out = {};
let pares = 0;
const sinClaves = [];

for (const file of readdirSync(matchupDir).filter((f) => /-vs-/.test(f) && f.endsWith(".md"))) {
  const text = readFileSync(join(matchupDir, file), "utf8").replace(/\r\n/g, "\n");
  const matchupFile = file.replace(/\.md$/, "");
  const [a, b] = matchupFile.split("-vs-");
  if (a === b) continue; // los espejos no aportan a un cruce entre civs distintas

  const resumen = text.match(/^>\s*(.+)$/m)?.[1];
  const favorable = field(text, "Favorable para");
  const mapas = field(text, "Mapas");
  const partidas = field(text, "Partidas analizadas");
  const heading = [mapas, favorable && `Favorable para: ${favorable}`, partidas && `${partidas} partida(s) analizada(s)`]
    .filter(Boolean)
    .join(" · ");

  pares++;
  for (const [own, opp] of [[a, b], [b, a]]) {
    const claves = bullets(section(text, `Claves para ${own}`));
    if (!claves.length) {
      sinClaves.push(`${matchupFile} (${own})`);
      continue;
    }
    const slug = own.toLowerCase();
    (out[slug] ||= []).push({
      heading: `vs ${opp}${heading ? ` — ${heading}` : ""}`,
      matchupFile,
      opponent: opp.toLowerCase(),
      bullets: claves,
      recordar: resumen ? plain(resumen) : null,
    });
  }
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "documented-matchups.json"), JSON.stringify(out) + "\n");
const total = Object.values(out).reduce((n, arr) => n + arr.length, 0);
console.log(`documented-matchups.json: ${pares} pares, ${Object.keys(out).length} civs, ${total} entradas`);
if (sinClaves.length) console.warn(`sin "Claves para": ${sinClaves.join(", ")}`);
