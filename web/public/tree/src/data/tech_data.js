// ═══════════════════════════════════════════════════════════════════════════
// TECH DATA  — combined scope + modifiers for every technology
// ═══════════════════════════════════════════════════════════════════════════
//
// Each entry:
//   affects  – array of unit IDs / class names this tech applies to
//   mod      – stat deltas (omitted for techs with no numeric stat change)
//
// mod field reference:
//   hp                          Flat HP increase
//   hp_pct                      HP % increase  (10 = +10 %)
//   attack                      Flat attack increase
//   attack_pct                  Attack % increase  (25 = +25 %)
//   armor_melee                 Flat melee armor increase
//   armor_pierce                Flat pierce armor increase
//   range                       Flat range increase
//   speed_pct                   Movement speed % faster  (10 = +10 %)
//   attack_speed_pct            Attack speed % faster  (33 = fires 33 % faster → ROF × 0.75)
//   production_speed_pct        Unit training % faster
//   build_speed_pct             Building construction % faster
//   vs_X_attack                 Bonus attack vs unit class X
//   vs_building_attack_pct      Bonus attack % vs buildings
//   additional_projectiles      Extra projectiles fired per shot
//   trample_damage              Flat trample damage to adjacent units
//   trample_damage_pct          Trample damage as % of base attack
//   trample_radius              Trample blast radius (tiles)
//   regeneration_per_minute     HP regeneration per minute
//   cost_pct                    All-resource cost % change  (-15 = −15 % all resources)
//   food_cost_pct               Food cost % change
//   wood_cost_pct               Wood cost % change
//   gold_cost_pct               Gold cost % change
//   stone_cost_pct              Stone cost % change
//   trade_cost_pct              Trade unit cost % change
//   replace_gold_with_food      Gold cost replaced by food cost (1:1)
//   replace_gold_with_wood      Gold cost replaced by wood cost (approx. 1:1)
//   ignore_armor                Attacks ignore armor
//   minimum_range               Minimum attack range override (0 = no minimum)
//   accuracy_vs_stationary      Accuracy vs stationary targets (%)
//   accuracy                    Flat accuracy value (%)
//   blast_radius                Flat blast radius increase
//   passive_effect              Non-stat mechanic — string tag for UI/tooltip

export const UNIT_CLASSES = {
  // --- Clases Base ---
  'infantry': [
    'militia', 'manatarms', 'longsword', 'twohanded', 'champion',
    'spearman', 'pikeman', 'halberdier',
    'eaglescout', 'eaglewarrior', 'eliteeagle',
    'condottiero', 'flemish_militia', 'gbeto', 'woad_raider', 'shotel', 'karambit', 'obuch',
    'fire_lancer', 'elite_fire_lancer',
    'champiscout', 'champirunner', 'champiwarrior', 'elitechampi',
    'jian_swordsman', 'warrior_priest'
  ],
  'mounted': [
    'scout', 'lightcav', 'hussar', 'winged_hussar', 'knight', 'cavalier', 'paladin', 'savar',
    'camel', 'heavycamel', 'imp_camel', 'battleeleph', 'eliteeleph', 'steppe_lancer', 'elite_steppe_lancer',
    'cavarcher', 'hcavarcher', 'elephant_archer', 'elite_elephant_archer', 'genitour', 'missionary',
    'hei_guang', 'heavy_hei_guang', 'war_chariot_s', 'xianbei_raider', 'bolas_rider', 'elite_bolas_rider',
    'armored_elephant', 'siege_elephant'
  ],
  'archer': [
    'archer', 'crossbow', 'arbalester', 'skirmisher', 'eliteskirm', 'imp_skirmisher',
    'cavarcher', 'hcavarcher', 'elephant_archer', 'elite_elephant_archer', 'genitour', 'handcannon',
    'slinger', 'bolas_rider', 'elite_bolas_rider'
  ],
  'siege': [
    'batteringram', 'cappedram', 'siegeram', 'mangonel', 'onager', 'siegeonager',
    'scorpion', 'heavyscorpion', 'bombcannon', 'trebuchet', 'petard',
    'rocket_cart', 'heavy_rocket_cart', 'traction_treb', 'war_chariot_s'
  ],
  'navy': [
    'galley', 'wargalley', 'galleon', 'firegalley', 'fireship', 'fastfireship',
    'demoraft', 'demoship', 'heavydemo', 'cannongalleon', 'elitecannon',
    'hulk', 'war_hulk', 'carrack',
    'dromon', 'turtle_ship', 'longboat', 'carvel_hull', 'lou_chuan'
  ],
  'civilians': [
    'villager', 'tradecart', 'tradecog', 'fishingship'
  ],
  'religious': [
    'monk', 'missionary', 'warrior_priest'
  ],

  // --- Sub-clases y Combinaciones ---
  'foot_archer': [
    'archer', 'crossbow', 'arbalester', 'skirmisher', 'eliteskirm', 'imp_skirmisher',
    'slinger'
  ],
  'mounted_archer': [
    'cavarcher', 'hcavarcher', 'elephant_archer', 'elite_elephant_archer', 'genitour',
    'xianbei_raider', 'bolas_rider', 'elite_bolas_rider'
  ],
  'cavalry': [
    'scout', 'lightcav', 'hussar', 'winged_hussar', 'knight', 'cavalier', 'paladin', 'savar',
    'camel', 'heavycamel', 'imp_camel', 'battleeleph', 'eliteeleph', 'steppe_lancer', 'elite_steppe_lancer',
    'hei_guang', 'heavy_hei_guang', 'war_chariot_s',
    'armored_elephant', 'siege_elephant'
  ],
  'skirmishers': [
    'skirmisher', 'eliteskirm', 'imp_skirmisher', 'genitour', 'slinger'
  ],
  'gunpowder': [
    'handcannon', 'bombcannon', 'cannongalleon', 'elitecannon', 'bombardtower', 'janissary', 'conquistador',
    'rocket_cart', 'heavy_rocket_cart'
  ],
  // Ranged siege units that fire projectiles — used by Chemistry (+1 attack)
  'ranged_siege': [
    'mangonel', 'onager', 'siegeonager', 'scorpion', 'heavyscorpion', 'trebuchet'
  ],
  'trade_units': [
    'tradecart', 'tradecog'
  ],
  'buildings': [
    'watchtower', 'guardtower', 'keep', 'bombardtower', 'castle', 'fortified_church', 'tc', 'krepost', 'donjon'
  ],

  // --- Clases de Edificios ---
  'towers': [
    'watchtower', 'guardtower', 'keep', 'bombardtower'
  ],
  'castles': [
    'castle', 'krepost', 'donjon'
  ],
  'town_centers': [
    'tc'
  ],
  'walls': [
    'stonewall', 'gate', 'fortifiedwall'
  ]
};

