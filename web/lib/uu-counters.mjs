// Counters inferidos para unidades únicas, que no tienen edges curados en el YAML
// del vault. Se suman tres evidencias por cada línea genérica:
//   1. Descripción: "Débil contra / Fuerte contra" de la ficha (en español). Sola
//      ya alcanza para Sólido; con bonus o tipo a favor llega a Primario.
//   2. Clase de armadura × bonus de ataque: Σ max(0, bonus[c] − armadura[c]) sobre
//      las clases del defensor (p. ej. Halberdier +32 vs Cavalry → Mangudai).
//   3. Tipo: la línea genérica a la que se parece (por sus clases) y sus counters
//      curados; el Mangudai hereda los del Cavalry Archer.
// Funciones puras: los datos vienen de web/data/unit-classes.json y del grafo.

// Línea genérica → ficha de su última mejora (la que pelea en late game).
export const LINE_NOTE = {
  "archer-line": "arbalester",
  "skirmisher-line": "elite-skirmisher",
  "hand-cannoneer": "hand-cannoneer",
  "cavalry-archer": "heavy-cavalry-archer",
  "elephant-archer": "elite-elephant-archer",
  "militia-line": "champion",
  "spearman-line": "halberdier",
  "eagle-warrior": "elite-eagle-warrior",
  "scout-line": "hussar",
  "knight-line": "paladin",
  "camel-line": "heavy-camel-rider",
  "battle-elephant": "elite-battle-elephant",
  "steppe-lancer": "elite-steppe-lancer",
  "ram-line": "siege-ram",
  "mangonel-line": "onager",
  "scorpion-line": "heavy-scorpion",
  "bombard-cannon": "bombard-cannon",
  "monk": "monk",
};

// Frases de la descripción → líneas. Claves sin tildes; las compuestas van antes
// que sus partes y se consumen al matchear ("arqueros a caballo" no dispara "arquer").
const DESC_TO_LINES = [
  ["arqueros a caballo", ["cavalry-archer"]], ["arquero a caballo", ["cavalry-archer"]],
  ["cavalry archer", ["cavalry-archer"]],
  ["camel", ["camel-line"]], ["camell", ["camel-line"]],
  ["skirmisher", ["skirmisher-line"]], ["hostigador", ["skirmisher-line"]],
  ["lancero", ["spearman-line"]], ["spearman", ["spearman-line"]], ["piquer", ["spearman-line"]],
  ["pikem", ["spearman-line"]], ["alabarder", ["spearman-line"]], ["halberd", ["spearman-line"]],
  ["monje", ["monk"]], ["monk", ["monk"]],
  ["caballeria ligera", ["scout-line"]], ["scout", ["scout-line"]], ["hussar", ["scout-line"]], ["husar", ["scout-line"]],
  ["caballeria pesada", ["knight-line"]], ["knight", ["knight-line"]], ["caballero", ["knight-line"]],
  ["cavalier", ["knight-line"]], ["paladin", ["knight-line"]],
  ["caballeria", ["knight-line", "scout-line"]], ["cavalry", ["knight-line", "scout-line"]],
  ["elefante", ["battle-elephant"]], ["elephant", ["battle-elephant"]],
  ["hand cannon", ["hand-cannoneer"]], ["polvora", ["hand-cannoneer"]], ["canoner", ["hand-cannoneer"]],
  ["gunpowder", ["hand-cannoneer"]],
  ["corta distancia", []], // "unidades a corta distancia": no es "a distancia"
  ["a distancia", ["archer-line", "cavalry-archer", "hand-cannoneer"]],
  ["arquer", ["archer-line"]], ["archer", ["archer-line"]],
  ["eagle", ["eagle-warrior"]], ["aguila", ["eagle-warrior"]],
  ["militia", ["militia-line"]], ["milicia", ["militia-line"]], ["champion", ["militia-line"]], ["campeon", ["militia-line"]],
  ["infanteria", ["militia-line", "spearman-line"]], ["infantry", ["militia-line", "spearman-line"]],
  ["mangonel", ["mangonel-line"]], ["onager", ["mangonel-line"]],
  ["escorpion", ["scorpion-line"]], ["scorpion", ["scorpion-line"]],
  ["ariete", ["ram-line"]], ["bombard", ["bombard-cannon"]],
  ["asedio", ["mangonel-line", "scorpion-line", "ram-line", "bombard-cannon"]],
  ["siege", ["mangonel-line", "scorpion-line", "ram-line", "bombard-cannon"]],
];

const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function descToLines(phrase) {
  let p = fold(phrase || "");
  const out = [];
  for (const [kw, lines] of DESC_TO_LINES) {
    if (!p.includes(kw)) continue;
    p = p.split(kw).join(" ");
    for (const l of lines) if (!out.includes(l)) out.push(l);
  }
  return out;
}

// La línea genérica a la que se parece una unidad, por sus clases de armadura.
export function typeLine(profile) {
  const has = (c) => c in (profile?.classes || {});
  if (has("Camel Units")) return "camel-line";
  if (has("Cavalry Archers")) return "cavalry-archer";
  if (has("Elephant Units")) return has("Archers") ? "elephant-archer" : "battle-elephant";
  if (has("Gunpowder Units") && has("Archers")) return "hand-cannoneer";
  if (has("Skirmishers")) return "skirmisher-line";
  if (has("Archers")) return "archer-line";
  if (has("Spearmen")) return "spearman-line";
  if (has("Shock Infantry")) return "eagle-warrior";
  if (has("Infantry")) return "militia-line";
  if (has("Cavalry")) return "knight-line";
  if (has("Monks")) return "monk";
  if (has("Rams")) return "ram-line";
  if (has("Siege Weapons")) return "mangonel-line";
  return null;
}

