// Genera web/data/civ-combat.json: bonos de civ (y de equipo) que afectan al combate,
// traducidos a los ids del roster del simulador (lib/sim.mjs). Fuente: los `stat_modifier`
// de cada civ del árbol (public/tree/src/data/civ/*.js, vía loadTree().CIVS).
//   node web/scripts/build-civ-combat.mjs
// Los descuentos de costo ya están en civ-mods.json (build-civ-mods.mjs).
// Lo que no se traduce (eco, edificios, naval, monjes, UU, techs únicas) queda contado en
// `_ignored` para poder ampliarlo sin tocar el motor.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");
process.env.TREE_DATA_DIR = process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");
const { loadTree } = await import("../techtree/load.mjs");
const { ROSTER } = await import("../lib/sim.mjs");
const t = await loadTree();

const ALL = ROSTER.map((r) => r.id);
const MOUNTED = ["scout", "lightcav", "hussar", "knight", "cavalier", "paladin", "camel", "heavycamel",
  "battleeleph", "eliteeleph", "cavarcher", "hcavarcher"];
const SCOPE = {
  cavalry: MOUNTED,
  mounted: MOUNTED,
  knight: ["knight", "cavalier", "paladin"],
  light_cavalry: ["scout", "lightcav", "hussar"],
  camel: ["camel", "heavycamel"],
  battle_elephant: ["battleeleph", "eliteeleph"],
  battleeleph: ["battleeleph", "eliteeleph"],
  elephant: ["battleeleph", "eliteeleph"],
  cavalry_archer: ["cavarcher", "hcavarcher"],
  cavarcher: ["cavarcher", "hcavarcher"],
  infantry: ["militia", "manatarms", "longsword", "twohanded", "champion", "spearman", "pikeman", "halberdier",
    "eaglescout", "eaglewarrior", "eliteeagle"],
  spearman: ["spearman", "pikeman", "halberdier"],
  skirmisher: ["skirmisher", "eliteskirm"],
  foot_archer: ["archer", "crossbow", "arbalester", "skirmisher", "eliteskirm"],
  foot_archer_no_skirm: ["archer", "crossbow", "arbalester"],
  gunpowder: ["handcannon", "bombcannon"],
  siege: ["mangonel", "onager", "siegeonager", "scorpion", "heavyscorpion", "bombcannon"],
  scorpion: ["scorpion", "heavyscorpion"],
  soldier: ALL,
  unit: ALL,
};
// attack_vs_<x> → clase de armadura del defensor (nombres de data/unit-classes.json)
const VS_CLASS = { skirmisher: "Skirmishers", archers: "Archers", foot_archer: "Archers", siege: "Siege Weapons", infantry: "Infantry" };
const STATS = new Set(["hp", "attack", "rof", "speed", "range", "armor_melee", "armor_pierce", "armor_melee_and_pierce",
  "bonus_damage", "bonus_damage_reduction"]);

const ignored = {};
const note = (k) => (ignored[k] = (ignored[k] || 0) + 1);

function convert(b, team) {
  const stat = b.stat;
  const ids = SCOPE[b.scope];
  if (!ids) return note(`scope:${b.scope}`), null;
  const mod = { ids, stat, op: b.op, team: !!team, scope: b.scope };
  const m = /^attack_vs_(.+)$|^bonus_vs_(.+)$/.exec(stat || "");
  if (m) {
    const cls = VS_CLASS[m[1] || m[2]];
    if (!cls) return note(`vs:${m[1] || m[2]}`), null;
    mod.stat = "attack_vs"; mod.vsClass = cls;
  } else if (!STATS.has(stat)) {
    return note(`stat:${stat}`), null;
  }
  if (b.value_by_age) mod.byAge = b.value_by_age; else mod.value = b.value;
  mod.minAge = b.min_age ?? 0;
  if (mod.value === undefined && !mod.byAge) return note("sin-valor"), null;
  return mod;
}

const out = {};
for (const [slug, civ] of Object.entries(t.CIVS)) {
  const mods = [];
  for (const b of civ.bonuses || []) {
    if (b.type !== "stat_modifier") continue;
    const c = convert(b, false); if (c) mods.push(c);
  }
  let team = null;
  if (civ.teamBonus?.type === "stat_modifier") team = convert(civ.teamBonus, true);
  out[slug] = { mods, team };
}
out._ignored = ignored;

mkdirSync(join(WEB, "data"), { recursive: true });
writeFileSync(join(WEB, "data", "civ-combat.json"), JSON.stringify(out) + "\n");
const civs = Object.entries(out).filter(([k]) => !k.startsWith("_"));
console.log(`civ-combat.json: ${civs.length} civs · ${civs.reduce((a, [, v]) => a + v.mods.length, 0)} bonos · ${civs.filter(([, v]) => v.team).length} de equipo`);
console.log("ignorados:", Object.entries(ignored).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k}×${v}`).join(" "));