/**
 * Clasificación de Unidades Únicas por Clase.
 * Se usa para determinar si la UU de una civilización debe mostrarse en "Afecta a".
 * Las claves deben coincidir con los nombres en Spanish (que es como se indexan en UNIQUE_UNIT_STATS).
 */
export const UNIQUE_UNIT_CLASSES = {
  'Longbowman': ['archer', 'foot_archer'],
  'Catafracto': ['cavalry', 'mounted'],
  'Guerrero Jaguar': ['infantry'],
  'Arqueros con arco compuesto': ['archer', 'foot_archer'],
  'Sacerdotes guerreros': ['infantry', 'religious'],
  'Hacha Arrojadiza': ['infantry'],
  'Samurái': ['infantry'],
  'Berserk': ['infantry'],
  'Tarkán': ['cavalry', 'mounted'],
  'Conquistador': ['mounted_archer', 'gunpowder', 'mounted'],
  'Caballero Teutónico': ['infantry'],
  'Boyar': ['cavalry', 'mounted'],
  'Balistario': ['siege', 'mounted'],
  'Ballestero Genovés': ['archer', 'foot_archer'],
  'Chu Ko Nu': ['archer', 'foot_archer'],
  'Arquero de Plumas': ['archer', 'foot_archer'],
  'Mangudai': ['mounted_archer', 'mounted'],
  'Elefante de Guerra': ['cavalry', 'mounted'],
  'Órgano de Cañones': ['siege', 'gunpowder'],
  'Ratha': ['mounted_archer', 'cavalry', 'mounted'],
  'Arquero en Camello': ['mounted_archer', 'mounted'],
  'Arambai': ['mounted_archer', 'mounted'],
  'Carro Husita': ['siege', 'gunpowder'],
  'Coustillier': ['cavalry', 'mounted'],
  'Konnik': ['cavalry', 'mounted'],
  'Woad Raider': ['infantry'],
  'Kipchak': ['mounted_archer', 'mounted'],
  'Urumi Swordsman': ['infantry'],
  'Guerrero Shotel': ['infantry'],
  'Monaspa': ['cavalry', 'mounted'],
  'Chakram Thrower': ['infantry'],
  'Ghulam': ['infantry'],
  'Kamayuk': ['infantry'],
  'Leitis': ['cavalry', 'mounted'],
  'Huszar Magiar': ['cavalry', 'mounted'],
  'Karambit Warrior': ['infantry'],
  'Gbeto': ['infantry'],
  'Obuch': ['infantry'],
  'Legionario': ['infantry'],
  'Centurión': ['cavalry', 'mounted'],
  'Mameluco': ['cavalry', 'mounted'],
  'Sargento': ['infantry'],
  'Keshik': ['cavalry', 'mounted'],
  'Jenízaro': ['foot_archer', 'gunpowder'],
  'Rattan Archer': ['archer', 'foot_archer'],
  'Kona': ['cavalry', 'mounted'],
  'Bolas Rider': ['mounted_archer', 'mounted'],
  'Guerrero Guecha': ['archer', 'foot_archer'],
  'Guardia del Templo': ['infantry'],
  'Arquero de Madera Negra': ['archer', 'foot_archer'],
  'Guerrero Ibirapema': ['infantry'],
  'Champi Warrior': ['infantry'],
  'Pagoda de Hierro': ['cavalry', 'mounted'],
  'Arquero de Fuego': ['archer', 'foot_archer'],
  'Liao Dao': ['infantry'],
  'Caballería Tigre': ['cavalry', 'mounted'],
  'Guardián de Pluma Blanca': ['infantry'],
  'Liu Bei': ['infantry']
};