// Ficha de una unidad única fusionando su cadena (base + Elite): clases y bonus
// con el máximo de la cadena (lo que pelea en late game), la descripción de la
// primera ficha que la tenga y la edad más temprana.
export function unitProfile(db, name) {
  const key = fold(name || "").trim();
  const slug = Object.keys(db).find((s) => fold(db[s].title) === key) ||
    (db[key.replace(/\s+/g, "-")] ? key.replace(/\s+/g, "-") : null);
  if (!slug) return null;
  const seen = new Set();
  const queue = [slug];
  const notes = [];
  while (queue.length) {
    const s = queue.shift();
    if (seen.has(s) || !db[s]) continue;
    seen.add(s);
    notes.push(db[s]);
    queue.push(...(db[s].chain || []), ...(db[s].sameAs ? [db[s].sameAs] : []));
  }
  const maxMerge = (field) => {
    const out = {};
    for (const n of notes) for (const [c, v] of Object.entries(n[field] || {})) out[c] = Math.max(out[c] ?? -Infinity, v);
    return out;
  };
  const AGE = ["dark", "feudal", "castle", "imperial"];
  const ages = notes.map((n) => AGE.indexOf(n.age)).filter((i) => i >= 0);
  return {
    title: db[slug].title,
    classes: maxMerge("classes"),
    bonus: maxMerge("bonus"),
    hp: Math.max(...notes.map((n) => n.hp || 0)) || null,
    strong: notes.find((n) => n.strong)?.strong || "",
    weak: notes.find((n) => n.weak)?.weak || "",
    age: ages.length ? AGE[Math.min(...ages)] : null,
  };
}

// Bonus que `att` le aplica a `def` por clase de armadura, con el detalle.
export function classBonus(att, def) {
  let total = 0;
  const parts = [];
  for (const [c, armor] of Object.entries(def?.classes || {})) {
    const b = att?.bonus?.[c];
    if (!b) continue;
    const eff = Math.max(0, b - armor);
    if (eff <= 0) continue;
    total += eff;
    parts.push(armor > 0 ? `+${eff} vs ${c} (${b} − ${armor} de armadura)` : `+${eff} vs ${c}`);
  }
  return { total, parts };
}

const bonusScore = (b) => (b >= 20 ? 0.5 : b >= 10 ? 0.4 : b >= 4 ? 0.3 : 0);
export const tierOf = (w) => (w >= 0.9 ? "PRIMARIO" : w >= 0.65 ? "SÓLIDO" : "SITUACIONAL");
const round2 = (x) => Math.round(x * 100) / 100;

/**
 * @param profile  ficha de la única (unitProfile)
 * @param lines    [{ id, label, profile }] líneas genéricas con su ficha
 * @param curated  { parent, parentLabel, incoming: {lineId: peso}, outgoing: {lineId: peso} }
 *                 counters curados de la línea a la que se parece (tipo)
 * @returns { counters, beats }: [{ id, weight, tier, reasons[] }] ordenados por peso
 */
export function inferUniqueCounters(profile, lines, curated = {}) {
  const weak = new Set(descToLines(profile.weak));
  const strong = new Set(descToLines(profile.strong));
  const parentLabel = curated.parentLabel || curated.parent;
  const counters = [];
  const beats = [];
  for (const line of lines) {
    if (!line.profile) continue;
    const vsMe = classBonus(line.profile, profile);   // la línea me pega
    const vsIt = classBonus(profile, line.profile);   // yo le pego a la línea
    const directCounter = weak.has(line.id) || bonusScore(vsMe.total) > 0;
    const directBeats = strong.has(line.id) || bonusScore(vsIt.total) > 0;

    const build = (descHit, descText, bonus, inherited, inheritOk) => {
      let w = 0;
      const reasons = [];
      if (descHit) { w += 0.65; reasons.push(`Ficha: ${descText}`); }
      if (bonusScore(bonus.total)) { w += bonusScore(bonus.total); reasons.push(bonus.parts.join(", ")); }
      // El tipo solo suma si no hay evidencia directa en contra (el Huskarl es
      // infantería, pero le gana a los arqueros: no hereda "Archer > Militia").
      if (inherited && inheritOk) { w += inherited * 0.5; reasons.push(`Como ${parentLabel}: ${tierOf(inherited).toLowerCase()}`); }
      w = round2(Math.min(1, w));
      return w >= 0.4 ? { id: line.id, weight: w, tier: tierOf(w), reasons } : null;
    };
    const c = build(weak.has(line.id), `débil contra ${profile.weak}`, vsMe,
      curated.incoming?.[line.id], !directBeats);
    const b = build(strong.has(line.id), `fuerte contra ${profile.strong}`, vsIt,
      curated.outgoing?.[line.id], !directCounter);
    if (c) counters.push(c);
    if (b) beats.push(b);
  }
  // Una línea no puede estar de los dos lados: queda donde pesa más.
  const cIds = new Map(counters.map((x) => [x.id, x]));
  const bIds = new Map(beats.map((x) => [x.id, x]));
  const keepC = counters.filter((x) => !bIds.has(x.id) || x.weight >= bIds.get(x.id).weight);
  const keepB = beats.filter((x) => !cIds.has(x.id) || x.weight > cIds.get(x.id).weight);
  const byW = (a, b) => b.weight - a.weight;
  return { counters: keepC.sort(byW), beats: keepB.sort(byW) };
}
