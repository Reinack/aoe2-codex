// Genera web/data/team-roles.json a partir de las notas de civ de la wiki pública:
// bonus de equipo, sección "## Team games" (posición ideal flanco/pocket, sinergias,
// bonus ajenos que aprovecha) y el texto de la posición.
//   node web/scripts/build-team-roles.mjs   (usa AOE_WIKI, default D:\Boveda\AoE-Wiki)
// El JSON se commitea: el deploy (sin vault) lo sirve vía /api/team.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.AOE_WIKI || "D:\\Boveda\\AoE-Wiki";
const civDir = join(VAULT, "civs");

const clean = (s) =>
  s
    .replace(/\\\|/g, "|")
    .replace(/\[\[[^\]|]+?\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[(?:[^\]]*\/)?([^\]]+)\]\]/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
const slugOf = (name) => name.toLowerCase().replace(/[^a-z]/g, "");
const linksIn = (s) => [...s.matchAll(/\[\[civs\/([^\]|\\]+)/g)].map((m) => slugOf(m[1]));

function section(text, title) {
  const m = text.match(new RegExp(`^## ${title}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"));
  return m ? m[1].trim() : "";
}

const out = {};
for (const file of readdirSync(civDir).filter((f) => f.endsWith(".md") && f !== "index.md")) {
  const text = readFileSync(join(civDir, file), "utf8").replace(/\r\n/g, "\n");
  const slug = slugOf(file.replace(/\.md$/, ""));
  const name = clean(text.match(/^# (.+)$/m)?.[1] || slug);
  const team = section(text, "Team games");
  const bonus = clean(text.match(/\*\*Bonus de equipo:?\*\*:?\s*(.+)/)?.[1] || "");
  const specialty = clean(text.match(/\*\*Especialidad\*\*\s*\|\s*([^|]+)/)?.[1] || "");

  // posición: busca "pocket"/"flanco" en la sección Team games, en la frase de "posición".
  const posLine = team.split(/\n/).find((l) => /posici[oó]n/i.test(l)) || team;
  const blob = (posLine + " " + team).toLowerCase();
  const posText = clean(posLine);
  let position = "flex";
  const mp = /pocket/.test(posLine.toLowerCase()), mf = /flanc|flank/.test(posLine.toLowerCase());
  if (mp && !mf) position = "pocket";
  else if (mf && !mp) position = "flank";
  else if (mp && mf) {
    // ambas mencionadas: gana la que aparece primero en "mejor/ideal posición"
    const ideal = posLine.toLowerCase().match(/(mejor|ideal|preferid)[^.]*?(pocket|flanc|flank)/);
    position = ideal ? (/pocket/.test(ideal[2]) ? "pocket" : "flank") : "flex";
  } else if (/pocket/.test(blob) && !/flanc|flank/.test(blob)) position = "pocket";
  else if (/flanc|flank/.test(blob) && !/pocket/.test(blob)) position = "flank";

  const syn = team.split(/\n/).find((l) => /sinergias/i.test(l)) || "";
  const foreign = team.split(/\n/).find((l) => /ajenos/i.test(l)) || "";
  out[slug] = {
    name,
    specialty,
    position,
    positionNote: posText,
    teamBonus: bonus,
    synergies: [...new Set(linksIn(syn))],
    usesFrom: [...new Set(linksIn(foreign))],
    foreignNote: clean(foreign),
    notes: team
      .split(/\n/)
      .filter((l) => /^[-*] /.test(l) && !/sinergias destacadas|ajenos/i.test(l))
      .map((l) => clean(l.replace(/^[-*]\s*/, "")))
      .slice(0, 5),
    hasTeamSection: !!team,
  };
}

mkdirSync(join(__dirname, "..", "data"), { recursive: true });
writeFileSync(join(__dirname, "..", "data", "team-roles.json"), JSON.stringify(out) + "\n");
const v = Object.values(out);
const c = (p) => v.filter((x) => x.position === p).length;
console.log(`team-roles.json: ${v.length} civs · flank ${c("flank")} · pocket ${c("pocket")} · flex ${c("flex")} · con sección ${v.filter((x) => x.hasTeamSection).length} · con bonus ${v.filter((x) => x.teamBonus).length}`);
