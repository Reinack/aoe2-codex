// =============================================================================
// UNIT STATS — Árbol Tecnológico AOE2 DE
// Organizado en tres secciones según disponibilidad por civilización:
//   UNIT_STATS          → Genéricas (disponibles para todas o casi todas las civs)
//   REGIONAL_UNIT_STATS → Regionales (disponibles para 2+ civs pero no todas)
//   UNIQUE_UNIT_STATS   → Únicas (exclusivas de 1 civilización)
//
// Campos: hp, attack, armor [melee, pierce], range, speed, rof (reload), los, train (seg.)
// =============================================================================

// ── GENÉRICAS ─────────────────────────────────────────────────────────────────
const UNIT_STATS = {

  // ── CUARTEL ───────────────────────────────────────────────────────────────
  'militia':       { hp: 40,  attack: 4,   armor: [0, 1],   range: 0,  speed: 0.90, rof: 2.0,  los: 4,  train: 21 },
  'manatarms':     { hp: 45,  attack: 6,   armor: [0, 1],   range: 0,  speed: 0.96, rof: 2.0,  los: 4,  train: 21 },
  'longsword':     { hp: 60,  attack: 9,   armor: [1, 1],   range: 0,  speed: 0.96, rof: 2.0,  los: 4,  train: 21 },
  'twohanded':     { hp: 65,  attack: 12,  armor: [1, 1],   range: 0,  speed: 0.96, rof: 2.0,  los: 5,  train: 21 },
  'champion':      { hp: 70,  attack: 14,  armor: [1, 1],   range: 0,  speed: 0.96, rof: 2.0,  los: 5,  train: 21 },
  'spearman':      { hp: 45,  attack: 3,   armor: [0, 0],   range: 0,  speed: 1.00, rof: 3.0,  los: 4,  train: 22 },
  'pikeman':       { hp: 55,  attack: 4,   armor: [0, 0],   range: 0,  speed: 1.00, rof: 3.0,  los: 4,  train: 22 },
  'halberdier':    { hp: 60,  attack: 6,   armor: [0, 0],   range: 0,  speed: 1.00, rof: 3.0,  los: 4,  train: 22 },

  // ── GALERÍA DE TIRO ───────────────────────────────────────────────────────
  'archer':        { hp: 30,  attack: 4,   armor: [0, 0],   range: 4,  speed: 0.96, rof: 2.0,  los: 6,  train: 35 },
  'crossbow':      { hp: 35,  attack: 5,   armor: [0, 0],   range: 5,  speed: 0.96, rof: 2.0,  los: 7,  train: 27 },
  'arbalester':    { hp: 40,  attack: 6,   armor: [0, 0],   range: 5,  speed: 0.96, rof: 2.0,  los: 7,  train: 27 },
  'skirmisher':    { hp: 30,  attack: 2,   armor: [0, 3],   range: 4,  speed: 0.96, rof: 3.0,  los: 6,  train: 22 },
  'eliteskirm':    { hp: 35,  attack: 3,   armor: [0, 4],   range: 5,  speed: 0.96, rof: 3.0,  los: 7,  train: 22 },
  'handcannon':    { hp: 40,  attack: 17,  armor: [1, 0],   range: 7,  speed: 0.96, rof: 3.45, los: 9,  train: 34 },
  'cavarcher':     { hp: 50,  attack: 6,   armor: [0, 0],   range: 4,  speed: 1.40, rof: 2.0,  los: 5,  train: 34 },
  'hcavarcher':    { hp: 60,  attack: 7,   armor: [0, 1],   range: 4,  speed: 1.40, rof: 2.0,  los: 6,  train: 27 },

  // ── ESTABLO ───────────────────────────────────────────────────────────────
  'scout':         { hp: 45,  attack: 5,   armor: [0, 2],   range: 0,  speed: 1.55, rof: 2.0,  los: 6,  train: 30 },
  'lightcav':      { hp: 60,  attack: 7,   armor: [0, 2],   range: 0,  speed: 1.50, rof: 2.0,  los: 8,  train: 30 },
  'hussar':        { hp: 75,  attack: 7,   armor: [0, 2],   range: 0,  speed: 1.50, rof: 1.9,  los: 10, train: 30 },
  'knight':        { hp: 100, attack: 10,  armor: [2, 2],   range: 0,  speed: 1.35, rof: 1.8,  los: 4,  train: 30 },
  'cavalier':      { hp: 120, attack: 12,  armor: [2, 2],   range: 0,  speed: 1.35, rof: 1.8,  los: 4,  train: 30 },
  'paladin':       { hp: 160, attack: 14,  armor: [2, 3],   range: 0,  speed: 1.35, rof: 1.9,  los: 5,  train: 30 },

  // ── TALLER DE ASEDIO ──────────────────────────────────────────────────────
  'batteringram':  { hp: 175, attack: 2,   armor: [-3, 180], range: 0, speed: 0.60, rof: 5.0,  los: 3,  train: 36, blast_radius: 0,
    bonuses: [{ vs: 'all_buildings', value: 150 }, { vs: 'siege_weapons', value: 40 }] },
  'cappedram':     { hp: 200, attack: 3,   armor: [-2, 190], range: 0, speed: 0.60, rof: 5.0,  los: 3,  train: 36, blast_radius: 1.5,
    bonuses: [{ vs: 'all_buildings', value: 160 }, { vs: 'siege_weapons', value: 50 }] },
  'siegeram':      { hp: 270, attack: 4,   armor: [-1, 195], range: 0, speed: 0.60, rof: 5.0,  los: 3,  train: 36, blast_radius: 2,
    bonuses: [{ vs: 'all_buildings', value: 200 }, { vs: 'siege_weapons', value: 65 }] },
  'mangonel':      { hp: 50,  attack: 40,  armor: [0, 6],   range: 7,  speed: 0.60, rof: 6.0,  los: 9,  train: 46, blast_radius: 1,
    bonuses: [{ vs: 'heavy_siege', value: 40 }, { vs: 'all_buildings', value: 35 }, { vs: 'siege_weapons', value: 12 }, { vs: 'monks', value: -1 }] },
  'onager':        { hp: 60,  attack: 50,  armor: [0, 7],   range: 8,  speed: 0.60, rof: 6.0,  los: 10, train: 46, blast_radius: 1.25,
    bonuses: [{ vs: 'heavy_siege', value: 50 }, { vs: 'all_buildings', value: 45 }, { vs: 'siege_weapons', value: 12 }] },
  'siegeonager':   { hp: 70,  attack: 75,  armor: [0, 8],   range: 8,  speed: 0.60, rof: 6.0,  los: 10, train: 46, blast_radius: 1.5,
    bonuses: [{ vs: 'heavy_siege', value: 50 }, { vs: 'all_buildings', value: 60 }, { vs: 'siege_weapons', value: 12 }] },
  'scorpion':      { hp: 40,  attack: 11,  armor: [0, 7],   range: 7,  speed: 0.65, rof: 3.6,  los: 9,  train: 30, blast_radius: 0,
    bonuses: [{ vs: 'elephant_units', value: 7 }, { vs: 'all_buildings', value: 3 }, { vs: 'rams', value: 1 }, { vs: 'infantry', value: 1 }] },
  'heavyscorpion': { hp: 60,  attack: 14,  armor: [1, 8],   range: 7,  speed: 0.65, rof: 3.6,  los: 9,  train: 30, blast_radius: 0,
    bonuses: [{ vs: 'elephant_units', value: 10 }, { vs: 'all_buildings', value: 6 }, { vs: 'rams', value: 2 }, { vs: 'infantry', value: 2 }] },
  'bombcannon':    { hp: 80,  attack: 40,  armor: [2, 5],   range: 12, speed: 0.70, rof: 6.5,  los: 14, train: 56, blast_radius: 0.5,
    bonuses: [{ vs: 'all_buildings', value: 200 }, { vs: 'ships', value: 40 }, { vs: 'fishing_ships', value: 40 }, { vs: 'stone_defense', value: 40 }, { vs: 'heavy_siege', value: 40 }, { vs: 'siege_weapons', value: 20 }] },
  'siegetower':    { hp: 175, attack: 0,   armor: [-2, 100], range: 0, speed: 0.96, rof: 0,    los: 8,  train: 36 },

  // ── MUELLE ────────────────────────────────────────────────────────────────
  'fishingship':   { hp: 50,  attack: 0,   armor: [1, 1],   range: 0,  speed: 1.26, rof: 0,    los: 5,  train: 40 },
  'transportship': { hp: 70,  attack: 0,   armor: [0, 2],   range: 0,  speed: 1.45, rof: 0,    los: 5,  train: 46 },
  'tradecart':     { hp: 70,  attack: 0,   armor: [0, 0],   range: 0,  speed: 1.25, rof: 0,    los: 7,  train: 51 },
  'tradecog':      { hp: 80,  attack: 0,   armor: [0, 6],   range: 0,  speed: 1.65, rof: 0,    los: 6,  train: 36 },
  // Galera
  'galley':        { hp: 110, attack: 6,   armor: [0, 3],   range: 5,  speed: 1.36, rof: 3.0,  los: 7,  train: 36,
    bonuses: [{ vs: 'all_buildings', value: 6 }, { vs: 'long_range_warship', value: 5 }, { vs: 'rams', value: 3 }] },
  'wargalley':     { hp: 125, attack: 7,   armor: [0, 4],   range: 6,  speed: 1.43, rof: 3.0,  los: 8,  train: 60 },
  'galleon':       { hp: 165, attack: 8,   armor: [0, 8],   range: 7,  speed: 1.43, rof: 3.0,  los: 9,  train: 60 },
  // Barco de Fuego
  'firegalley':    { hp: 110, attack: 2,   armor: [1, 4],   range: 2.49, speed: 1.30, rof: 0.25, los: 5, train: 49 },
  'fireship':      { hp: 120, attack: 3,   armor: [2, 4],   range: 2.49, speed: 1.35, rof: 0.25, los: 5, train: 60 },
  'fastfireship':  { hp: 140, attack: 4,   armor: [3, 7],   range: 2.49, speed: 1.43, rof: 0.25, los: 6, train: 60 },
  // Barco de Demolición
  'demoraft':      { hp: 40,  attack: 75,  armor: [0, 0],   range: 0,  speed: 1.50, rof: 0,    los: 6,  train: 45 },
  'demoship':      { hp: 50,  attack: 95,  armor: [1, 0],   range: 0,  speed: 1.60, rof: 0,    los: 6,  train: 31 },
  'heavydemo':     { hp: 70,  attack: 120, armor: [2, 5],   range: 0,  speed: 1.60, rof: 0,    los: 6,  train: 31 },
  // Hulk
  'hulk':          { hp: 90,  attack: 4,   armor: [4, 1],   range: 1,  speed: 1.42, rof: 1.75, los: 5,  train: 42,
    bonuses: [{ vs: 'fire_ships', value: 1 }, { vs: 'standard_buildings', value: -3 }] },
  'war_hulk':      { hp: 115, attack: 4,   armor: [5, 1],   range: 1,  speed: 1.43, rof: 1.75, los: 5,  train: 60 },
  'carrack':       { hp: 180, attack: 8,   armor: [6, 4],   range: 2,  speed: 1.43, rof: 1.75, los: 7,  train: 60 },
  // Galeón de Artillería
  'cannongalleon': { hp: 120, attack: 50,  armor: [0, 6],   range: 13, speed: 1.10, rof: 10,   los: 15, train: 46 },
  'elitecannon':   { hp: 150, attack: 60,  armor: [0, 8],   range: 15, speed: 1.10, rof: 10,   los: 17, train: 70 },

  // ── CASTILLO ──────────────────────────────────────────────────────────────
  'trebuchet':     { hp: 150, attack: 200, armor: [2, 8],   range: 16, speed: 0.8,  rof: 10,   los: 19, train: 50, blast_radius: 0,
    bonuses: [{ vs: 'all_buildings', value: 250 }] },
  'petard':        { hp: 50,  attack: 25,  armor: [0, 2],   range: 0,  speed: 1.05, rof: 0,    los: 4,  train: 25, blast_radius: 2 },

  // ── VARIOS ────────────────────────────────────────────────────────────────
  'monk':          { hp: 30,  attack: 0,   armor: [0, 0],   range: 9,  speed: 0.70, rof: 0,    los: 11, train: 51 },
  'villager':      { hp: 25,  attack: 3,   armor: [0, 0],   range: 0,  speed: 0.80, rof: 2.0,  los: 4,  train: 25,
    bonuses: [{ vs: 'stone_defense', value: 6 }, { vs: 'heavy_siege', value: 6 }, { vs: 'all_buildings', value: 3 }] },
};

