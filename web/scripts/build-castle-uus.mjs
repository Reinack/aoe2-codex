// Genera web/data/castle-uu.json: la unidad única de Castillo (roster, con su Elite)
// de cada civilización. El árbol vendorizado modela esta unidad como un placeholder
// genérico sin costo real (`uniqueunit`/`eliteunique`, train_cost 0) — cada civ solo
// trae `imgPic`/`eliteImgPic` (número de ícono) y a veces un `cost` parcial. Por eso
// nunca aparecía como construible: no existía como item con costo real.
//
// Fuente de nombre + costo + tiempo: D:\Boveda\Aoe\counters\all-units-stats.md
// (extraído de empires2_x2_p1.dat), cruzado contra el `cost` embebido en cada
// civ/*.js cuando existe (coincidió en 18/19 casos; Bengalis tenía un cost incompleto
// {gold:60} en el árbol — se prefirió el de la tabla, 60W/60G). El costo Elite es
// igual al costo base en TODOS los pares verificados (regla general de AoE2: el
// upgrade a Elite es una tech, no cambia el costo de entreno).
//
// Excluye: cumans/goths/huns/wu — su UU YA es un nodo real y correcto del árbol
// (kipchak_c, huskarl_b, tarkan_s, jian_swordsman, ver build-civ-mods.mjs).
//
//   node web/scripts/build-castle-uus.mjs
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = join(__dirname, "..");
process.env.TREE_DATA_DIR =
  process.env.TREE_DATA_DIR || join(WEB, "public", "tree", "src", "data");

const { loadTree } = await import("../techtree/load.mjs");
const t = await loadTree();