export const TECHS = {

  // ── BLACKSMITH — Infantry / Cavalry Attack ────────────────────────────────
  'forging':      { affects: ['infantry', 'cavalry', 'hulk', 'war_hulk', 'carrack'],  mod: { attack: 1 } },
  'ironcasting':  { affects: ['infantry', 'cavalry', 'hulk', 'war_hulk', 'carrack'],  mod: { attack: 1 } },
  'blastfurnace': { affects: ['infantry', 'cavalry', 'hulk', 'war_hulk', 'carrack'],  mod: { attack: 2 } },

  // ── BLACKSMITH — Archer / Building / Ship Attack ──────────────────────────
  'fletching':   { affects: ['foot_archer', 'mounted_archer', 'buildings', 'galley', 'wargalley', 'galleon', 'lou_chuan'], mod: { attack: 1, range: 1 } },
  'bodkinarrow': { affects: ['foot_archer', 'mounted_archer', 'buildings', 'galley', 'wargalley', 'galleon', 'lou_chuan'], mod: { attack: 1, range: 1 } },
  'bracer':      { affects: ['foot_archer', 'mounted_archer', 'buildings', 'galley', 'wargalley', 'galleon', 'lou_chuan'], mod: { attack: 1, range: 1 } },

  // ── BLACKSMITH — Infantry Armor ───────────────────────────────────────────
  'scalemailarmor': { affects: ['infantry'], mod: { armor_melee: 1, armor_pierce: 1 } },
  'chainmailarmor': { affects: ['infantry'], mod: { armor_melee: 1, armor_pierce: 1 } },
  'platemailarmor': { affects: ['infantry'], mod: { armor_melee: 2, armor_pierce: 1 } },

  // ── BLACKSMITH — Cavalry Armor ────────────────────────────────────────────
  'scalebarding': { affects: ['cavalry'], mod: { armor_melee: 1, armor_pierce: 1 } },
  'chainbarding': { affects: ['cavalry'], mod: { armor_melee: 1, armor_pierce: 1 } },
  'platebarding': { affects: ['cavalry'], mod: { armor_melee: 2, armor_pierce: 1 } },

  // ── BLACKSMITH — Archer Armor ─────────────────────────────────────────────
  'paddedarcharmor':  { affects: ['foot_archer', 'mounted_archer', 'handcannon', 'grenadier'], mod: { armor_melee: 1, armor_pierce: 1 } },
  'leatherarcharmor': { affects: ['foot_archer', 'mounted_archer', 'handcannon', 'grenadier'], mod: { armor_melee: 1, armor_pierce: 1 } },
  'ringarcherarmor':  { affects: ['foot_archer', 'mounted_archer', 'handcannon', 'grenadier'], mod: { armor_melee: 1, armor_pierce: 2 } },

  // ── STABLE ────────────────────────────────────────────────────────────────
  'bloodlines': { affects: ['mounted'], mod: { hp: 20 } },
  'husbandry':  { affects: ['mounted'], mod: { speed_pct: 10 } },

  // ── BARRACKS ──────────────────────────────────────────────────────────────
  'squires':   { affects: ['infantry'], mod: { speed_pct: 10 } },
  'arson':     { affects: ['infantry'] },
  'gambesons': { affects: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion'], mod: { armor_pierce: 1 } },

  // ── ARCHERY RANGE ─────────────────────────────────────────────────────────
  'thumbring': {
    affects: ['foot_archer', 'mounted_archer'],
    mod: { attack_speed_pct: 17.65, accuracy_vs_stationary: 100 }
  },
  'parthian': {
    affects: ['mounted_archer'],
    mod: { armor_melee: 1, armor_pierce: 2, vs_spearman_attack: 2 }
  },

  // ── UNIVERSITY ────────────────────────────────────────────────────────────
  'ballistics': {
    affects: ['foot_archer', 'mounted_archer', 'buildings', 'navy', 'siege', 'grenadier'],
    mod: { passive_effect: 'accuracy_moving_targets' }
  },
  'chemistry': {
    affects: ['foot_archer', 'mounted_archer', 'gunpowder', 'ranged_siege', 'buildings', 'navy', 'traction_treb', 'war_chariot_s'],
    mod: { attack: 1, passive_effect: 'enables_gunpowder' }
  },
  'siegeengineers': {
    affects: ['siege', 'armored_elephant', 'siege_elephant', 'lou_chuan', 'grenadier'],
    mod: {
      range:                             1,
      vs_building_attack_pct:           20,
      demolition_vs_building_attack_pct: 40
    }
  },
  'masonry':      { affects: ['buildings'], mod: { hp_pct: 10, armor_melee: 1, armor_pierce: 1, building_armor: 3 } },
  'architecture': { affects: ['buildings'], mod: { hp_pct: 10, armor_melee: 1, armor_pierce: 1, building_armor: 3 } },
  'fortifiedwall': { affects: ['walls'] },
  'guardtower':    { affects: ['watchtower'] },
  'keep':          { affects: ['guardtower'] },
  'bombardtower':  { affects: ['keep'] },
  'arrowslits': {
    affects: ['watchtower', 'guardtower', 'keep'],
    mod: { watchtower_attack: 1, guardtower_attack: 2, keep_attack: 3 }
  },
  'murderhole': {
    affects: ['buildings'],
    mod: { passive_effect: 'removes_minimum_range' }
  },
  'heatedshot': {
    affects: ['towers', 'town_centers', 'fortified_church'],
    mod: { attack: 3, passive_effect: 'vs_ships_attack_bonus' }
  },
  'hoardings': { affects: ['castles'], mod: { hp: 1500 } },

  // ── UNIVERSITY — Naval (also listed under Dock below) ────────────────────
  'careening':           { affects: ['navy', 'fishingship', 'tradecog'], mod: { armor_pierce: 1, transport_hp: 100 } },
  'drydock':             { affects: ['navy', 'fishingship', 'tradecog'], mod: { speed_pct: 15 } },
  'clinker_construction':{ affects: ['navy', 'fishingship', 'tradecog'], mod: { speed_pct: 10 } },
  'carvel_hull':         { affects: ['navy', 'fishingship', 'tradecog'], mod: { speed_pct: 10 } },
  'siphons':      { affects: ['firegalley', 'fireship', 'fastfireship'], mod: { passive_effect: 'charge_attack' } },
  'incendiaries': { affects: ['firegalley', 'fireship', 'fastfireship'], mod: { passive_effect: 'death_explosion' } },

  // ── DOCK ──────────────────────────────────────────────────────────────────
  'shipwright':    { affects: ['navy', 'fishingship', 'tradecog'], mod: { cost_pct: -20, production_speed_pct: 54 } },
  'fishing_lines': { affects: ['fishingship'],                     mod: { gather_speed_pct: 10, carry_capacity: 5 } },
  'gillnets':      { affects: ['fishingship'],                     mod: { gather_speed_pct: 10, carry_capacity: 5 } },

  // ── MONASTERY ─────────────────────────────────────────────────────────────
  'sanctity':      { affects: ['monk', 'warrior_priest'], mod: { hp: 15 } },
  'fervor':        { affects: ['monk', 'warrior_priest'], mod: { speed_pct: 15 } },
  'theocracy':     { affects: ['monk'] },
  'blockprinting': { affects: ['monk'] },
  'redemption':    { affects: ['monk'] },
  'atonement':     { affects: ['monk'] },
  'heresy':        { affects: ['monk'] },
  'herbalmedicine':{ affects: ['monk'] },
  'devotion':      { affects: ['monk'] },
  'illumination':  { affects: ['monk'] },
  'faith':         { affects: ['monk'] },

  // ── TOWN CENTER ───────────────────────────────────────────────────────────
  'loom':          { affects: ['villager'], mod: { hp: 15, armor_melee: 1, armor_pierce: 2 } },
  'wheelbarrow':   { affects: ['villager'], mod: { speed_pct: 10 } },
  'handcart':      { affects: ['villager'], mod: { speed_pct: 10 } },
  'treadmillcrane':{ affects: ['buildings', 'villager'], mod: { build_speed_pct: 20 } },

  // ── MARKET ────────────────────────────────────────────────────────────────
  'caravan': { affects: ['tradecart', 'tradecog'] },

  // ── CASTLE ────────────────────────────────────────────────────────────────
  'conscription': {
    affects: ['infantry', 'foot_archer', 'mounted_archer', 'cavalry'],
    mod: { production_speed_pct: 33 }
  },
  'sappers': {
    affects: ['villager'],
    mod: {
      vs_bonuses: [
        { vs: 'stone_defense', add: 15 },
        { vs: 'all_buildings', add: 15 },
        { vs: 'rams',          add: 3  }
      ]
    }
  },

  // ── MULE CART (Armenians & Georgians — replaces Lumber/Mining camp techs) ──
  // Standard effectiveness; Armenians apply ×1.4 via tech_effectiveness bonus.
  'doublebitaxe_m': { affects: ['villager'], mod: { gather_speed_pct: 20 } },
  'bowsaw_m':       { affects: ['villager'], mod: { gather_speed_pct: 20 } },
  'twomansaw_m':    { affects: ['villager'], mod: { gather_speed_pct: 10 } },
  'goldmining_m':   { affects: ['villager'], mod: { gather_speed_pct: 15 } },
  'goldshaft_m':    { affects: ['villager'], mod: { gather_speed_pct: 15 } },
  'stonemining_m':  { affects: ['villager'], mod: { gather_speed_pct: 15 } },
  'stoneshaft_m':   { affects: ['villager'], mod: { gather_speed_pct: 15 } },

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIQUE TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  // Armenians ────────────────────────────────────────────────────────────────
  'armenians_uniquetech1': {  // Cilician Fleet
    affects: ['demoship', 'galley', 'wargalley', 'galleon', 'dromon'],
    mod: { range: 1, demolition_blast_radius_pct: 20 }
  },
  'armenians_uniquetech2': {  // Fereters
    affects: ['infantry', 'warrior_priest'],
    mod: { hp: 30, heal_speed_pct: 100 }
  },

  // Aztecs ───────────────────────────────────────────────────────────────────
  'aztecs_uniquetech1': { affects: ['skirmishers'], mod: { attack: 1, range: 1 } },  // Atlatl
  'aztecs_uniquetech2': { affects: ['infantry'],    mod: { attack: 4 } },             // Garland Wars

  // Bengalis ─────────────────────────────────────────────────────────────────
  'bengalis_uniquetech1': {  // Paiks
    affects: ['ratha', 'battleeleph', 'eliteeleph', 'elephant_archer', 'elite_elephant_archer'],
    mod: { attack_speed_pct: 20 }
  },
  'bengalis_uniquetech2': {  // Mahayana
    affects: ['civilians', 'religious'],
    mod: { passive_effect: 'pop_space_reduction' }
  },

  // Berbers ──────────────────────────────────────────────────────────────────
  'berbers_uniquetech1': {  // Kasbah
    affects: ['castle'],
    mod: { production_speed_pct: 25, passive_effect: 'team_castle_work_speed' }
  },
  'berbers_uniquetech2': {  // Maghrebi Camels
    affects: ['camel', 'heavycamel', 'imp_camel'],
    mod: { regeneration_per_minute: 15 }
  },

  // Bohemians ────────────────────────────────────────────────────────────────
  'bohemians_uniquetech1': {  // Wagenburg Tactics
    affects: ['handcannon', 'bombcannon', 'houfnice', 'cannongalleon', 'elitecannon'],
    mod: { speed_pct: 15 }
  },
  'bohemians_uniquetech2': {  // Hussite Reforms
    affects: ['religious'],
    mod: { replace_gold_with_food: true }
  },

  // Britons ──────────────────────────────────────────────────────────────────
  'britons_uniquetech1': {  // Yeomen
    affects: ['foot_archer', 'watchtower', 'guardtower', 'keep'],
    mod: { range: 1, watchtower_attack: 2, guardtower_attack: 2, keep_attack: 2 }
  },
  'britons_uniquetech2': {  // Warwolf
    affects: ['trebuchet'],
    mod: { accuracy: 100, blast_radius: 0.5 }
  },

  // Bulgarians ───────────────────────────────────────────────────────────────
  'bulgarians_uniquetech1': { affects: ['cavalry'],                                                   mod: { attack_speed_pct: 33 } },  // Stirrups
  'bulgarians_uniquetech2': { affects: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion'], mod: { armor_melee: 5 } },         // Bagains

  // Burgundians ──────────────────────────────────────────────────────────────
  'burgundians_uniquetech1': { affects: ['civilians'] },       // Burgundian Vineyards (passive economy effect)
  'burgundians_uniquetech2': { affects: ['flemish_militia'] }, // Flemish Revolution (spawns militia, passive)

  // Burmese ──────────────────────────────────────────────────────────────────
  'burmese_uniquetech1': { affects: ['cavalry'], mod: { vs_bonuses: [{ vs: 'archers', add: 4 }] } }, // Manipur Cavalry
  'burmese_uniquetech2': { affects: ['battleeleph', 'eliteeleph'], mod: { armor_melee: 1, armor_pierce: 1 } }, // Howdah

  // Byzantines ───────────────────────────────────────────────────────────────
  'byzantines_uniquetech1': {  // Greek Fire
    affects: ['firegalley', 'fireship', 'fastfireship', 'bombardtower', 'dromon'],
    mod: { range: 1, passive_effect: 'dromons_tower_blast_radius' }
  },
  'byzantines_uniquetech2': {  // Logistica
    affects: ['uniqueunit', 'eliteunique'],
    mod: { vs_bonuses: [{ vs: 'infantry', add: 6 }], passive_effect: 'cataphract_trample_damage' }
  },

  // Celts ────────────────────────────────────────────────────────────────────
  'celts_uniquetech1': {  // Stronghold
    affects: ['castle', 'watchtower', 'guardtower', 'keep'],
    mod: { attack_speed_pct: 33, passive_effect: 'castle_heals_infantry' }
  },
  'celts_uniquetech2': { affects: ['siege'], mod: { hp_pct: 40 } },  // Furor Celtica

  // Chinese ──────────────────────────────────────────────────────────────────
  'chinese_uniquetech1': {  // Great Wall
    affects: ['walls', 'watchtower', 'guardtower', 'keep', 'bombardtower'],
    mod: { hp_pct: 30 }
  },
  'chinese_uniquetech2': {  // Rocketry
    affects: ['scorpion', 'heavyscorpion', 'rocket_cart', 'heavy_rocket_cart', 'lou_chuan'],
    mod: { attack_pct: 25, passive_effect: 'rocket_projectiles' }
  },

  // Cumans ───────────────────────────────────────────────────────────────────
  'cumans_uniquetech1': {  // Steppe Husbandry
    affects: ['scout', 'lightcav', 'hussar', 'steppe_lancer', 'elite_steppe_lancer', 'cavarcher', 'hcavarcher'],
    mod: { production_speed_pct: 100 }
  },
  'cumans_uniquetech2': {  // Cuman Mercenaries
    affects: ['castle'],
    mod: { passive_effect: 'free_elite_kipchaks' }
  },

  // Dravidians ───────────────────────────────────────────────────────────────
  'dravidians_uniquetech1': {  // Medical Corps
    affects: ['battleeleph', 'eliteeleph', 'elephant_archer', 'elite_elephant_archer'],
    mod: { regeneration_per_minute: 30 }
  },
  'dravidians_uniquetech2': { affects: ['infantry'], mod: { ignore_armor: true } },  // Wootz Steel

  // Ethiopians ───────────────────────────────────────────────────────────────
  'ethiopians_uniquetech1': {  // Royal Heirs
    affects: ['uniqueunit', 'eliteunique'],
    mod: { damage_reduction_vs_mounted: 3 }
  },
  'ethiopians_uniquetech2': {  // Torsion Engines
    affects: ['siege'],
    mod: { blast_radius: 0.45, passive_effect: 'siege_blast_radius_increase' }
  },

  // Franks ───────────────────────────────────────────────────────────────────
  'franks_uniquetech1': { affects: ['uniqueunit', 'eliteunique'], mod: { range: 2 } },              // Bearded Axe
  'franks_uniquetech2': { affects: ['stable'],                    mod: { production_speed_pct: 40 } }, // Chivalry

  // Georgians ────────────────────────────────────────────────────────────────
  'georgians_uniquetech1': {  // Svan Towers
    affects: ['buildings'],
    mod: { attack: 2, passive_effect: 'tower_pass_through_damage' }
  },
  'georgians_uniquetech2': {  // Aznauri Cavalry
    affects: ['cavalry'],
    mod: { passive_effect: 'cavalry_pop_reduction' }
  },

  // Goths ────────────────────────────────────────────────────────────────────
  'goths_uniquetech1': { affects: ['barracks'], mod: { passive_effect: 'huskarls_at_barracks' } }, // Anarchy
  'goths_uniquetech2': { affects: ['barracks'], mod: { production_speed_pct: 100 } },               // Perfusion

  // Gurjaras ─────────────────────────────────────────────────────────────────
  'gurjaras_uniquetech1': { affects: ['infantry'],                                                        mod: { food_cost_pct: -25 } }, // Kshatriyas
  'gurjaras_uniquetech2': { affects: ['camel', 'heavycamel', 'elephant_archer', 'elite_elephant_archer'], mod: { armor_melee: 4 } },    // Frontier Guards

  // Hindustanis ──────────────────────────────────────────────────────────────
  'hindustanis_uniquetech1': {  // Grand Trunk Road
    affects: ['civilians', 'trade_units', 'religious'],
    mod: { gold_generation_pct: 10, market_fee_pct: 10 }
  },
  'hindustanis_uniquetech2': { affects: ['handcannon'], mod: { range: 2 } },  // Shatagni

  // Huns ─────────────────────────────────────────────────────────────────────
  'huns_uniquetech1': { affects: ['stable'] },    // Marauders (Tarkans trainable at Stable, passive)
  'huns_uniquetech2': { affects: ['religious'] }, // Atheism (relic/wonder timers, passive)

  // Incas ────────────────────────────────────────────────────────────────────
  'incas_uniquetech1': {  // Andean Sling
    affects: ['skirmishers', 'slinger'],
    mod: { attack: 1, minimum_range: 0 }
  },
  'incas_uniquetech2': {  // Fabric Shields
    affects: ['uniqueunit', 'eliteunique', 'champiscout', 'champirunner', 'champiwarrior', 'elitechampi'],
    mod: { armor_melee: 1, armor_pierce: 1 }
  },
  'champiscout_innate': {  // Champi Scout inherent attack bonuses vs specific armor classes
    affects: ['champiscout'],
    mod: {
      vs_bonuses: [
        { vs: 'cavalry', add: 1 },
        { vs: 'camel_units', add: 1 },
        { vs: 'shock_infantry', add: 3 }
      ]
    }
  },

  // Italians ─────────────────────────────────────────────────────────────────
  'italians_uniquetech1': { affects: ['trade_units'], mod: { trade_cost_pct: -50 } },  // Silk Road
  'italians_uniquetech2': {                                                              // Pirotechnia
    affects: ['handcannon'],
    mod: { pass_through_damage_pct: 15, accuracy: 90 }
  },

  // Japanese ─────────────────────────────────────────────────────────────────
  'japanese_uniquetech1': { affects: ['watchtower', 'guardtower', 'keep'], mod: { additional_projectiles: 2 } }, // Yasama
  'japanese_uniquetech2': {  // Kataparuto
    affects: ['trebuchet'],
    mod: { attack_speed_pct: 33, pack_time: 3 }
  },

  // Jurchens ─────────────────────────────────────────────────────────────────
  'jurchens_uniquetech1': { affects: ['buildings'],                                              mod: { regeneration_per_minute: 500 } },      // Fortified Bastions
  'jurchens_uniquetech2': { affects: ['grenadier', 'navy', 'rocket_cart', 'heavy_rocket_cart'], mod: { passive_effect: 'thunderclap_bombs' } }, // Thunderclap Bombs

  // Khitans ──────────────────────────────────────────────────────────────────
  'khitans_uniquetech1': { affects: ['infantry'], mod: { reflect_damage_pct: 25 } },                             // Lamellar Armor
  'khitans_uniquetech2': { affects: ['cavalry'],  mod: { passive_effect: 'ordo_cavalry_combat_regen' } },        // Ordo Cavalry

  // Khmer ────────────────────────────────────────────────────────────────────
  'khmer_uniquetech1': { affects: ['battleeleph', 'eliteeleph'],                              mod: { attack: 3 } },              // Tusk Swords
  'khmer_uniquetech2': { affects: ['uniqueunit', 'eliteunique', 'scorpion', 'heavyscorpion'], mod: { additional_projectiles: 1 } }, // Double Crossbow

  // Koreans ──────────────────────────────────────────────────────────────────
  'koreans_uniquetech1': { affects: ['watchtower', 'guardtower', 'keep'],      mod: { range: 2 } }, // Eupseong
  'koreans_uniquetech2': {  // Shinkichon
    affects: ['turtle_ship', 'rocket_cart', 'heavy_rocket_cart'],
    mod: { range: 1, additional_projectiles: 6 }
  },

  // Lithuanians ──────────────────────────────────────────────────────────────
  'lithuanians_uniquetech1': { affects: ['tc'],                                mod: { range: 3 } },        // Hill Forts
  'lithuanians_uniquetech2': { affects: ['spearman', 'pikeman', 'halberdier'], mod: { armor_pierce: 2 } }, // Tower Shields

  // Magyars ──────────────────────────────────────────────────────────────────
  'magyars_uniquetech1': { affects: ['uniqueunit', 'eliteunique'], mod: { replace_gold_with_food: true } }, // Corvinian Army
  'magyars_uniquetech2': { affects: ['mounted_archer'],             mod: { attack: 1, range: 1 } },          // Recurve Bow

  // Malay ────────────────────────────────────────────────────────────────────
  'malay_uniquetech1': { affects: ['dock'],                                                       mod: { passive_effect: 'docks_to_harbors' } }, // Thalassocracy
  'malay_uniquetech2': { affects: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion'], mod: { replace_gold_with_food: true } },        // Forced Levy

  // Malians ──────────────────────────────────────────────────────────────────
  'malians_uniquetech1': {  // Tigui
    affects: ['tc'],
    mod: { passive_effect: 'tc_fires_arrows', minimum_arrows: 8, maximum_arrows: 18 }
  },
  'malians_uniquetech2': { affects: ['cavalry'], mod: { attack: 5 } },  // Farimba

  // Mapuche ──────────────────────────────────────────────────────────────────
  'mapuche_uniquetech1': { affects: ['skirmishers'], mod: { pass_through_damage_pct: 30 } }, // Malon
  'mapuche_uniquetech2': { affects: ['castle'],      mod: { cost_pct: -15 } },               // Butalmapu

  // Mayans ───────────────────────────────────────────────────────────────────
  'mayans_uniquetech1': { affects: ['skirmishers'],                          mod: { additional_projectiles: 1 } }, // Hul'che Javelineers
  'mayans_uniquetech2': { affects: ['eaglescout', 'eaglewarrior', 'eliteeagle'], mod: { hp: 40 } },               // Holcans (El Dorado)

  // Mongols ──────────────────────────────────────────────────────────────────
  'mongols_uniquetech1': { affects: ['civilians'], mod: { passive_effect: 'nomad_pop' } }, // Nomads
  'mongols_uniquetech2': { affects: ['siege'],     mod: { speed_pct: 50 } },               // Drill

  // Muisca ───────────────────────────────────────────────────────────────────
  'muisca_uniquetech1': { affects: ['champiscout', 'champirunner', 'champiwarrior', 'elitechampi'], mod: { speed_pct: 15 } }, // Herbalism
  'muisca_uniquetech2': { affects: ['uniqueunit', 'eliteunique', 'slinger'],                        mod: { range: 1 } },      // Huaracas

  // Persians ─────────────────────────────────────────────────────────────────
  'persians_uniquetech1': { affects: ['archer', 'crossbow', 'arbalester'], mod: { replace_gold_with_wood: true } }, // Kamandaran
  'persians_uniquetech2': {  // Citadels
    affects: ['castle'],
    mod: { attack: 4, vs_bonuses: [{ vs: 'rams', add: 3 }, { vs: 'infantry', add: 3 }], damage_reduction_pct: 25 }
  },

  // Poles ────────────────────────────────────────────────────────────────────
  'poles_uniquetech1': { affects: ['knight', 'cavalier', 'paladin'],             mod: { gold_cost_pct: -60 } },              // Szlachta Privileges
  'poles_uniquetech2': { affects: ['scout', 'lightcav', 'hussar', 'winged_hussar'], mod: { trample_damage_pct: 33, trample_radius: 0.5 } }, // Lechitic Legacy

  // Portuguese ───────────────────────────────────────────────────────────────
  'portuguese_uniquetech1': {  // Circumnavigation
    affects: ['navy'],
    mod: { build_speed_pct: 33, passive_effect: 'map_explored' }
  },
  'portuguese_uniquetech2': {  // Arquebus
    affects: ['gunpowder'],
    mod: { passive_effect: 'gunpowder_accuracy_moving_targets' }
  },

  // Romans ───────────────────────────────────────────────────────────────────
  'romans_uniquetech1': {  // Ballistas
    affects: ['scorpion', 'heavyscorpion', 'galley', 'wargalley', 'galleon'],
    mod: { attack_speed_pct: 33, galley_attack: 2 }
  },
  'romans_uniquetech2': {  // Comitatenses
    affects: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion', 'knight', 'cavalier', 'paladin', 'uniqueunit', 'eliteunique'],
    mod: { production_speed_pct: 50, passive_effect: 'charge_attack' }
  },

  // Saracens ─────────────────────────────────────────────────────────────────
  'saracens_uniquetech1': {  // Bimaristan
    affects: ['monk'],
    mod: { passive_effect: 'monk_passive_heal', passive_heal_radius: 5, passive_heal_per_minute: 75 }
  },
  'saracens_uniquetech2': {  // Counterweights
    affects: ['trebuchet', 'mangonel', 'onager', 'siegeonager'],
    mod: { attack_pct: 15 }
  },

  // Shu ──────────────────────────────────────────────────────────────────────
  'shu_uniquetech1': {  // Coiled Serpent Array
    affects: ['spearman', 'pikeman', 'halberdier', 'uniqueunit', 'eliteunique'],
    mod: { passive_effect: 'proximity_hp_bonus', max_hp_pct: 15 }
  },
  'shu_uniquetech2': {  // Bolt Magazine
    affects: ['foot_archer', 'siege', 'navy'],
    mod: { additional_projectiles: 2 }
  },

  // Sicilians ────────────────────────────────────────────────────────────────
  'sicilians_uniquetech1': {  // First Crusade
    affects: ['tc', 'uniqueunit', 'eliteunique'],
    mod: { passive_effect: 'spawn_serjeants', conversion_resistance: true }
  },
  'sicilians_uniquetech2': { affects: ['knight', 'cavalier', 'paladin'], mod: { armor_melee: 1, armor_pierce: 2 } }, // Hauberk

  // Slavs ────────────────────────────────────────────────────────────────────
  'slavs_uniquetech1': {  // Detinets
    affects: ['castle', 'watchtower', 'guardtower', 'keep'],
    mod: { passive_effect: 'stone_to_wood_construction' }
  },
  'slavs_uniquetech2': { affects: ['infantry'], mod: { trample_damage: 5, trample_radius: 0.5 } }, // Druzhina

  // Spanish ──────────────────────────────────────────────────────────────────
  'spanish_uniquetech1': {  // Inquisition
    affects: ['monk', 'missionary'],
    mod: { passive_effect: 'faster_conversion', missionary_range: 1 }
  },
  'spanish_uniquetech2': {  // Supremacy
    affects: ['villager'],
    mod: { hp: 40, attack: 6, armor_melee: 2, armor_pierce: 2 }
  },

  // Tatars ───────────────────────────────────────────────────────────────────
  'tatars_uniquetech1': {  // Silk Armor
    affects: ['scout', 'lightcav', 'hussar', 'winged_hussar', 'steppe_lancer', 'elite_steppe_lancer', 'mounted_archer'],
    mod: { armor_melee: 1, armor_pierce: 1 }
  },
  'tatars_uniquetech2': { affects: ['trebuchet'], mod: { range: 2 } }, // Timurid Siegecraft

  // Teutons ──────────────────────────────────────────────────────────────────
  'teutons_uniquetech1': { affects: ['siege'],            mod: { armor_melee: 4 } },                                       // Ironclad
  'teutons_uniquetech2': { affects: ['castle', 'infantry'], mod: { range: 3, passive_effect: 'infantry_fire_arrows_garrisoned' } }, // Crenellations

  // Tupi ─────────────────────────────────────────────────────────────────────
  'tupi_uniquetech1': { affects: ['champiscout', 'champirunner', 'champiwarrior', 'elitechampi'], mod: { attack_speed_pct: 25 } },  // Caciques
  'tupi_uniquetech2': { affects: ['foot_archer', 'buildings'],                                    mod: { passive_effect: 'poison_damage' } }, // Curare

  // Turks ────────────────────────────────────────────────────────────────────
  'turks_uniquetech1': { affects: ['mounted_archer'],                              mod: { hp: 20 } },    // Sipahi
  'turks_uniquetech2': { affects: ['bombcannon', 'bombardtower', 'cannongalleon'], mod: { range: 2 } },  // Artillery

  // Vietnamese ───────────────────────────────────────────────────────────────
  'vietnamese_uniquetech1': { affects: ['battleeleph', 'eliteeleph'], mod: { hp: 100 } },                       // Chatras
  'vietnamese_uniquetech2': { affects: ['civilians'],                  mod: { passive_effect: 'wood_to_gold' } }, // Paper Money

  // Vikings ──────────────────────────────────────────────────────────────────
  'vikings_uniquetech1': {  // Chieftains
    affects: ['infantry'],
    mod: { vs_bonuses: [{ vs: 'cavalry', add: 5 }, { vs: 'camel_units', add: 4 }] }
  },
  'vikings_uniquetech2': { affects: ['foot_archer', 'longboat'], mod: { attack: 1 } }, // Bogsveigar

  // Wei ──────────────────────────────────────────────────────────────────────
  'wei_uniquetech1': { affects: ['infantry', 'archer', 'cavalry', 'siege', 'navy'], mod: { passive_effect: 'soldiers_produce_food' } }, // Tuntian
  'wei_uniquetech2': { affects: ['mounted'],                                          mod: { armor_melee: 4 } },                          // Ming Guang Armor

  // Wu ───────────────────────────────────────────────────────────────────────
  'wu_uniquetech1': { affects: ['demoship', 'uniqueunit', 'eliteunique'], mod: { passive_effect: 'fire_damage_ships_buildings' } }, // Red Cliffs Tactics
  'wu_uniquetech2': { affects: ['traction_treb', 'navy'],                  mod: { additional_projectiles: 2 } },                    // Sitting Tiger

};