// ── REGIONALES ────────────────────────────────────────────────────────────────
// Disponibles para 2+ civilizaciones pero no todas
const REGIONAL_UNIT_STATS = {

  // ── CUARTEL — Línea Águila (civs mesoamericanas) ──────────────────────────
  'eaglescout':    { hp: 50,  attack: 4,   armor: [0, 2],   range: 0,  speed: 1.10, rof: 2.0,  los: 6,  train: 50 },
  'eaglewarrior':  { hp: 55,  attack: 7,   armor: [0, 3],   range: 0,  speed: 1.15, rof: 2.0,  los: 6,  train: 35 },
  'eliteeagle':    { hp: 60,  attack: 9,   armor: [0, 4],   range: 0,  speed: 1.30, rof: 2.0,  los: 6,  train: 20 },

  // ── CUARTEL — Línea Champi (civs sudamericanas) ───────────────────────────
  'champiscout':   { hp: 35,  attack: 3,   armor: [0, 2],   range: 0,  speed: 1.00, rof: 2.0,  los: 5,  train: 45 },
  'champirunner':  { hp: 40,  attack: 5,   armor: [0, 2],   range: 0,  speed: 1.10, rof: 2.0,  los: 5,  train: 40 },
  'champiwarrior': { hp: 55,  attack: 9,   armor: [0, 3],   range: 0,  speed: 1.10, rof: 2.0,  los: 6,  train: 26 },
  'elitechampi':   { hp: 65,  attack: 11,  armor: [0, 4],   range: 0,  speed: 1.10, rof: 2.0,  los: 6,  train: 21 },

  // ── CUARTEL — Lancero de Fuego (civs dinásticas chinas + Vietnam) ────────
  'fire_lancer':       { hp: 65,  attack:  9, armor: [1, 0],   range: 0,  speed: 0.96, rof: 2.0,  los: 7,  train: 35 },
  'elite_fire_lancer': { hp: 85,  attack: 10, armor: [2, 1],   range: 0,  speed: 0.96, rof: 2.0,  los: 8,  train: 25 },

  // ── GALERÍA — Hondero (civs americanas) ──────────────────────────────────
  'slinger':           { hp: 35,  attack: 4,  armor: [0, 0],   range: 5,  speed: 0.96, rof: 2.0,  los: 7,  train: 25,
    bonuses: [{ vs: 'infantry', value: 4 }, { vs: 'siege', value: 3 }, { vs: 'spearmen', value: 1 }, { vs: 'monks', value: 4 }] },

  // ── GALERÍA — Elefante Arquero (civs indias) ──────────────────────────────
  'elephant_archer':       { hp: 200, attack: 6,  armor: [0, 2],   range: 4,  speed: 0.80, rof: 2.5,  los: 7,  train: 25 },
  'elite_elephant_archer': { hp: 250, attack: 7,  armor: [0, 2],   range: 5,  speed: 0.80, rof: 2.5,  los: 8,  train: 25 },

  // ── ESTABLO — Camello (civs orientales) ───────────────────────────────────
  'camel':         { hp: 100, attack: 6,   armor: [0, 0],   range: 0,  speed: 1.45, rof: 2.0,  los: 5,  train: 22,
    bonuses: [{ vs: 'cavalry', value: 9 }, { vs: 'camel_units', value: 5 }, { vs: 'ships', value: 5 }, { vs: 'fishing_ships', value: 5 }] },
  'heavycamel':    { hp: 120, attack: 7,   armor: [0, 0],   range: 0,  speed: 1.45, rof: 2.0,  los: 5,  train: 22,
    bonuses: [{ vs: 'cavalry', value: 18 }, { vs: 'camel_units', value: 9 }, { vs: 'ships', value: 9 }, { vs: 'fishing_ships', value: 9 }, { vs: 'mamelukes', value: 7 }] },
  'camel_scout':   { hp: 70,  attack: 5,   armor: [0, 0],   range: 0,  speed: 1.45, rof: 2.0,  los: 5,  train: 22 },
  'imp_camel':     { hp: 140, attack: 8,   armor: [0, 0],   range: 0,  speed: 1.45, rof: 2.0,  los: 5,  train: 20 },

  // ── ESTABLO — Elefante de Combate (civs SE asiáticas) ────────────────────
  'battleeleph':   { hp: 250, attack: 12,  armor: [1, 2],   range: 0,  speed: 0.90, rof: 2.0,  los: 4,  train: 24,
    bonuses: [{ vs: 'all_buildings', value: 4 }, { vs: 'stone_defense', value: 4 }] },
  'eliteeleph':    { hp: 300, attack: 14,  armor: [1, 3],   range: 0,  speed: 0.90, rof: 2.0,  los: 5,  train: 24,
    bonuses: [{ vs: 'all_buildings', value: 7 }, { vs: 'stone_defense', value: 7 }] },

  // ── ESTABLO — Lancero Estepario (civs esteparias) ─────────────────────────
  'steppe_lancer':       { hp: 60,  attack: 9,  armor: [0, 1],   range: 1,  speed: 1.45, rof: 2.0,  los: 5,  train: 24 },
  'elite_steppe_lancer': { hp: 80,  attack: 11, armor: [0, 2],   range: 1,  speed: 1.45, rof: 2.0,  los: 5,  train: 20 },

  // ── ESTABLO — Húsar Alado (Polacos / Lituanos) ───────────────────────────
  'winged_hussar': { hp: 80,  attack: 9,   armor: [1, 2],   range: 0,  speed: 1.50, rof: 1.9,  los: 10, train: 30 },

  // ── ESTABLO — Guerrero Xolotl (civs americanas) ───────────────────────────
  'xolotl_warrior': { hp: 100, attack: 10, armor: [2, 2],   range: 0,  speed: 1.35, rof: 1.8,  los: 4,  train: 30 },

  // ── ESTABLO — Caballería Hei Guang (civs Tres Reinos) ────────────────────
  'hei_guang':       { hp: 60,  attack: 11, armor: [4, 3],   range: 0,  speed: 1.35, rof: 1.8,  los: 4,  train: 28 },
  'heavy_hei_guang': { hp: 90,  attack: 12, armor: [4, 3],   range: 0,  speed: 1.35, rof: 1.8,  los: 4,  train: 28 },

  // ── ASEDIO — Carro de Cohetes (civs dinásticas chinas) ───────────────────
  'rocket_cart':       { hp:  45, attack:  5, armor: [0, 6],   range: 7,  speed: 0.60, rof: 5.5,  los:  9, train: 40 },
  'heavy_rocket_cart': { hp:  65, attack:  5, armor: [0, 8],   range: 8,  speed: 0.60, rof: 5.35, los: 10, train: 40 },

  // ── ASEDIO — Elefante de Asedio (civs indias) ─────────────────────────────
  'armored_elephant': { hp: 180, attack: 4,  armor: [-2, 140], range: 0,  speed: 0.60, rof: 3.0,  los: 4,  train: 36, blast_radius: 0 },
  'siege_elephant':   { hp: 220, attack: 4,  armor: [-2, 150], range: 0,  speed: 0.60, rof: 3.0,  los: 4,  train: 36, blast_radius: 1.5,
    bonuses: [{ vs: 'all_buildings', value: 105 }, { vs: 'siege_weapons', value: 35 }] },

  // ── ASEDIO — Lanzapiedras de Tracción (civs Tres Reinos) ─────────────────
  'traction_treb':    { hp: 115, attack: 50,  armor: [1, 8],  range: 14, speed: 0.57, rof: 11,   los: 18, train: 70 },

  // ── MUELLE — Navíos Regionales ────────────────────────────────────────────
  'dromon':        { hp: 125, attack: 50,  armor: [1, 6],   range: 12, speed: 1.20, rof: 8.0,  los: 12, train: 60 },
  'lou_chuan':     { hp: 175, attack: 25,  armor: [0,  9],  range: 13, speed: 1.15, rof: 5.5,  los: 15, train: 60 },
  'catapult_gall': { hp: 150, attack: 50,  armor: [0, 8],   range: 11, speed: 1.10, rof: 8.0,  los: 13, train: 80 },
};

