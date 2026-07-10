// Genera web/data/phosphor.json a partir de la tier list de FC/Phosphor Rush de
// Red Fosforu (strategies/fc-tier-list-redfosforu.md). Da, por civ, qué tan
// buena es para un Phosphor Rush (Fast Castle all-in en Arabia).
//   node web/scripts/build-phosphor.mjs   (usa VAULT_PATH, default D:\Boveda\Aoe)
// El JSON se commitea: el deploy (query-only, sin vault) lo sirve vía el matchup.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.VAULT_PATH || "D:\\Boveda\\Aoe";
const SRC = join(VAULT, "strategies", "fc-tier-list-redfosforu.md");

const text = readFileSync(SRC, "utf8");

// Limpia "(mid S)", "⭐", "→ …" y espacios de un nombre de UU.
function cleanUU(s) {
  return s
    .split("(")[0]
    .split("⭐")[0]
    .replace(/\s+/g, " ")
    .trim();
}

// Resuelve un nombre de civ que puede venir como wikilink "[[civs/Armenians]]"
// o "[[civs/Armenians|Alias]]" (post barrido de wikilinks) o como texto plano.
function cleanCivName(s) {
  const m = s.trim().match(/^\[\[civs\/([^\]|]+)(?:\|([^\]]+))?\]\]$/i);
  return (m ? m[2] || m[1] : s).trim();
}

const out = {};
let tier = null;

for (const raw of text.split("\n")) {
  const line = raw.trim();

  // Cambio de sección de tier: "### S tier"
  const sec = line.match(/^###\s+([SABCD])\s+tier/i);
  if (sec) {
    tier = sec[1].toUpperCase();
    continue;
  }
  if (!tier) continue;

  // Entrada S/A como heading: "#### Armenians — Church Rush ⭐⭐ (...)"
  const head = line.match(/^####\s+(.+?)\s*[—-]\s*(.+)$/);
  if (head) {
    const name = cleanCivName(head[1]);
    out[name.toLowerCase()] = { tier, uu: cleanUU(head[2]) || null };
    continue;
  }

  // Entrada B/C/D como fila de tabla: "| **Tatars** (top B) | Keshik | razón |"
  const row = line.match(/^\|\s*\*\*([^*]+)\*\*\s*(?:\([^)]*\))?\s*\|([^|]*)\|/);
  if (row) {
    const name = cleanCivName(row[1]);
    const col2 = row[2].trim();
    // En D tier la 2.ª columna es "Razón", no la UU → no la usamos como UU.
    out[name.toLowerCase()] = { tier, uu: tier === "D" ? null : cleanUU(col2) || null };
  }
}

// Ajustes post-parche 169123 (nerf de Siege Tower) que la nota describe en prosa.
const OVERRIDES = {
  koreans: { tier: "A" },   // Red predijo A tras el nerf
  jurchens: { tier: "A" },  // idem
  dravidians: { tier: "B" }, // "baja al menos un tier"
};
for (const [slug, patch] of Object.entries(OVERRIDES)) {
  if (out[slug]) Object.assign(out[slug], patch);
}

// Britons: el único FC que NO empuja (escala en defensa). Se marca aparte para
// que la alerta no lo lea como un all-in ofensivo.
if (out.britons) out.britons.defensive = true;

// Categoría de empuje según tier (para la alerta del Matchup Lab).
const STRENGTH = { S: "fuerte", A: "fuerte", B: "viable", C: "débil", D: "débil" };
for (const v of Object.values(out)) {
  v.strength = v.defensive ? "defensivo" : STRENGTH[v.tier];
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "phosphor.json"), JSON.stringify(out) + "\n");
console.log(`phosphor.json: ${Object.keys(out).length} civs`);
const byTier = {};
for (const v of Object.values(out)) byTier[v.tier] = (byTier[v.tier] || 0) + 1;
console.log("por tier:", byTier);