// civSlug → { name de la UU, costo/tiempo base y elite }. Ver cita de fuente arriba.
const CASTLE_UU = {
  armenians:   { name: "Composite Bowman",     cost: { wood: 35, gold: 45 }, time: 12, eliteCost: { wood: 35, gold: 45 }, eliteTime: 10 },
  aztecs:      { name: "Jaguar Warrior",       cost: { food: 60, gold: 30 }, time: 12, eliteCost: { food: 60, gold: 30 }, eliteTime: 12 },
  bengalis:    { name: "Ratha",                cost: { wood: 60, gold: 60 }, time: 20, eliteCost: { wood: 60, gold: 60 }, eliteTime: 18 },
  berbers:     { name: "Camel Archer",         cost: { wood: 50, gold: 60 }, time: 25, eliteCost: { wood: 50, gold: 60 }, eliteTime: 25 },
  bohemians:   { name: "Hussite Wagon",        cost: { wood: 110, gold: 70 }, time: 30, eliteCost: { wood: 110, gold: 70 }, eliteTime: 26 },
  britons:     { name: "Longbowman",           cost: { wood: 35, gold: 40 }, time: 18, eliteCost: { wood: 35, gold: 40 }, eliteTime: 18 },
  bulgarians:  { name: "Konnik",               cost: { food: 60, gold: 70 }, time: 16, eliteCost: { food: 60, gold: 70 }, eliteTime: 16 },
  burgundians: { name: "Coustillier",          cost: { food: 55, gold: 55 }, time: 15, eliteCost: { food: 55, gold: 55 }, eliteTime: 14 },
  burmese:     { name: "Arambai",              cost: { wood: 75, gold: 60 }, time: 18, eliteCost: { wood: 75, gold: 60 }, eliteTime: 18 },
  byzantines:  { name: "Cataphract",           cost: { food: 70, gold: 75 }, time: 20, eliteCost: { food: 70, gold: 75 }, eliteTime: 20 },
  celts:       { name: "Woad Raider",          cost: { food: 70, gold: 25 }, time: 10, eliteCost: { food: 70, gold: 25 }, eliteTime: 10 },
  chinese:     { name: "Chu Ko Nu",            cost: { wood: 40, gold: 35 }, time: 16, eliteCost: { wood: 40, gold: 35 }, eliteTime: 13 },
  dravidians:  { name: "Urumi Swordsman",      cost: { food: 65, gold: 20 }, time: 9, eliteCost: { food: 65, gold: 20 }, eliteTime: 9 },
  ethiopians:  { name: "Shotel Warrior",       cost: { food: 50, gold: 30 }, time: 8, eliteCost: { food: 50, gold: 30 }, eliteTime: 4 },
  franks:      { name: "Throwing Axeman",      cost: { food: 55, gold: 25 }, time: 13, eliteCost: { food: 55, gold: 25 }, eliteTime: 13 },
  georgians:   { name: "Monaspa",              cost: { food: 60, gold: 45 }, time: 14, eliteCost: { food: 60, gold: 45 }, eliteTime: 14 },
  gurjaras:    { name: "Chakram Thrower",      cost: { food: 65, gold: 30 }, time: 15, eliteCost: { food: 65, gold: 30 }, eliteTime: 15 },
  hindustanis: { name: "Ghulam",               cost: { food: 30, gold: 45 }, time: 12, eliteCost: { food: 30, gold: 45 }, eliteTime: 12 },
  incas:       { name: "Kamayuk",              cost: { food: 60, gold: 30 }, time: 10, eliteCost: { food: 60, gold: 30 }, eliteTime: 10 },
  italians:    { name: "Genoese Crossbowman",  cost: { wood: 45, gold: 40 }, time: 14, eliteCost: { wood: 45, gold: 40 }, eliteTime: 14 },
  japanese:    { name: "Samurai",              cost: { food: 45, gold: 30 }, time: 9, eliteCost: { food: 45, gold: 30 }, eliteTime: 9 },
  jurchens:    { name: "Iron Pagoda",          cost: { food: 80, gold: 55 }, time: 14, eliteCost: { food: 80, gold: 55 }, eliteTime: 14 },
  khitans:     { name: "Liao Dao",             cost: { food: 40, gold: 40 }, time: 12, eliteCost: { food: 40, gold: 40 }, eliteTime: 12 },
  khmer:       { name: "Ballista Elephant",    cost: { food: 100, gold: 80 }, time: 25, eliteCost: { food: 100, gold: 80 }, eliteTime: 25 },
  koreans:     { name: "War Wagon",            cost: { wood: 200, gold: 60 }, time: 21, eliteCost: { wood: 200, gold: 60 }, eliteTime: 21 },
  lithuanians: { name: "Leitis",               cost: { food: 70, gold: 50 }, time: 20, eliteCost: { food: 70, gold: 50 }, eliteTime: 18 },
  magyars:     { name: "Magyar Huszar",        cost: { food: 35, gold: 45 }, time: 12, eliteCost: { food: 35, gold: 45 }, eliteTime: 12 },
  malay:       { name: "Karambit Warrior",     cost: { food: 25, gold: 15 }, time: 6, eliteCost: { food: 25, gold: 15 }, eliteTime: 6 },
  malians:     { name: "Gbeto",                cost: { food: 50, gold: 40 }, time: 17, eliteCost: { food: 50, gold: 40 }, eliteTime: 17 },
  mapuche:     { name: "Kona",                 cost: { food: 65, gold: 40 }, time: 14, eliteCost: { food: 65, gold: 40 }, eliteTime: 14 },
  mayans:      { name: "Plumed Archer",        cost: { wood: 55, gold: 55 }, time: 16, eliteCost: { wood: 55, gold: 55 }, eliteTime: 16 },
  mongols:     { name: "Mangudai",             cost: { wood: 55, gold: 65 }, time: 26, eliteCost: { wood: 55, gold: 65 }, eliteTime: 26 },
  muisca:      { name: "Guecha Warrior",       cost: { wood: 50, gold: 60 }, time: 17, eliteCost: { wood: 50, gold: 60 }, eliteTime: 17 },
  persians:    { name: "War Elephant",         cost: { food: 170, gold: 85 }, time: 25, eliteCost: { food: 170, gold: 85 }, eliteTime: 25 },
  poles:       { name: "Obuch",                cost: { food: 55, gold: 20 }, time: 12, eliteCost: { food: 55, gold: 20 }, eliteTime: 12 },
  portuguese:  { name: "Organ Gun",            cost: { wood: 80, gold: 70 }, time: 25, eliteCost: { wood: 80, gold: 70 }, eliteTime: 21 },
  romans:      { name: "Centurion",            cost: { food: 75, gold: 85 }, time: 24, eliteCost: { food: 75, gold: 85 }, eliteTime: 24 },
  saracens:    { name: "Mameluke",             cost: { food: 55, gold: 85 }, time: 23, eliteCost: { food: 55, gold: 85 }, eliteTime: 23 },
  shu:         { name: "White Feather Guard",  cost: { food: 60, gold: 15 }, time: 11, eliteCost: { food: 60, gold: 15 }, eliteTime: 11 },
  sicilians:   { name: "Serjeant",             cost: { food: 55, gold: 25 }, time: 12, eliteCost: { food: 55, gold: 25 }, eliteTime: 12 },
  slavs:       { name: "Boyar",                cost: { food: 60, gold: 70 }, time: 15, eliteCost: { food: 60, gold: 70 }, eliteTime: 15 },
  spanish:     { name: "Conquistador",         cost: { food: 70, gold: 60 }, time: 24, eliteCost: { food: 70, gold: 60 }, eliteTime: 24 },
  tatars:      { name: "Keshik",               cost: { food: 60, gold: 40 }, time: 17, eliteCost: { food: 60, gold: 40 }, eliteTime: 15 },
  teutons:     { name: "Teutonic Knight",      cost: { food: 85, gold: 30 }, time: 12, eliteCost: { food: 85, gold: 30 }, eliteTime: 12 },
  tupi:        { name: "Ibirapema Warrior",    cost: { food: 30, gold: 60 }, time: 24, eliteCost: { food: 30, gold: 60 }, eliteTime: 24 },
  turks:       { name: "Janissary",            cost: { food: 60, gold: 55 }, time: 21, eliteCost: { food: 60, gold: 55 }, eliteTime: 21 },
  vietnamese:  { name: "Rattan Archer",        cost: { wood: 50, gold: 45 }, time: 16, eliteCost: { wood: 50, gold: 45 }, eliteTime: 16 },
  vikings:     { name: "Berserk",              cost: { food: 65, gold: 20 }, time: 14, eliteCost: { food: 65, gold: 20 }, eliteTime: 12 },
  wei:         { name: "Tiger Cavalry",        cost: { food: 60, gold: 80 }, time: 15, eliteCost: { food: 60, gold: 80 }, eliteTime: 15 },
};