// ── ÚNICAS ────────────────────────────────────────────────────────────────────
// Exclusivas de una sola civilización
const UNIQUE_UNIT_STATS = {

  // ── POR ID — Unidades únicas accesibles por id de nodo en el árbol ────────

  // Cuartel exclusivos
  'huskarl_b':     { hp: 60,  attack: 10,  armor: [0, 6],   range: 0,  speed: 1.05, rof: 2.0,  los: 3,  train: 16 }, // Godos (Cuartel)
  'condottiero':   { hp: 80,  attack: 10,  armor: [1, 0],   range: 0,  speed: 1.20, rof: 1.9,  los: 6,  train: 18 }, // Italianos / aliados
  'flemish_militia':{ hp: 40,  attack: 5,   armor: [1, 1],   range: 0,  speed: 0.94, rof: 2.0,  los: 7,  train: 14, // Borgoñones
    bonuses: [{ vs: 'cavalry', value: 6 }, { vs: 'elephants', value: 6 }, { vs: 'camel_units', value: 4 }, { vs: 'ships', value: 4 }, { vs: 'fishing_ships', value: 4 }, { vs: 'shock_infantry', value: 2 }] },
  'legionary':     { hp: 75,  attack: 12,  armor: [2, 2],   range: 0,  speed: 0.90, rof: 2.0,  los: 5,  train: 16 }, // Romanos
  'jian_swordsman':{ hp: 70,  attack: 8,   armor: [2, 5],   range: 0,  speed: 1.00, rof: 2.0,  los: 4,  train: 35 }, // Wu (Shielded form)

  // Galería exclusivos
  'imp_skirmisher':{ hp: 40,  attack: 4,   armor: [0, 5],   range: 5,  speed: 0.96, rof: 3.0,  los: 7,  train: 22 }, // Vietnamitas / aliados
  'genitour':      { hp: 50,  attack: 3,   armor: [0, 3],   range: 4,  speed: 1.35, rof: 3.0,  los: 5,  train: 25 }, // Bereberes / aliados
  'grenadier':     { hp: 40,  attack: 12,  armor: [1, 1],   range: 6,  speed: 0.96, rof: 3.45, los: 9,  train: 21 }, // Jurchens
  'xianbei_raider':{ hp: 30,  attack: 5,   armor: [0, 0],   range: 4,  speed: 1.40, rof: 1.8,  los: 6,  train: 26 }, // Wei

  // Establo exclusivos
  'tarkan_s':      { hp: 100, attack: 8,   armor: [1, 3],   range: 0,  speed: 1.40, rof: 2.1,  los: 5,  train: 26 }, // Hunos (Establo)
  'savar':         { hp: 145, attack: 14,  armor: [3, 4],   range: 0,  speed: 1.35, rof: 1.8,  los: 5,  train: 30 }, // Persas
  'shrivamsha':    { hp: 55,  attack: 8,   armor: [0, 1],   range: 0,  speed: 1.60, rof: 2.0,  los: 5,  train: 20 }, // Gurjaras
  'elite_shrivamsha':{ hp: 70,attack: 11,  armor: [0, 1],   range: 0,  speed: 1.60, rof: 1.9,  los: 6,  train: 20 }, // Gurjaras

  // Asedio exclusivos
  'houfnice':      { hp: 90,  attack: 50,  armor: [2, 5],   range: 12, speed: 0.70, rof: 6.5,  los: 14, train: 56 }, // Bohemios
  'flaming_camel': { hp: 55,  attack: 20,  armor: [0, 0],   range: 0,  speed: 1.45, rof: 0,    los: 4,  train: 25 }, // Tártaros
  'mounted_treb':  { hp: 150, attack: 200, armor: [2, 8],   range: 16, speed: 1.10, rof: 10,   los: 19, train: 50 }, // Khitanos
  'war_chariot_s': { hp: 65,  attack: 8,   armor: [0, 5],   range: 6,  speed: 0.90, rof: 6.5,  los: 8,  train: 28 }, // Shu

  // Muelle exclusivos
  'turtle_ship':   { hp: 200, attack: 50,  armor: [6, 5],   range: 6,  speed: 1.05, rof: 6.0,  los: 8,  train: 50 }, // Coreanos
  'longboat':      { hp: 125, attack: 5,   armor: [0, 3],   range: 6,  speed: 1.54, rof: 3.0,  los: 8,  train: 36 }, // Vikingos
  'caravel_d':     { hp: 130, attack: 6,   armor: [0, 8],   range: 6,  speed: 1.43, rof: 3.0,  los: 9,  train: 36 }, // Portugueses
  'thirisadai':    { hp: 250, attack: 9,   armor: [2, 10],  range: 7,  speed: 1.30, rof: 3.45, los: 11, train: 60 }, // Dravídicos
  'dragon_ship':   { hp: 150, attack: 4,   armor: [3, 8],   range: 3,  speed: 1.35, rof: 0.25, los: 6,  train: 60 }, // Chinos

  // Monasterio exclusivos
  'missionary':    { hp: 30,  attack: 0,   armor: [0, 0],   range: 7,  speed: 1.10, rof: 0,    los: 9,  train: 51 }, // Españoles
  'warrior_priest':{ hp: 80,  attack: 11,  armor: [1, 1],   range: 0,  speed: 0.85, rof: 2.0,  los: 7,  train: 30 }, // Armenios

  // Castillo exclusivos
  'kipchak_c':     { hp: 40,  attack: 4,   armor: [0, 0],   range: 4,  speed: 1.40, rof: 2.1,  los: 6,  train: 20 }, // Cumanos / aliados

  // ── POR NOMBRE — Unidades únicas del slot de Castillo (lookup por civ) ────

  // Britones
  'Longbowman':              { hp: 35,  attack: 6,  armor: [0, 0],  range: 6,  speed: 0.96, rof: 2.0,  los: 8,  train: 16 },
  'Longbowman Elite':        { hp: 40,  attack: 7,  armor: [0, 1],  range: 8,  speed: 0.96, rof: 2.0,  los: 10, train: 13 },

  // Bizantinos
  'Catafracto':              { hp: 110, attack: 9,  armor: [2, 1],  range: 0,  speed: 1.35, rof: 1.8,  los: 4,  train: 20 },
  'Catafracto Elite':        { hp: 150, attack: 12, armor: [2, 1],  range: 0,  speed: 1.35, rof: 1.7,  los: 5,  train: 20 },

  // Aztecas
  'Guerrero Jaguar':         { hp: 65,  attack: 15, armor: [1, 2],  range: 0,  speed: 1.00, rof: 2.0,  los: 3,  train: 20 },
  'Guerrero Jaguar Elite':   { hp: 75,  attack: 19, armor: [2, 2],  range: 0,  speed: 1.00, rof: 2.0,  los: 5,  train: 20 },

  // Armenios
  'Arqueros con arco compuesto': { hp: 40, attack: 4, armor: [0, 1], range: 4, speed: 0.96, rof: 2.0, los: 6, train: 25 },
  'Arquero Compuesto Elite':     { hp: 45, attack: 4, armor: [1, 1], range: 4, speed: 0.96, rof: 2.0, los: 6, train: 25 },
  'Sacerdotes guerreros':        { hp: 80, attack: 11, armor: [1, 1], range: 0, speed: 0.85, rof: 2.0, los: 3, train: 30 },

  // Francos
  'Hacha Arrojadiza':        { hp: 60,  attack: 7,  armor: [0, 0],  range: 3,  speed: 1.00, rof: 2.0,  los: 5,  train: 13 },
  'Hacha Arrojadiza Elite':  { hp: 70,  attack: 8,  armor: [1, 0],  range: 4,  speed: 1.00, rof: 2.0,  los: 6,  train: 13 },

  // Godos
  'Huskarl':                 { hp: 60,  attack: 10, armor: [0, 6],  range: 0,  speed: 1.05, rof: 2.0,  los: 3,  train: 13 },
  'Huskarl Elite':           { hp: 70,  attack: 12, armor: [0, 8],  range: 0,  speed: 1.05, rof: 2.0,  los: 5,  train: 13 },

  // Japoneses
  'Samurái':                 { hp: 70,  attack: 10, armor: [1, 1],  range: 0,  speed: 1.00, rof: 1.9,  los: 4,  train: 9  },
  'Samurái Elite':           { hp: 80,  attack: 12, armor: [1, 1],  range: 0,  speed: 1.00, rof: 1.9,  los: 5,  train: 9  },

  // Vikingos
  'Berserk':                 { hp: 54,  attack: 12, armor: [1, 1],  range: 0,  speed: 1.05, rof: 2.0,  los: 3,  train: 14 },
  'Berserk Elite':           { hp: 62,  attack: 14, armor: [2, 1],  range: 0,  speed: 1.05, rof: 2.0,  los: 5,  train: 14 },

  // Hunos
  'Tarkán':                  { hp: 100, attack: 8,  armor: [1, 3],  range: 0,  speed: 1.40, rof: 2.1,  los: 5,  train: 14 },
  'Tarkán Elite':            { hp: 150, attack: 11, armor: [1, 4],  range: 0,  speed: 1.40, rof: 2.1,  los: 7,  train: 14 },

  // Españoles
  'Conquistador':            { hp: 55,  attack: 16, armor: [2, 2],  range: 6,  speed: 1.30, rof: 2.9,  los: 9,  train: 24 },
  'Conquistador Elite':      { hp: 70,  attack: 18, armor: [2, 2],  range: 6,  speed: 1.30, rof: 2.9,  los: 9,  train: 24 },

  // Teutones
  'Caballero Teutónico':     { hp: 90,  attack: 14, armor: [7, 2],  range: 0,  speed: 0.80, rof: 2.0,  los: 3,  train: 12 },
  'Cab. Teutónico Elite':    { hp: 110, attack: 17, armor: [10, 2], range: 0,  speed: 0.80, rof: 2.0,  los: 5,  train: 12 },

  // Eslavos
  'Boyar':                   { hp: 100, attack: 12, armor: [4, 2],  range: 0,  speed: 1.30, rof: 1.9,  los: 5,  train: 15 },
  'Boyar Elite':             { hp: 130, attack: 14, armor: [8, 3],  range: 0,  speed: 1.30, rof: 1.9,  los: 5,  train: 15 },

  // Jemer
  'Balistario':              { hp: 200, attack: 12, armor: [0, 3],  range: 5,  speed: 0.85, rof: 2.5,  los: 7,  train: 25 },
  'Balistario Elite':        { hp: 250, attack: 16, armor: [0, 4],  range: 5,  speed: 0.85, rof: 2.5,  los: 8,  train: 25 },

  // Italianos
  'Ballestero Genovés':      { hp: 45,  attack: 6,  armor: [0, 0],  range: 4,  speed: 0.96, rof: 2.0,  los: 6,  train: 22 },
  'Ballestero Genovés Elite':{ hp: 50,  attack: 7,  armor: [0, 0],  range: 4,  speed: 0.96, rof: 2.0,  los: 7,  train: 22 },

  // Chinos
  'Chu Ko Nu':               { hp: 45,  attack: 8,  armor: [0, 0],  range: 4,  speed: 0.96, rof: 3.0,  los: 6,  train: 16 },
  'Chu Ko Nu Elite':         { hp: 50,  attack: 8,  armor: [0, 0],  range: 4,  speed: 0.96, rof: 3.0,  los: 6,  train: 13 },

  // Mayas
  'Arquero de Plumas':       { hp: 50,  attack: 5,  armor: [0, 1],  range: 4,  speed: 1.20, rof: 1.9,  los: 6,  train: 16 },
  'Arquero de Plumas Elite': { hp: 65,  attack: 5,  armor: [0, 2],  range: 5,  speed: 1.20, rof: 1.9,  los: 6,  train: 13 },

  // Mongoles
  'Mangudai':                { hp: 60,  attack: 6,  armor: [0, 0],  range: 4,  speed: 1.45, rof: 2.1,  los: 6,  train: 26 },
  'Mangudai Elite':          { hp: 60,  attack: 8,  armor: [1, 0],  range: 4,  speed: 1.45, rof: 2.1,  los: 6,  train: 26 },

  // Persas
  'Elefante de Guerra':      { hp: 450, attack: 15, armor: [1, 2],  range: 0,  speed: 0.80, rof: 2.0,  los: 4,  train: 25 },
  'Elefante de Guerra Elite':{ hp: 600, attack: 20, armor: [1, 3],  range: 0,  speed: 0.80, rof: 2.0,  los: 5,  train: 25 },

  // Portugueses
  'Órgano de Cañones':       { hp: 60,  attack: 16, armor: [2, 4],  range: 7,  speed: 0.85, rof: 3.45, los: 9,  train: 21 },
  'Órgano de Cañones Elite': { hp: 70,  attack: 20, armor: [2, 6],  range: 7,  speed: 0.85, rof: 3.45, los: 9,  train: 21 },

  // Bengalíes
  'Ratha':                   { hp: 105, attack: 10, armor: [3, 1],  range: 0,  speed: 1.30, rof: 2.0,  los: 6,  train: 18 },
  'Ratha Elite':             { hp: 115, attack: 12, armor: [3, 3],  range: 0,  speed: 1.30, rof: 2.0,  los: 6,  train: 18 },

  // Bereberes
  'Arquero en Camello':      { hp: 60,  attack: 7,  armor: [0, 0],  range: 4,  speed: 1.40, rof: 2.0,  los: 5,  train: 25 },
  'Arquero en Camello Elite':{ hp: 65,  attack: 8,  armor: [0, 0],  range: 4,  speed: 1.40, rof: 2.0,  los: 6,  train: 25 },

  // Birmanos
  'Arambai':                 { hp: 60,  attack: 12, armor: [0, 1],  range: 5,  speed: 1.30, rof: 2.0,  los: 5,  train: 21 },
  'Arambai Elite':           { hp: 65,  attack: 15, armor: [0, 2],  range: 5,  speed: 1.30, rof: 2.0,  los: 5,  train: 21 },

  // Bohemios
  'Carro Husita':            { hp: 200, attack: 11, armor: [0, 7],  range: 6,  speed: 0.85, rof: 2.5,  los: 8,  train: 25 },
  'Carro Husita Elite':      { hp: 250, attack: 14, armor: [0, 10], range: 6,  speed: 0.85, rof: 2.5,  los: 9,  train: 25 },

  // Borgoñones
  'Coustillier':             { hp: 115, attack: 8,  armor: [2, 2],  range: 0,  speed: 1.35, rof: 1.9,  los: 5,  train: 15 },
  'Coustillier Elite':       { hp: 145, attack: 11, armor: [2, 2],  range: 0,  speed: 1.35, rof: 1.9,  los: 5,  train: 14 },

  // Búlgaros
  'Konnik':                  { hp: 100, attack: 12, armor: [2, 1],  range: 0,  speed: 1.35, rof: 2.4,  los: 5,  train: 16 },
  'Konnik Elite':            { hp: 120, attack: 14, armor: [2, 2],  range: 0,  speed: 1.35, rof: 2.4,  los: 5,  train: 16 },

  // Celtas
  'Woad Raider':             { hp: 70,  attack: 11, armor: [0, 1],  range: 0,  speed: 1.38, rof: 2.0,  los: 3,  train: 10 },
  'Woad Raider Elite':       { hp: 85,  attack: 14, armor: [0, 1],  range: 0,  speed: 1.38, rof: 2.0,  los: 5,  train: 10 },

  // Cumanos
  'Kipchak':                 { hp: 40,  attack: 4,  armor: [0, 0],  range: 4,  speed: 1.40, rof: 2.1,  los: 6,  train: 20 },
  'Kipchak Elite':           { hp: 45,  attack: 5,  armor: [0, 0],  range: 4,  speed: 1.40, rof: 2.1,  los: 6,  train: 20 },

  // Dravídicos
  'Urumi Swordsman':         { hp: 55,  attack: 9,  armor: [1, 0],  range: 0,  speed: 1.05, rof: 2.0,  los: 3,  train: 9  },
  'Urumi Elite':             { hp: 65,  attack: 11, armor: [1, 0],  range: 0,  speed: 1.05, rof: 2.0,  los: 3,  train: 9  },

  // Etíopes
  'Guerrero Shotel':         { hp: 45,  attack: 16, armor: [0, 0],  range: 0,  speed: 1.20, rof: 2.0,  los: 3,  train: 8  },
  'Guerrero Shotel Elite':   { hp: 50,  attack: 18, armor: [0, 1],  range: 0,  speed: 1.20, rof: 2.0,  los: 3,  train: 4  },

  // Georgianos
  'Monaspa':                 { hp: 70,  attack: 12, armor: [3, 2],  range: 0,  speed: 1.40, rof: 1.8,  los: 4,  train: 14 },
  'Monaspa Elite':           { hp: 80,  attack: 14, armor: [5, 2],  range: 0,  speed: 1.40, rof: 1.8,  los: 5,  train: 14 },

  // Gurjaras
  'Chakram Thrower':         { hp: 40,  attack: 3,  armor: [1, 0],  range: 5,  speed: 1.15, rof: 2.0,  los: 7,  train: 15 },
  'Chakram Thrower Elite':   { hp: 50,  attack: 4,  armor: [1, 0],  range: 6,  speed: 1.15, rof: 2.0,  los: 8,  train: 15 },

  // Hindustanís
  'Ghulam':                  { hp: 60,  attack: 9,  armor: [0, 3],  range: 0,  speed: 1.15, rof: 2.0,  los: 6,  train: 12 },
  'Ghulam Elite':            { hp: 70,  attack: 11, armor: [0, 6],  range: 0,  speed: 1.20, rof: 2.0,  los: 6,  train: 12 },

  // Incas
  'Kamayuk':                 { hp: 70,  attack: 7,  armor: [1, 0],  range: 1,  speed: 1.00, rof: 2.0,  los: 4,  train: 10 },
  'Kamayuk Elite':           { hp: 80,  attack: 8,  armor: [1, 0],  range: 1,  speed: 1.00, rof: 2.0,  los: 5,  train: 10 },

  // Lituanos
  'Leitis':                  { hp: 100, attack: 13, armor: [1, 1],  range: 0,  speed: 1.40, rof: 1.9,  los: 5,  train: 20 },
  'Leitis Elite':            { hp: 130, attack: 16, armor: [2, 1],  range: 0,  speed: 1.40, rof: 1.9,  los: 5,  train: 18 },

  // Magiares
  'Huszar Magiar':           { hp: 80,  attack: 10, armor: [0, 2],  range: 0,  speed: 1.50, rof: 1.8,  los: 5,  train: 12 },
  'Huszar Magiar Elite':     { hp: 90,  attack: 11, armor: [0, 2],  range: 0,  speed: 1.50, rof: 1.8,  los: 6,  train: 12 },

  // Malayo
  'Karambit Warrior':        { hp: 30,  attack: 7,  armor: [0, 1],  range: 0,  speed: 1.20, rof: 2.0,  los: 3,  train: 6  },
  'Karambit Elite':          { hp: 40,  attack: 8,  armor: [1, 1],  range: 0,  speed: 1.20, rof: 2.0,  los: 3,  train: 6  },

  // Malienses
  'Gbeto':                   { hp: 40,  attack: 10, armor: [0, 0],  range: 5,  speed: 1.25, rof: 2.0,  los: 6,  train: 17 },
  'Gbeto Elite':             { hp: 50,  attack: 13, armor: [0, 0],  range: 6,  speed: 1.25, rof: 2.0,  los: 7,  train: 17 },

  // Polacos
  'Obuch':                   { hp: 80,  attack: 8,  armor: [2, 2],  range: 0,  speed: 0.90, rof: 2.0,  los: 3,  train: 12 },
  'Obuch Elite':             { hp: 95,  attack: 10, armor: [2, 2],  range: 0,  speed: 0.90, rof: 2.0,  los: 3,  train: 12 },

  // Romanos
  'Legionario':              { hp: 75,  attack: 12, armor: [2, 2],  range: 0,  speed: 0.90, rof: 2.0,  los: 5,  train: 16 },
  'Centurión':               { hp: 110, attack: 13, armor: [2, 3],  range: 0,  speed: 1.35, rof: 1.9,  los: 4,  train: 24 },
  'Centurión Elite':         { hp: 155, attack: 15, armor: [3, 3],  range: 0,  speed: 1.35, rof: 1.9,  los: 4,  train: 24 },

  // Sarracenos
  'Mameluco':                { hp: 80,  attack: 8,  armor: [0, 0],  range: 3,  speed: 1.40, rof: 2.0,  los: 5,  train: 23 },
  'Mameluco Elite':          { hp: 80,  attack: 10, armor: [1, 0],  range: 3,  speed: 1.40, rof: 2.0,  los: 5,  train: 23 },

  // Sicilianos
  'Sargento':                { hp: 75,  attack: 8,  armor: [4, 2],  range: 0,  speed: 0.95, rof: 2.0,  los: 3,  train: 12 },
  'Sargento Elite':          { hp: 85,  attack: 11, armor: [6, 3],  range: 0,  speed: 0.95, rof: 2.0,  los: 5,  train: 12 },

  // Tártaros
  'Keshik':                  { hp: 120, attack: 9,  armor: [1, 2],  range: 0,  speed: 1.40, rof: 1.9,  los: 5,  train: 17 },
  'Keshik Elite':            { hp: 145, attack: 11, armor: [1, 3],  range: 0,  speed: 1.40, rof: 1.9,  los: 5,  train: 15 },

  // Turcos
  'Jenízaro':                { hp: 35,  attack: 17, armor: [1, 0],  range: 8,  speed: 0.96, rof: 3.45, los: 10, train: 17 },
  'Jenízaro Elite':          { hp: 40,  attack: 22, armor: [2, 0],  range: 8,  speed: 0.96, rof: 3.45, los: 10, train: 17 },

  // Vietnamitas
  'Rattan Archer':           { hp: 35,  attack: 6,  armor: [0, 4],  range: 4,  speed: 1.10, rof: 2.0,  los: 6,  train: 16 },
  'Rattan Archer Elite':     { hp: 40,  attack: 7,  armor: [0, 6],  range: 5,  speed: 1.10, rof: 2.0,  los: 7,  train: 13 },

  // Mapuche
  'Kona':                    { hp: 125, attack: 9,  armor: [0, 3],  range: 0,  speed: 1.55, rof: 2.0,  los: 5,  train: 14 },
  'Kona Elite':              { hp: 145, attack: 11, armor: [5, 6],  range: 0,  speed: 1.55, rof: 2.0,  los: 5,  train: 14 },
  'Bolas Rider':             { hp: 55,  attack: 5,  armor: [0, 1],  range: 4,  speed: 1.50, rof: 2.0,  los: 7,  train: 34 },
  'Bolas Rider Elite':       { hp: 65,  attack: 6,  armor: [0, 2],  range: 5,  speed: 1.50, rof: 2.0,  los: 7,  train: 28 },

  // Muisca
  'Guerrero Guecha':         { hp: 45,  attack: 4,  armor: [0, 2],  range: 4,  speed: 0.96, rof: 2.0,  los: 6,  train: 25 },
  'Guerrero Guecha Elite':   { hp: 55,  attack: 5,  armor: [0, 2],  range: 5,  speed: 0.96, rof: 2.0,  los: 7,  train: 25 },
  'Guardia del Templo':      { hp: 100, attack: 12, armor: [1, 1],  range: 0,  speed: 0.95, rof: 2.0,  los: 5,  train: 28 },
  'Guardia del Templo Elite':{ hp: 115, attack: 14, armor: [2, 2],  range: 0,  speed: 0.95, rof: 2.0,  los: 6,  train: 24 },

  // Tupí
  'Arquero de Madera Negra':       { hp: 35, attack: 4,  armor: [0, 0], range: 4, speed: 0.96, rof: 2.0, los: 6, train: 25 },
  'Arquero de Madera Negra Elite': { hp: 45, attack: 5,  armor: [0, 0], range: 5, speed: 0.96, rof: 2.0, los: 7, train: 25 },
  'Guerrero Ibirapema':            { hp: 80, attack: 8,  armor: [2, 1], range: 0, speed: 1.00, rof: 2.0, los: 5, train: 24 },
  'Guerrero Ibirapema Elite':      { hp: 90, attack: 11, armor: [2, 1], range: 0, speed: 1.00, rof: 2.0, los: 5, train: 24 },

  // Champi (slot de castillo)
  'Champi Warrior':          { hp: 50,  attack: 7,  armor: [0, 2],  range: 0,  speed: 1.20, rof: 2.0,  los: 6,  train: 30 },

  // Jurchens
  'Pagoda de Hierro':        { hp: 115, attack: 12, armor: [1, 3],  range: 0,  speed: 1.40, rof: 1.728, los: 5, train: 14 },
  'Pagoda de Hierro Elite':  { hp: 140, attack: 13, armor: [2, 3],  range: 0,  speed: 1.40, rof: 1.728, los: 5, train: 14 },

  // Wu
  'Arquero de Fuego':        { hp: 35,  attack: 4,  armor: [0, 0],  range: 5,  speed: 0.96, rof: 3.5,   los: 10, train: 17,
    bonuses: [{ vs: 'standard_buildings', value: 4 }, { vs: 'ships', value: 3 }, { vs: 'fishing_ships', value: 3 }, { vs: 'spearmen', value: 2 }, { vs: 'siege', value: 1 }] },
  'Arquero de Fuego Elite':  { hp: 40,  attack: 5,  armor: [0, 0],  range: 6,  speed: 0.96, rof: 3.5,   los: 11, train: 17,
    bonuses: [{ vs: 'standard_buildings', value: 4 }, { vs: 'ships', value: 4 }, { vs: 'fishing_ships', value: 4 }, { vs: 'spearmen', value: 2 }, { vs: 'siege', value: 1 }] },

  // Khitanos
  'Liao Dao':                { hp: 75,  attack: 9,  armor: [3, 1],  range: 0,  speed: 1.00, rof: 2.4,  los: 3,  train: 12,
    bonuses: [{ vs: 'shock_infantry', value: 2 }, { vs: 'standard_buildings', value: 2 }, { vs: 'archers', value: 2 }] },
  'Liao Dao Elite':          { hp: 85,  attack: 13, armor: [3, 1],  range: 0,  speed: 1.00, rof: 2.4,  los: 3,  train: 12,
    bonuses: [{ vs: 'shock_infantry', value: 3 }, { vs: 'standard_buildings', value: 3 }, { vs: 'archers', value: 2 }] },

  // Wei
  'Caballería Tigre':        { hp: 115, attack: 11, armor: [0, 4],  range: 0,  speed: 1.35, rof: 1.9,  los: 5,  train: 15,
    bonuses: [{ vs: 'archers', value: 6 }, { vs: 'siege', value: 2 }] },
  'Caballería Tigre Elite':  { hp: 130, attack: 13, armor: [0, 5],  range: 0,  speed: 1.35, rof: 1.9,  los: 5,  train: 15,
    bonuses: [{ vs: 'archers', value: 7 }, { vs: 'siege', value: 2 }] },

  // Shu
  'Liu Bei':                         { hp: 425, attack: 15, armor: [3, 3],  range: 0,  speed: 0.90, rof: 2.0,  los: 5,  train: 60 },
  'Guardián de Pluma Blanca':        { hp: 95,  attack: 7,  armor: [0, 2],  range: 0,  speed: 0.95, rof: 2.0,  los: 4,  train: 11,
    bonuses: [{ vs: 'cavalry', value: 8 }, { vs: 'elephants', value: 8 }, { vs: 'camel_units', value: 6 }, { vs: 'shock_infantry', value: 4 }, { vs: 'standard_buildings', value: 2 }] },
  'Guardián de Pluma Blanca Elite':  { hp: 100, attack: 8,  armor: [0, 3],  range: 0,  speed: 0.95, rof: 2.0,  los: 5,  train: 11,
    bonuses: [{ vs: 'cavalry', value: 8 }, { vs: 'elephants', value: 8 }, { vs: 'camel_units', value: 7 }, { vs: 'shock_infantry', value: 4 }, { vs: 'standard_buildings', value: 2 }] },
};

export { UNIT_STATS, REGIONAL_UNIT_STATS, UNIQUE_UNIT_STATS };