const zero = { food: 0, wood: 0, gold: 0, stone: 0 };
const items = [];
let missingIcons = 0;

for (const [slug, uuData] of Object.entries(CASTLE_UU)) {
  const civ = t.CIVS[slug];
  const uu = civ && (civ.uniqueUnits || [])[0];
  if (!uu) { console.warn(`[castle-uu] ${slug}: sin uniqueUnits en civ.js, se omite`); continue; }

  const iconPath = (pic) => {
    if (pic == null) return null;
    const rel = `img/Unit/${pic}.png`;
    const abs = join(WEB, "public", "tree", rel);
    if (!existsSync(abs)) { missingIcons++; return null; }
    return rel;
  };

  items.push({
    id: `castle_uu_${slug}`,
    name: uuData.name,
    kind: "unit",
    category: "castle",
    variant: "unique",
    age: "castle",
    cost: { ...zero, ...uuData.cost },
    time: uuData.time,
    imgPath: iconPath(uu.imgPic),
    civSlug: slug,
  });
  items.push({
    id: `castle_uu_${slug}_elite`,
    name: `Elite ${uuData.name}`,
    kind: "unit",
    category: "castle",
    variant: "unique",
    age: "imperial",
    cost: { ...zero, ...uuData.eliteCost },
    time: uuData.eliteTime,
    imgPath: iconPath(uu.eliteImgPic),
    civSlug: slug,
  });
}

const OUT = join(WEB, "data", "castle-uu.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(items, null, 2) + "\n");
console.log(`castle-uu.json: ${items.length} items (${Object.keys(CASTLE_UU).length} civs × 2) → ${OUT}` +
  (missingIcons ? ` (${missingIcons} íconos no encontrados en disco)` : ""));
