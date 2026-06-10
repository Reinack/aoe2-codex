'use strict';
const LOCALE_EN = {

  ui: {
    legend:             "Legend",
    unit:               "Unit",
    building:           "Building",
    tech:               "Technology",
    upgrade:            "Upgrade",
    unique:             "Unique",
    lg_common:          "Com.",
    lg_regional:        "Reg.",
    lg_unique:          "Unique",
    version:            "Version",
    zoom_in:            "Zoom In",
    zoom_out:           "Zoom Out",
    fit:                "Fit",
    search_placeholder: "Search...",
    hp:                 "HP",
    attack:             "ATK",
    armor_m:            "M.Arm",
    armor_p:            "P.Arm",
    range:              "RNG",
    melee_range:        "Mel.",
    speed:              "SPD",
    rof:                "RoF",
    blast_r:            "Blast R.",
    los:                "LoS",
    train:              "Train",
    cost:               "Cost",
    build_cost:         "Build Cost",
    research_cost:      "Research Cost",
    train_cost:         "Train Cost",
    repair_cost:        "Repair (full HP)",
    build_efficiency:   "Build time vs. workers  ·  3t⁄(n+2)",
    prereq:             "Prerequisites",
    missing:            "Not available for this civilization",
    bonus_dmg:          "Bonus damage",
  },

  bonus_targets: {
    shock_infantry:      "Shock Infantry",
    standard_buildings:  "Std. Buildings",
    all_buildings:       "All Buildings",
    stone_defense:       "Stone Defense",
    archers:             "Archers",
    cavalry:             "Cavalry",
    infantry:            "Infantry",
    siege:               "Siege",
    ships:               "Ships",
    fishing_ships:       "Fishing Ships",
    camel_units:         "Camel Units",
    monks:               "Monks",
    rams:                "Rams",
    spearmen:            "Spearmen",
    camels:              "Camels",
    mamelukes:           "Mamelukes",
    gunpowder:           "Gunpowder",
    elephants:           "Elephants",
    heavy_siege:         "Heavy Siege",
    fire_ships:          "Fire Ships",
    long_range_warship:  "Long-range Warship",
    siege_weapons:       "Siege Weapons",
    elephant_units:      "Elephant Units",
  },

  types: {
    infantry:   "Infantry civilization",
    cavalry:    "Cavalry civilization",
    archers:    "Archer civilization",
    naval:      "Naval civilization",
    defensive:  "Defensive civilization",
    monks:      "Monk civilization",
    siege:      "Siege civilization",
    gunpowder:  "Gunpowder civilization",
  },

  ages: {
    0: "Dark Age",
    1: "Feudal Age",
    2: "Castle Age",
    3: "Imperial Age",
  },

  buildings: {
    barracks:       "Barracks",
    archery:        "Archery Range",
    stable:         "Stable",
    siege:          "Siege Workshop",
    dock:           "Dock",
    monastery:      "Monastery",
    university:     "University",
    castle:         "Castle",
    wonder:         "Wonder",
    market:         "Market",
    blacksmith:     "Blacksmith",
    tc:             "Town Center",
    tc_castle:      "Additional Town Center",
    towncenter:     "Town Center",
    mill:           "Mill",
    farm:           "Farm",
    fishtrap:       "Fish Trap",
    lumber:         "Lumber Camp",
    mining:         "Mining Camp",
    tahsili:        "Settlement",
    mulecart:       "Mule Cart",
    // Towers
    outpost:        "Outpost",
    watchtower:     "Watch Tower",
    guardtower_b:   "Guard Tower",
    keep_b:         "Keep",
    bombardtower_b: "Bombard Tower",
    // Walls
    palisadewall:   "Palisade Wall",
    palisadegate:   "Palisade Gate",
    stonewall:      "Stone Wall",
    gate:           "Gate",
    fortifiedwall_b:"Fortified Wall",
  },

  // ── Nodes: { name, effect } by ID ────────────────────────
  nodes: {

    // ── Barracks ─────────────────────────────────────────────
    militia:      { name: 'Militia',               effect: 'Basic infantry unit.' },
    manatarms:    { name: 'Man-at-Arms',            effect: '+2 attack, +1 armor vs militia.' },
    longsword:    { name: 'Long Swordsman',         effect: '+2 attack, +1 HP.' },
    twohanded:    { name: 'Two-Handed Swordsman',   effect: '+1 attack, +1 armor.' },
    champion:     { name: 'Champion',               effect: '+1 attack, +1 HP.' },
    spearman:     { name: 'Spearman',               effect: 'Anti-cavalry. +20 attack vs horses.' },
    pikeman:      { name: 'Pikeman',                effect: '+2 attack, +1 armor. Better anti-cavalry.' },
    halberdier:   { name: 'Halberdier',             effect: '+1 attack. The best anti-cavalry unit.' },
    squires:      { name: 'Squires',                effect: 'Infantry +10% movement speed.' },
    arson:        { name: 'Arson',                  effect: 'Infantry +2 attack vs buildings.' },
    gambesons:    { name: 'Gambesons',              effect: 'Militia +1 pierce armor.' },

    eaglescout:   { name: 'Eagle Scout',            effect: '[Meso civs only] Fast scout without horses.' },
    eaglewarrior: { name: 'Eagle Warrior',          effect: '[Meso civs only] Eagle upgrade.' },
    eliteeagle:   { name: 'Elite Eagle Warrior',    effect: '[Meso civs only] Elite version.' },

    champiscout:  { name: 'Champi Scout',           effect: '[S. American only] Fast infantry with shield.' },
    champirunner: { name: 'Champi Runner',           effect: '[S. American only] Champi upgrade.' },
    champiwarrior:{ name: 'Champi Warrior',          effect: '[S. American only] Champi upgrade.' },
    elitechampi:  { name: 'Elite Champi Warrior',    effect: '[S. American only] Maximum regional power.' },

    legionary:    { name: 'Legionary',              effect: '[Romans only] Replaces Champion.' },
    fire_lancer:  { name: 'Fire Lancer',            effect: '[Dynastic civs] Fast infantry with area damage.' },
    elite_fire_lancer: { name: 'Elite Fire Lancer', effect: 'Elite version.' },
    flemish_militia:   { name: 'Flemish Militia',   effect: '[Burgundians only] Heavy infantry after Flemish Revolution.' },
    jian_swordsman:    { name: 'Jian Swordsman',    effect: '[Wu only] Agile infantry.' },
    temple_guard: { name: 'Temple Guard',           effect: '[Muisca only] Regional infantry.' },
    ibirapema:    { name: 'Ibirapema Warrior',      effect: '[Tupi only] Regional infantry.' },
    condottiero:  { name: 'Condottiero',            effect: '[Italians/Team] Anti-gunpowder unit.' },
    huskarl_b:    { name: 'Huskarl',                effect: '[Goths only] Fast infantry with high pierce armor.' },

    // ── Archery Range ────────────────────────────────────────
    archer:       { name: 'Archer',                 effect: 'Ranged attack unit.' },
    crossbow:     { name: 'Crossbowman',            effect: '+1 attack, +1 range.' },
    arbalester:   { name: 'Arbalester',             effect: '+1 attack, +1 range.' },
    skirmisher:   { name: 'Skirmisher',             effect: 'Anti-archer unit. Resistant to projectiles.' },
    eliteskirm:   { name: 'Elite Skirmisher',       effect: '+1 attack, +1 HP.' },
    handcannon:   { name: 'Hand Cannoneer',         effect: '[Requires Chemistry] Gunpowder unit.' },
    cavarcher:    { name: 'Cavalry Archer',         effect: 'Mounted archer, very mobile.' },
    hcavarcher:   { name: 'Heavy Cav Archer',       effect: '+1 attack, +20 HP.' },
    thumbring:    { name: 'Thumb Ring',             effect: '100% accuracy, archers fire faster.' },
    parthian:     { name: 'Parthian Tactics',       effect: '+2/+4 attack vs spears; Cav Archers fire while retreating.' },

    imp_skirmisher:      { name: 'Imperial Skirmisher',   effect: '[Vietnamese/Team] Ultimate Skirmisher upgrade.' },
    elephant_archer:     { name: 'Elephant Archer',       effect: '[Indian civs] Highly resilient mounted archer.' },
    elite_elephant_archer:{ name: 'Elite Elephant Archer',effect: 'Elite version.' },
    grenadier:    { name: 'Grenadier',              effect: '[Jurchens only] Gunpowder unit with area damage.' },
    xianbei_raider:{ name: 'Xianbei Raider',        effect: '[Wei only] Light cavalry archer.' },
    bolas_rider:  { name: 'Bolas Rider',            effect: '[Mapuche only] Regional unit.' },
    slinger:      { name: 'Slinger',                effect: '[American civs only] Anti-infantry.' },
    genitour:     { name: 'Genitour',               effect: '[Berbers/Team] Mounted Skirmisher.' },

    // ── Stable ───────────────────────────────────────────────
    scout:        { name: 'Scout Cavalry',          effect: 'Fast cavalry for scouting.' },
    lightcav:     { name: 'Light Cavalry',          effect: '+10 HP, +2 attack.' },
    hussar:       { name: 'Hussar',                 effect: '+10 HP. Good vs monks and rams.' },
    knight:       { name: 'Knight',                 effect: 'Heavy cavalry. High armor and attack.' },
    cavalier:     { name: 'Cavalier',               effect: '+2 attack, +1 armor.' },
    paladin:      { name: 'Paladin',                effect: '+10 HP, +1 attack. Elite cavalry.' },
    camel:        { name: 'Camel Rider',            effect: '[Eastern civs only] Anti-cavalry.' },
    heavycamel:   { name: 'Heavy Camel Rider',      effect: '+1 extra attack.' },
    battleeleph:  { name: 'Battle Elephant',        effect: '[SE Asian civs only] Very resistant.' },
    eliteeleph:   { name: 'Elite Battle Elephant',  effect: '+20 HP, +1 attack.' },
    bloodlines:   { name: 'Bloodlines',             effect: 'All cavalry +20 HP.' },
    husbandry:    { name: 'Husbandry',              effect: 'All cavalry +10% speed.' },

    winged_hussar:{ name: 'Winged Hussar',          effect: '[Poles/Lithuanians only] Superior Hussar upgrade.' },
    savar:        { name: 'Savar',                  effect: '[Persians only] Replaces the Paladin.' },
    camel_scout:  { name: 'Camel Scout',            effect: '[Gurjaras only] Camel unit available in Feudal Age.' },
    imp_camel:    { name: 'Imperial Camel Rider',   effect: '[Hindustanis only] Ultimate Camel upgrade.' },
    steppe_lancer:{ name: 'Steppe Lancer',          effect: '[Steppe civs] Cavalry with extended attack range.' },
    elite_steppe_lancer: { name: 'Elite Steppe Lancer', effect: 'Elite version.' },
    xolotl_warrior:{ name: 'Xolotl Warrior',        effect: '[American civs only] Captured cavalry unit.' },
    shrivamsha:   { name: 'Shrivamsha Rider',       effect: '[Gurjaras only] Cavalry that can dodge projectiles.' },
    elite_shrivamsha: { name: 'Elite Shrivamsha Rider', effect: 'Elite version.' },
    hei_guang:    { name: 'Hei Guang Cavalry',      effect: '[Three Kingdoms civs] Regional heavy cavalry.' },
    heavy_hei_guang: { name: 'Heavy Hei Guang',     effect: 'Elite version.' },
    tarkan_s:     { name: 'Tarkan',                 effect: '[Huns only] Anti-building cavalry.' },

    // ── Siege Workshop ───────────────────────────────────────
    batteringram: { name: 'Battering Ram',          effect: 'Anti-building unit.' },
    cappedram:    { name: 'Capped Ram',             effect: '+50 HP, +5 attack vs buildings.' },
    siegeram:     { name: 'Siege Ram',              effect: '+50 HP, better armor.' },
    mangonel:     { name: 'Mangonel',               effect: 'Area damage. Good vs massed archers.' },
    onager:       { name: 'Onager',                 effect: '+2 range, +5 attack.' },
    siegeonager:  { name: 'Siege Onager',           effect: 'Increased area damage, cuts trees.' },
    scorpion:     { name: 'Scorpion',               effect: 'Anti-infantry siege bolt thrower.' },
    heavyscorpion:{ name: 'Heavy Scorpion',         effect: '+1 range, more damage.' },
    bombcannon:   { name: 'Bombard Cannon',         effect: '[Requires Chemistry] Gunpowder cannon.' },
    siegetower:   { name: 'Siege Tower',             effect: 'Quick land transport used to unload infantry over enemy walls.' },

    houfnice:     { name: 'Houfnice',               effect: '[Bohemians only] Ultimate Bombard Cannon upgrade.' },
    traction_treb:{ name: 'Traction Trebuchet',     effect: '[Three Kingdoms civs] Early-age trebuchet.' },
    mounted_treb: { name: 'Mounted Trebuchet',      effect: '[Khitans only] Mobile trebuchet.' },
    rocket_cart:  { name: 'Rocket Cart',            effect: '[Dynastic civs] Regional artillery.' },
    heavy_rocket_cart: { name: 'Heavy Rocket Cart', effect: 'Elite version.' },
    flaming_camel:{ name: 'Flaming Camel',          effect: '[Tatars only] Suicide unit effective vs elephants.' },
    armored_elephant:  { name: 'Armored Elephant',  effect: '[Indian civs] Siege elephant.' },
    siege_elephant:    { name: 'Siege Elephant',    effect: 'Elite version.' },
    war_chariot_s:{ name: 'War Chariot',            effect: '[Shu only] Heavy siege chariot.' },

    // ── Blacksmith ───────────────────────────────────────────
    forging:          { name: 'Forging',                effect: '+1 melee attack.' },
    ironcasting:      { name: 'Iron Casting',            effect: '+1 melee attack.' },
    blastfurnace:     { name: 'Blast Furnace',           effect: '+2 melee attack.' },
    scalemailarmor:   { name: 'Scale Mail Armor',        effect: '+1/+1 infantry armor.' },
    chainmailarmor:   { name: 'Chain Mail Armor',        effect: '+1/+1 infantry armor.' },
    platemailarmor:   { name: 'Plate Mail Armor',        effect: '+1/+2 infantry armor.' },
    paddedarcharmor:  { name: 'Padded Archer Armor',     effect: '+1/+1 archer armor.' },
    leatherarcharmor: { name: 'Leather Archer Armor',    effect: '+1/+1 archer armor.' },
    ringarcherarmor:  { name: 'Ring Archer Armor',       effect: '+1/+2 archer armor.' },
    scalebarding:     { name: 'Scale Barding',           effect: '+1/+1 cavalry armor.' },
    chainbarding:     { name: 'Chain Barding',           effect: '+1/+1 cavalry armor.' },
    platebarding:     { name: 'Plate Barding',           effect: '+1/+2 cavalry armor.' },
    fletching:        { name: 'Fletching',               effect: '+1 range and +1 attack for archers.' },
    bodkinarrow:      { name: 'Bodkin Arrow',            effect: '+1 range and +1 attack for archers.' },
    bracer:           { name: 'Bracer',                  effect: '+1 range and +1 attack for archers.' },

    // ── Dock ─────────────────────────────────────────────────
    medium_warships:  { name: 'Medium Warships',    effect: 'Upgrades Galleys, Fire Galleys and Hulks to War Galleys, Fire Ships and War Hulks.' },
    heavy_warships:   { name: 'Heavy Warships',     effect: 'Upgrades War Galleys, Fire Ships and War Hulks to Galleons, Fast Fire Ships and Carracks.' },
    fishingship:  { name: 'Fishing Ship',           effect: 'Harvests food from the sea.' },
    transportship:{ name: 'Transport Ship',         effect: 'Transports land units.' },
    tradecog:     { name: 'Trade Cog',              effect: 'Trades gold on the ocean.' },
    galley:       { name: 'Galley',                 effect: 'Basic combat ship.' },
    wargalley:    { name: 'War Galley',             effect: '+15 HP, +1 attack.' },
    galleon:      { name: 'Galleon',                effect: '+50 HP, +1 attack.' },
    firegalley:   { name: 'Fire Galley',            effect: 'Anti-ship; sprays fire.' },
    fireship:     { name: 'Fire Ship',              effect: '+50 HP, faster attack speed.' },
    fastfireship: { name: 'Fast Fire Ship',         effect: '+50 HP, faster attack speed.' },
    hulk:         { name: 'Hulk',                   effect: 'Regional warship.' },
    war_hulk:     { name: 'War Hulk',               effect: 'Upgrade.' },
    carrack:      { name: 'Carrack',                effect: 'Maximum upgrade.' },
    demoraft:     { name: 'Demolition Raft',        effect: 'Suicide ship, area damage.' },
    demoship:     { name: 'Demolition Ship',        effect: 'Suicide ship, area damage.' },
    heavydemo:    { name: 'Heavy Demolition Ship',  effect: 'More damage and blast radius.' },
    cannongalleon:{ name: 'Cannon Galleon',         effect: '[Requires Chemistry] Long-range siege ship.' },
    elitecannon:  { name: 'Elite Cannon Galleon',   effect: 'More range and damage.' },
    drydock:      { name: 'Dry Dock',               effect: 'Ships +15% speed and +10 transport capacity.' },
    shipwright:   { name: 'Shipwright',             effect: 'Ships cost -20%; docks build 10% faster.' },
    fishing_lines:{ name: 'Fishing Lines',          effect: 'Fishing Ships gather +10% faster and carry +5 resources.' },
    gillnets:     { name: 'Gillnets',               effect: 'Fishing Ships work 10% faster and carry +5 resources.' },
    dragon_ship:  { name: 'Dragon Ship',            effect: '[Chinese only] Fire Ship upgrade.' },
    dromon:       { name: 'Dromon',                 effect: 'Anti-building siege warship with blast attack.' },
    lou_chuan:    { name: 'Lou Chuan',              effect: '[Chinese civs] Large regional warship.' },
    catapult_gall:{ name: 'Catapult Galley',        effect: '[American civs only] Siege ship.' },
    turtle_ship:  { name: 'Turtle Ship',            effect: '[Koreans only] Armored close-range warship.' },
    longboat:     { name: 'Longboat',               effect: '[Vikings only] Warship that fires multiple arrows.' },
    caravel_d:    { name: 'Caravel',                effect: '[Portuguese only] Warship with pass-through attack.' },
    thirisadai:   { name: 'Thirisadai',             effect: '[Dravidians only] Massive warship.' },
    harbor:       { name: 'Harbor',                 effect: '[Malay only] Defensive dock that shoots arrows.' },

    // ── University ───────────────────────────────────────────
    masonry:          { name: 'Masonry',                 effect: 'Buildings +10% HP, +1 melee/+1 pierce armor and +3 building armor.' },
    architecture:     { name: 'Architecture',            effect: 'Faster construction; buildings +5% HP and armor.' },
    ballistics:       { name: 'Ballistics',              effect: 'Towers and TCs aim at moving units.' },
    chemistry:        { name: 'Chemistry',               effect: '+1 projectile attack. Enables Hand Cannoneers and Bombard Cannons.' },
    murderhole:       { name: 'Murder Holes',            effect: 'Castles and Towers have no minimum range.' },
    siegeengineers:   { name: 'Siege Engineers',         effect: '+1 range and +20% attack for siege weapons.' },
    treadmillcrane:   { name: 'Treadmill Crane',         effect: 'Buildings are constructed 20% faster.' },
    heatedshot:       { name: 'Heated Shot',             effect: 'Towers +4 attack vs ships.' },
    careening:        { name: 'Careening',               effect: 'Increases +1 pierce armor.' },
    clinker_construction: { name: 'Clinker Construction',effect: 'Increases speed by 10%.' },
    carvel_hull:      { name: 'Carvel Hull',             effect: 'Improves navigation.' },
    siphons:          { name: 'Greek Fire Siphons',      effect: 'Fire Galleys gain an explosive charge attack.' },
    incendiaries:     { name: 'Incendiaries',            effect: 'Fire Galleys detonate when sunk, dealing damage around them.' },
    arrowslits:       { name: 'Arrowslits',              effect: 'Towers +1 attack.' },

    // ── Monastery ────────────────────────────────────────────
    monk:         { name: 'Monk',                   effect: 'Heals allies and converts enemies.' },
    redemption:   { name: 'Redemption',             effect: 'Monks can convert buildings.' },
    atonement:    { name: 'Atonement',              effect: 'Monks can convert other monks.' },
    heresy:       { name: 'Heresy',                 effect: 'Units converted by enemy die instead.' },
    sanctity:     { name: 'Sanctity',               effect: 'Monks +15 HP.' },
    fervor:       { name: 'Fervor',                 effect: 'Monks +15% speed.' },
    herbalmedicine:{ name: 'Herbal Medicine',       effect: 'Garrisoned units heal 4× faster.' },
    illumination: { name: 'Illumination',           effect: 'Monks regain faith faster.' },
    blockprinting:{ name: 'Block Printing',         effect: 'Monks +3 conversion range.' },
    theocracy:    { name: 'Theocracy',              effect: 'Only one monk must rest after group conversion.' },
    faith:        { name: 'Faith',                  effect: 'Units are more resistant to conversion.' },
    warrior_priest:{ name: 'Warrior Priest',        effect: '[Armenians only] Fighting Monk unit.' },
    missionary:   { name: 'Missionary',             effect: '[Spanish only] Mounted Monk.' },
    fortified_church: { name: 'Fortified Church',   effect: '[Armenians & Georgians] Defensive monastery. Fires when garrisoned with Villagers or Relics; +5 attack vs Ships, +1 vs Camel Units.' },

    // ── Castle ───────────────────────────────────────────────
    trebuchet:    { name: 'Trebuchet',              effect: 'Long-range siege engine. Must unpack to fire.' },
    petard:       { name: 'Petard',                 effect: 'Demolition unit. Good vs buildings.' },
    uniqueunit:   { name: 'Unique Unit',            effect: 'Civilization-specific unique unit.' },
    eliteunique:  { name: 'Elite Unique Unit',      effect: 'Upgraded version of unique unit.' },
    uniquetech1:  { name: 'Unique Tech I',          effect: 'Castle-specific technology (Castle Age).' },
    uniquetech2:  { name: 'Unique Tech II',         effect: 'Castle-specific technology (Imperial Age).' },
    hoardings:    { name: 'Hoardings',              effect: 'Castles +500 HP.' },
    conscription: { name: 'Conscription',           effect: 'Units created 33% faster.' },
    sappers:      { name: 'Sappers',                effect: 'Infantry +15 attack vs buildings.' },
    kipchak_c:    { name: 'Kipchak',                effect: '[Cumans/Team] Fast cavalry archer.' },
    krepost:      { name: 'Krepost',                effect: '[Bulgarians only] Minor castle. Creates Konniks.' },
    donjon:       { name: 'Donjon',                 effect: '[Sicilians only] Tower that trains Serjeants.' },

    // ── Market ───────────────────────────────────────────────
    tradecart:    { name: 'Trade Cart',             effect: 'Generates gold by trading with allied Markets.' },
    coinage:      { name: 'Coinage',                effect: '-15% tribute received.' },
    banking:      { name: 'Banking',                effect: 'No tax on tributes.' },
    guilds:       { name: 'Guilds',                 effect: 'Market traders work 50% faster.' },
    feitoria:     { name: 'Feitoria',               effect: '[Portuguese only] Automatically generates resources.' },
    caravanserai: { name: 'Caravanserai',           effect: '[Hindustanis & Persians] Heals and speeds up trade carts.' },

    // ── Town Center ──────────────────────────────────────────
    villager:     { name: 'Villager',               effect: 'Basic resource-gathering and building unit.' },
    loom:         { name: 'Loom',                   effect: 'Villagers +15 HP, +1/+2 armor.' },
    wheelbarrow:  { name: 'Wheelbarrow',            effect: 'Villagers +3 carry capacity, +5% speed.' },
    townwatch:    { name: 'Town Watch',             effect: '+4 line of sight for Town Centers.' },
    handcart:     { name: 'Hand Cart',              effect: 'Villagers +7 carry capacity, +10% speed.' },
    townpatrol:   { name: 'Town Patrol',            effect: '+6 LoS for Towers and Town Centers.' },
    feudalage:    { name: 'Feudal Age',             effect: 'Advance to the Feudal Age.' },
    castleage:    { name: 'Castle Age',             effect: 'Advance to the Castle Age.' },
    imperialage:  { name: 'Imperial Age',           effect: 'Advance to the Imperial Age.' },

    // ── Mill ─────────────────────────────────────────────────
    horsecollar:  { name: 'Horse Collar',           effect: 'Farms produce 75 extra food.' },
    heavyplow:    { name: 'Heavy Plow',             effect: 'Farms produce 125 extra food.' },
    croprotation: { name: 'Crop Rotation',          effect: 'Farms produce 375 extra food.' },
    folwark:      { name: 'Folwark',                effect: '[Poles only] Replaces Mill. Instantly collects food from adjacent farms.' },
    mule_cart:    { name: 'Mule Cart',              effect: '[Armenians & Georgians] Mobile drop-off point.' },

    // ── Lumber Camp ──────────────────────────────────────────
    doublebitaxe: { name: 'Double-Bit Axe',         effect: 'Wood chopping +20% speed.' },
    bowsaw:       { name: 'Bow Saw',                effect: 'Wood chopping +20% speed.' },
    twomansaw:    { name: 'Two-Man Saw',            effect: 'Wood chopping +10% speed.' },

    // ── Mining Camp ──────────────────────────────────────────
    goldmining:   { name: 'Gold Mining',            effect: 'Gold mining +15% speed.' },
    goldshaft:    { name: 'Gold Shaft Mining',      effect: 'Gold shaft mining +15% speed.' },
    stonemining:  { name: 'Stone Mining',           effect: 'Stone mining +15% speed.' },
    stoneshaft:   { name: 'Stone Shaft Mining',     effect: 'Stone shaft mining +15% speed.' },

    // ── Settlement (Tahsili) ─────────────────────────────────
    horsecollar_t:  { name: 'Horse Collar',        effect: 'Farms produce 75 extra food.' },
    heavyplow_t:    { name: 'Heavy Plow',          effect: 'Farms produce 125 extra food.' },
    croprotation_t: { name: 'Crop Rotation',       effect: 'Farms produce 375 extra food.' },
    doublebitaxe_t: { name: 'Double-Bit Axe',     effect: 'Wood chopping +20% speed.' },
    bowsaw_t:       { name: 'Bow Saw',            effect: 'Wood chopping +20% speed.' },
    twomansaw_t:    { name: 'Two-Man Saw',        effect: 'Wood chopping +10% speed.' },
    goldmining_t:   { name: 'Gold Mining',        effect: 'Gold mining +15% speed.' },
    goldshaft_t:    { name: 'Gold Shaft Mining',  effect: 'Gold shaft mining +15% speed.' },
    stonemining_t:  { name: 'Stone Mining',       effect: 'Stone mining +15% speed.' },
    stoneshaft_t:   { name: 'Stone Shaft Mining', effect: 'Stone shaft mining +15% speed.' },

    // ── Mule Cart ────────────────────────────────────────────
    doublebitaxe_m: { name: 'Double-Bit Axe',     effect: 'Wood chopping +20% speed.' },
    bowsaw_m:       { name: 'Bow Saw',            effect: 'Wood chopping +20% speed.' },
    twomansaw_m:    { name: 'Two-Man Saw',        effect: 'Wood chopping +10% speed.' },
    goldmining_m:   { name: 'Gold Mining',        effect: 'Gold mining +15% speed.' },
    goldshaft_m:    { name: 'Gold Shaft Mining',  effect: 'Gold shaft mining +15% speed.' },
    stonemining_m:  { name: 'Stone Mining',       effect: 'Stone mining +15% speed.' },
    stoneshaft_m:   { name: 'Stone Shaft Mining', effect: 'Stone shaft mining +15% speed.' },
  },

  civs: {
    armenians: {
      name: "Armenians",
      type: "Infantry and Naval civilization",
      bonuses: [
        "Mule Carts cost -25%",
        "Mule Cart technologies are +40% more effective",
        "Spearman- and Militia-line upgrades (except Man-at-Arms) available one age earlier",
        "First Fortified Church receives a free Relic",
        "Galley-line and Dromons fire an additional projectile"
      ],
      teamBonus: "Infantry +2 line of sight",
      uniqueTechs: [
        { name: "Cilician Fleet", effect: "Demolition Ships: +20% blast radius; Dromons and Galley-line: +1 range." },
        { name: "Feretorios", effect: "Infantry except Spearman-line: +30 HP; War Monks: +100% healing speed." }
      ],
      uniqueUnits: [
        { name: "Composite Bowman", subtitle: "foot archer", upgradeName: "Elite Composite Bowman" },
        { name: "War Monk", subtitle: "infantry" }
      ]
    },
    aztecs: {
      name: "Aztecs",
      type: "Infantry and Monk civilization",
      bonuses: [
        "Start with +50 gold",
        "Villagers carry +3",
        "Military Units train +15% faster",
        "Monks gain +5 HP for each researched Monastery technology"
      ],
      teamBonus: "Relics generate +33% gold",
      uniqueTechs: [
        { name: "Atlatl", effect: "Skirmishers +1 attack and +1 range." },
        { name: "Garland Wars", effect: "Infantry +4 attack." }
      ],
      uniqueUnits: [
        { name: "Jaguar Warrior", upgradeName: "Elite Jaguar Warrior" }
      ]
    },
    bengalis: {
      name: "Bengalis",
      type: "Elephant and Naval civilization",
      bonuses: [
        "Town Centers spawn 2 Villagers when the next Age is reached",
        "Cavalry +2 attack vs. Skirmishers",
        "Elephant Units receive -25% bonus damage and are more resistant to conversion",
        "Monks +3 melee/+3 pierce armor",
        "Ships regenerate 15 HP per minute"
      ],
      teamBonus: "Trade Units generate +10% food in addition to gold",
      uniqueTechs: [
        { name: "Paiks", effect: "Ratha and Elephant Archers 10% faster." },
        { name: "Mahayana", effect: "Houses provide +10 extra population space." }
      ],
      uniqueUnits: [
        { name: "Ratha", upgradeName: "Elite Ratha" }
      ]
    },
    berbers: {
      name: "Berbers",
      type: "Cavalry and Naval civilization",
      bonuses: [
        "Villagers move +5% faster in Dark Age, +10% faster starting in Feudal Age",
        "Stable Units cost -15/20% in Castle/Imperial Age",
        "Ships move +10% faster"
      ],
      teamBonus: "Genitour available at the Archery Range starting in Castle Age",
      uniqueTechs: [
        { name: "Kasbah", effect: "Unique buildings work 25% faster." },
        { name: "Maghrebi Camels", effect: "Camels regenerate HP." }
      ],
      uniqueUnits: [
        { name: "Camel Archer", upgradeName: "Elite Camel Archer" }
      ]
    },
    burmese: {
      name: "Burmese",
      type: "Infantry and Cavalry civilization",
      bonuses: [
        "Lumber Camp technologies free",
        "Infantry +1/+2/+3 attack in Feudal/Castle/Imperial Age",
        "Battle Elephants +1 melee/+1 pierce armor",
        "Monastery technologies cost -50%"
      ],
      teamBonus: "Relics visible on the map at the start of the game",
      uniqueTechs: [
        { name: "Manipur Cavalry", effect: "Cavalry +4 attack vs archers." },
        { name: "Howdah", effect: "Battle Elephants +1/+1 armor." }
      ],
      uniqueUnits: [
        { name: "Arambai", upgradeName: "Elite Arambai" }
      ]
    },
    byzantines: {
      name: "Byzantines",
      type: "Defensive civilization",
      bonuses: [
        "Buildings +10/20/30/40% HP in Dark/Feudal/Castle/Imperial Age",
        "Camel Riders, Skirmishers and Spearman-line cost -25%",
        "Town Watch, Town Patrol free",
        "Advancing to Imperial Age costs -33%",
        "Fire Ships and Dromons attack +25% faster"
      ],
      teamBonus: "Monks heal +100% faster",
      uniqueTechs: [
        { name: "Greek Fire", effect: "Fire Ships +1 range." },
        { name: "Logistica", effect: "Cataphracts deal trample damage; +6 attack vs infantry." }
      ],
      uniqueUnits: [
        { name: "Cataphract", upgradeName: "Elite Cataphract" }
      ]
    },
    bohemians: {
      name: "Bohemians",
      type: "Gunpowder and Monk civilization",
      bonuses: [
        "Mining Camp technologies free",
        "Blacksmiths and Universities cost -100 wood",
        "Spearman-line deals +25% bonus damage",
        "Fervor and Sanctity affect Villagers",
        "Chemistry and Hand Cannoneer available in Castle Age"
      ],
      teamBonus: "Markets work +80% faster",
      uniqueTechs: [
        { name: "Wagenburg Tactics", effect: "Hand Cannoneers move 15% faster." },
        { name: "Hussite Reforms", effect: "Monks and Monastery technologies: gold cost replaced by food." }
      ],
      uniqueUnits: [
        { name: "Hussite Wagon", upgradeName: "Elite Hussite Wagon" }
      ]
    },
    burgundians: {
      name: "Burgundians",
      type: "Cavalry civilization",
      bonuses: [
        "Economic upgrades available one age earlier and cost -33% food",
        "Stable technologies cost -50%",
        "Cavalier upgrade available in Castle Age",
        "Gunpowder Units +25% attack"
      ],
      teamBonus: "Relics generate food in addition to gold",
      uniqueTechs: [
        { name: "Burgundian Vineyards", effect: "Farms also generate small amounts of gold." },
        { name: "Flemish Revolution", effect: "Transform all Villagers into Flemish Militia." }
      ],
      uniqueUnits: [
        { name: "Coustillier", upgradeName: "Elite Coustillier" }
      ]
    },
    britons: {
      name: "Britons",
      type: "Foot Archer civilization",
      bonuses: [
        "Shepherds work +25% faster",
        "Town Centers cost -50% wood starting in Castle Age",
        "Foot Archers +1/+2 range in Castle/Imperial Age"
      ],
      teamBonus: "Archery Ranges work +10% faster",
      uniqueTechs: [
        { name: "Yeomen", effect: "Foot archers +1 range; Towers +2 attack." },
        { name: "Warwolf", effect: "Trebuchets 100% accuracy and deal area damage." }
      ],
      uniqueUnits: [
        { name: "Longbowman", upgradeName: "Elite Longbowman" }
      ]
    },
    bulgarians: {
      name: "Bulgarians",
      type: "Infantry and Cavalry civilization",
      bonuses: [
        "Militia-line upgrades free",
        "Blacksmith and Siege Workshop technologies cost -50% food",
        "Town Centers cost -50% stone",
        "Can build Krepost in Castle Age"
      ],
      teamBonus: "Blacksmiths work +80% faster",
      uniqueTechs: [
        { name: "Stirrups", effect: "Cavalry attack 33% faster." },
        { name: "Bagains", effect: "Militia-line +5 melee armor." }
      ],
      uniqueUnits: [
        { name: "Konnik", upgradeName: "Elite Konnik" }
      ]
    },
    celts: {
      name: "Celts",
      type: "Infantry and Siege civilization",
      bonuses: [
        "Lumberjacks work +15% faster",
        "Livestock animals within Celt unit line of sight cannot be stolen",
        "Infantry moves +5/10/15/20% faster in Dark/Feudal/Castle/Imperial Age",
        "Siege Weapons attack +25% faster"
      ],
      teamBonus: "Siege Workshops work +20% faster",
      uniqueTechs: [
        { name: "Stronghold", effect: "Castles and Watch Tower-line attack 33% faster; Castles heal allied Infantry in a 7-tile radius." },
        { name: "Furor Celtica", effect: "Siege Weapons +40% HP." }
      ],
      uniqueUnits: [
        { name: "Woad Raider", upgradeName: "Elite Woad Raider" }
      ]
    },
    chinese: {
      name: "Chinese",
      type: "Archer and Gunpowder civilization",
      bonuses: [
        "Start with +3 Villagers, but -50 wood and -200 food",
        "Technologies cost -5/10/15% in Feudal/Castle/Imperial Age",
        "Town Centers +7 line of sight and provide +15 population space",
        "Fire Lancers and Fire Ships move +5/10% faster in Castle/Imperial Age"
      ],
      teamBonus: "Farms +10% food",
      uniqueTechs: [
        { name: "Great Wall", effect: "Walls +30% HP." },
        { name: "Rocketry", effect: "Scorpions +4 attack and +2 range; Chu Ko Nu +2 attack." }
      ],
      uniqueUnits: [
        { name: "Chu Ko Nu", upgradeName: "Elite Chu Ko Nu" }
      ]
    },
    koreans: {
      name: "Koreans",
      type: "Defensive and Naval civilization",
      bonuses: [
        "Stone miners work +20% faster",
        "Ranged Soldiers and Infantry cost -50% wood",
        "Archer armor and tower upgrades free (Bombard Tower requires Chemistry)",
        "Warships cost -20% wood"
      ],
      teamBonus: "Villagers +3 line of sight",
      uniqueTechs: [
        { name: "Eupseong", effect: "Towers and Castles +2 range." },
        { name: "Shinkichon", effect: "Mangonels and Onagers +1 range." }
      ],
      uniqueUnits: [
        { name: "War Wagon", upgradeName: "Elite War Wagon" }
      ]
    },
    cumans: {
      name: "Cumans",
      type: "Cavalry civilization",
      bonuses: [
        "One additional Town Center can be built in Feudal Age",
        "Mounted Units move +5/10/15% faster in Feudal/Castle/Imperial Age",
        "Archery Ranges and Stables cost -75 wood",
        "Siege Workshop and Battering Ram available in Feudal Age; Capped Ram available in Castle Age"
      ],
      teamBonus: "Palisade Walls +33% HP",
      uniqueTechs: [
        { name: "Steppe Husbandry", effect: "Steppe Lancers and Light Cavalry are created 2× faster." },
        { name: "Cuman Mercenaries", effect: "Allies can create Elite Kipchaks from their Castles." }
      ],
      uniqueUnits: [
        { name: "Kipchak", upgradeName: "Elite Kipchak" }
      ]
    },
    dravidians: {
      name: "Dravidians",
      type: "Infantry and Naval civilization",
      bonuses: [
        "Fishermen and Fishing Ships carry +15",
        "Receive +200 wood when advancing to the next Age",
        "Skirmishers and Elephant Archers attack +25% faster",
        "Barracks technologies cost -50%",
        "Siege Weapons cost -33% wood"
      ],
      teamBonus: "Docks provide +5 population space",
      uniqueTechs: [
        { name: "Medical Corps", effect: "Siege/Battle Elephants regenerate HP." },
        { name: "Wootz Steel", effect: "Infantry and Cavalry ignore enemy armor." }
      ],
      uniqueUnits: [
        { name: "Urumi Swordsman", upgradeName: "Elite Urumi Swordsman" }
      ]
    },
    slavs: {
      name: "Slavs",
      type: "Infantry and Siege civilization",
      bonuses: [
        "Farmers work +15% faster",
        "Arson, Gambesons free",
        "Siege Workshop Units cost -15%",
        "Monks move +20% faster"
      ],
      teamBonus: "Military buildings (except Castles) provide +5 population space",
      uniqueTechs: [
        { name: "Detinets", effect: "Towers cost -25%." },
        { name: "Druzhina", effect: "Infantry deals trample damage." }
      ],
      uniqueUnits: [
        { name: "Boyar", upgradeName: "Elite Boyar" }
      ]
    },
    spanish: {
      name: "Spanish",
      type: "Gunpowder and Monk civilization",
      bonuses: [
        "Builders work +30% faster",
        "Receive +20 gold for each technology researched",
        "Blacksmith upgrades cost no gold",
        "Gunpowder Units attack +18% faster",
        "Cannon Galleons fire more accurately at moving targets"
      ],
      teamBonus: "Trade Units generate +25% gold",
      uniqueTechs: [
        { name: "Inquisition", effect: "Monks convert faster." },
        { name: "Supremacy", effect: "Villagers improved attack, armor and HP." }
      ],
      uniqueUnits: [
        { name: "Conquistador", upgradeName: "Elite Conquistador" }
      ]
    },
    ethiopians: {
      name: "Ethiopians",
      type: "Archer civilization",
      bonuses: [
        "Receive +100 gold and +100 food when advancing to the next Age",
        "Foot Archers attack +18% faster",
        "Pikeman upgrade free"
      ],
      teamBonus: "Outposts +3 line of sight and cost no stone",
      uniqueTechs: [
        { name: "Royal Heirs", effect: "Shotel Warriors and Camel Riders receive -3 damage from Mounted Units." },
        { name: "Torsion Engines", effect: "Siege Workshop units fire extra projectiles." }
      ],
      uniqueUnits: [
        { name: "Shotel Warrior", upgradeName: "Elite Shotel Warrior" }
      ]
    },
    franks: {
      name: "Franks",
      type: "Cavalry civilization",
      bonuses: [
        "Foragers work +15% faster",
        "Mill technologies free",
        "Mounted Units +20% HP starting in Feudal Age",
        "Castles cost -15/25% in Castle/Imperial Age"
      ],
      teamBonus: "Knight-line +2 line of sight",
      uniqueTechs: [
        { name: "Chivalry", effect: "Stables work 40% faster." },
        { name: "Beeldenstorm", effect: "Monasteries demolished; Monks cost -100%." }
      ],
      uniqueUnits: [
        { name: "Throwing Axeman", upgradeName: "Elite Throwing Axeman" }
      ]
    },
    georgians: {
      name: "Georgians",
      type: "Defensive and Cavalry civilization",
      bonuses: [
        "Start with a Mule Cart",
        "Units and buildings receive -15% damage when located on higher elevation",
        "Mounted Units regenerate 2/8/14 HP per minute in Feudal/Castle/Imperial Age",
        "Fortified Churches provide Villagers in a 9 tiles radius with +10% work rate"
      ],
      teamBonus: "Building repairs cost -25%",
      uniqueTechs: [
        { name: "Svan Towers", effect: "Fortifications +2 attack; Watch Tower-line deals pass-through damage." },
        { name: "Aznauri Cavalry", effect: "Mounted Units take -20% population space." }
      ],
      uniqueUnits: [
        { name: "Monaspa", upgradeName: "Elite Monaspa" }
      ]
    },
    goths: {
      name: "Goths",
      type: "Infantry civilization",
      bonuses: [
        "Loom is researched instantly",
        "Hunters carry +15; hunted animals last +20% longer",
        "Infantry costs -15/20/25/30% in Dark/Feudal/Castle/Imperial Age",
        "Infantry +1/+2/+3 attack vs. buildings in Feudal/Castle/Imperial Age",
        "+10 population space in Imperial Age"
      ],
      teamBonus: "Barracks work +20% faster",
      uniqueTechs: [
        { name: "Anarchy", effect: "Huskarls can be produced at Barracks." },
        { name: "Perfusion", effect: "Barracks work 100% faster." }
      ],
      uniqueUnits: [
        { name: "Huskarl", upgradeName: "Elite Huskarl" }
      ]
    },
    gurjaras: {
      name: "Gurjaras",
      type: "Cavalry and Camel civilization",
      bonuses: [
        "Start with 2 Forage Bushes",
        "Can garrison livestock in Mills to passively produce food",
        "Mounted Units deal +20/30/40% bonus damage in Feudal/Castle/Imperial Age",
        "Docks +5 garrison capacity"
      ],
      teamBonus: "Camel and Elephant Units train +25% faster",
      uniqueTechs: [
        { name: "Kshatriyas", effect: "Military units cost -25% food." },
        { name: "Frontier Guards", effect: "Imperial Camel Rider +4 melee armor." }
      ],
      uniqueUnits: [
        { name: "Chakram Thrower", upgradeName: "Elite Chakram Thrower" }
      ]
    },
    hindustanis: {
      name: "Hindustanis",
      type: "Camel and Gunpowder civilization",
      bonuses: [
        "Villagers cost -8/13/18/23% in Dark/Feudal/Castle/Imperial Age",
        "Camel Riders attack +20% faster",
        "Gunpowder Units +1 melee/+1 pierce armor",
        "Can build Caravanserai in Imperial Age"
      ],
      teamBonus: "Scout Cavalry-line and Camel Units +2 attack vs. buildings",
      uniqueTechs: [
        { name: "Grand Trunk Road", effect: "All gold income +10% faster; Market trading fee reduced to 10%." },
        { name: "Shatagni", effect: "Hand Cannoneers +2 range." }
      ],
      uniqueUnits: [
        { name: "Ghulam", upgradeName: "Elite Ghulam" }
      ]
    },
    huns: {
      name: "Huns",
      type: "Cavalry civilization",
      bonuses: [
        "Do not need houses, but start with -100 wood",
        "Cavalry Archers cost -10/20% in Castle/Imperial Age",
        "Trebuchets fire more accurately at units and small targets",
        "On Nomadic maps, the first Town Center spawns a scouting Horse"
      ],
      teamBonus: "Stables work +20% faster",
      uniqueTechs: [
        { name: "Marauders", effect: "Tarkans producible at Stables." },
        { name: "Atheism", effect: "Wonders need 50 extra years; Spies -50%." }
      ],
      uniqueUnits: [
        { name: "Tarkan", upgradeName: "Elite Tarkan" }
      ]
    },
    incas: {
      name: "Incas",
      type: "Infantry civilization",
      bonuses: [
        "Houses and Settlements provide +5 population space",
        "Buildings cost -15% stone",
        "Military Units cost -5/10/15/20% food in Dark/Feudal/Castle/Imperial Age",
        "Villagers affected by Infantry Blacksmith upgrades starting in Castle Age"
      ],
      teamBonus: "Start with a free Llama",
      uniqueTechs: [
        { name: "Andean Sling", effect: "Skirmishers and Slingers have no minimum range; Slingers +1 attack." },
        { name: "Fabric Shields", effect: "Kamayuks and Champi Warriors +1/+1 armor." }
      ],
      uniqueUnits: [
        { name: "Kamayuk", upgradeName: "Elite Kamayuk" }
      ]
    },
    italians: {
      name: "Italians",
      type: "Archer and Naval civilization",
      bonuses: [
        "Advancing to the next Age costs -15%",
        "Foot Archers and Condottieri +1 melee/+1 pierce armor",
        "Dock and University technologies cost -25%",
        "Gunpowder Units cost -20%",
        "Fishing Ships cost -15%"
      ],
      teamBonus: "Condottiero available at the Barracks in Imperial Age",
      uniqueTechs: [
        { name: "Silk Road", effect: "Trade Units cost -50%." },
        { name: "Pirotechnia", effect: "Hand Cannoneers deal +15% pass-through damage and are more accurate." }
      ],
      uniqueUnits: [
        { name: "Genoese Crossbowman", upgradeName: "Elite Genoese Crossbowman" }
      ]
    },
    japanese: {
      name: "Japanese",
      type: "Infantry civilization",
      bonuses: [
        "Mills, Lumber- and Mining Camps cost -50%",
        "Infantry attacks +33% faster starting in Feudal Age",
        "Cavalry Archers +2 attack vs. Ranged Soldiers (except Skirmishers)",
        "Fishing Ships work +5/10/15/20% faster in Dark/Feudal/Castle/Imperial Age; +100% HP"
      ],
      teamBonus: "Galley-line +4 line of sight",
      uniqueTechs: [
        { name: "Yasama", effect: "Towers fire extra projectiles." },
        { name: "Kataparuto", effect: "Trebuchets fire/pack 4× faster; 100% accuracy." }
      ],
      uniqueUnits: [
        { name: "Samurai", upgradeName: "Elite Samurai" }
      ]
    },
    jurchens: {
      name: "Jurchens",
      type: "Cavalry and Gunpowder civilization",
      bonuses: [
        "Meat of hunted and livestock animals doesn't decay",
        "Mounted Units and Fire Lancers attack +25% faster starting in Feudal Age",
        "Siege Engineers available in Castle Age",
        "Siege and Fortification upgrades cost -75% wood and research +100% faster",
        "Units receive -50% friendly fire damage"
      ],
      teamBonus: "Gunpowder Units +2 line of sight",
      uniqueTechs: [
        { name: "Unique Technology I", effect: "Mod effect." },
        { name: "Unique Technology II", effect: "Mod effect." }
      ],
      uniqueUnits: [
        { name: "Unique Unit", upgradeName: "Elite Unique Unit" }
      ]
    },
    khmer: {
      name: "Khmer",
      type: "Siege and Elephant civilization",
      bonuses: [
        "No buildings required to advance to the next Age or to unlock other buildings",
        "Farmers don't require Mills or Town Centers to drop off food",
        "Villagers can garrison in Houses",
        "Battle Elephants move +10% faster"
      ],
      teamBonus: "Scorpions +1 range",
      uniqueTechs: [
        { name: "Tusk Swords", effect: "Battle Elephants +3 attack." },
        { name: "Double Crossbow", effect: "Ballista Elephants and Scorpions fire 2 projectiles." }
      ],
      uniqueUnits: [
        { name: "Ballista Elephant", upgradeName: "Elite Ballista Elephant" }
      ]
    },
    khitans: {
      name: "Khitans",
      type: "Infantry and Cavalry civilization",
      bonuses: [
        "Pastures replace Farms",
        "Melee attack upgrade effects are doubled",
        "Skirmishers, Spearman-, and Scout Cavalry-line train and upgrade +15% faster",
        "Heavy Cavalry Archer upgrade available in Castle Age and costs -50%"
      ],
      teamBonus: "Infantry +2 attack vs. Ranged Soldiers",
      uniqueTechs: [
        { name: "Unique Technology I", effect: "Mod effect." },
        { name: "Unique Technology II", effect: "Mod effect." }
      ],
      uniqueUnits: [
        { name: "Unique Unit", upgradeName: "Elite Unique Unit" }
      ]
    },
    lithuanians: {
      name: "Lithuanians",
      type: "Cavalry and Monk civilization",
      bonuses: [
        "Each Town Center provides +100 food",
        "Spearman-line and Skirmisher-line move +10% faster",
        "Each garrisoned Relic provides +1 attack to Knight-line and Leitis (maximum +4)"
      ],
      teamBonus: "Monasteries work +20% faster",
      uniqueTechs: [
        { name: "Hill Forts", effect: "Town Centers +3 attack range." },
        { name: "Tower Shields", effect: "Spearmen/Pikemen/Halberdiers +2 pierce armor." }
      ],
      uniqueUnits: [
        { name: "Leitis", upgradeName: "Elite Leitis" }
      ]
    },
    magyars: {
      name: "Magyars",
      type: "Cavalry civilization",
      bonuses: [
        "Villagers defeat wolves with one strike",
        "Scout Cavalry-line costs -15%",
        "Melee attack upgrades free"
      ],
      teamBonus: "Mounted Archers train +25% faster",
      uniqueTechs: [
        { name: "Magyar Mercenaries", effect: "Magyar Huszar costs no gold." },
        { name: "Recurve Bow", effect: "Cavalry Archers +1 range and +1 attack." }
      ],
      uniqueUnits: [
        { name: "Magyar Huszar", upgradeName: "Elite Magyar Huszar" }
      ]
    },
    malay: {
      name: "Malay",
      type: "Naval civilization",
      bonuses: [
        "Advancing to the next Age is +66% faster",
        "Infantry armor upgrades free",
        "Battle Elephants cost -25/35% in Castle/Imperial Age",
        "Fish Traps cost -33% and provide +200% food"
      ],
      teamBonus: "Docks +6 line of sight",
      uniqueTechs: [
        { name: "Thalassocracy", effect: "Docks convert into Harbors that attack." },
        { name: "Forced Levy", effect: "Two-Handed Swordsmen cost wood instead of gold." }
      ],
      uniqueUnits: [
        { name: "Karambit Warrior", upgradeName: "Elite Karambit Warrior" }
      ]
    },
    malians: {
      name: "Malians",
      type: "Infantry civilization",
      bonuses: [
        "Buildings cost -15% wood",
        "Villagers drop off +10% more gold",
        "Barracks Units +1/+2/+3 pierce armor in Feudal/Castle/Imperial Age"
      ],
      teamBonus: "Universities work +80% faster",
      uniqueTechs: [
        { name: "Tigui", effect: "Town Centers fire arrows even when empty." },
        { name: "Farimba", effect: "Cavalry +5 attack." }
      ],
      uniqueUnits: [
        { name: "Gbeto", upgradeName: "Elite Gbeto" }
      ]
    },
    mapuche: {
      name: "Mapuche",
      type: "Cavalry and Counter-Unit civilization",
      bonuses: [
        "Foragers drop off +20% food",
        "Settlements can train Spearman-line and Skirmishers",
        "Infantry, Slingers and Skirmishers +5/10/15 HP in Feudal/Castle/Imperial Age",
        "Mounted Units generate +3 gold when defeating military units",
        "Enemy Castles are revealed on the map"
      ],
      teamBonus: "Spearman-line and Skirmishers +2 line of sight",
      uniqueTechs: [
        { name: "Malón", effect: "Bolas Riders, Slingers, and Skirmishers deal area damage." },
        { name: "Butalmapu", effect: "Reduces cost of unique units for the whole team." }
      ],
      uniqueUnits: [
        { name: "Kona", subtitle: "heavy cavalry", upgradeName: "Elite Kona" },
        { name: "Bolas Rider", subtitle: "ranged cavalry", upgradeName: "Elite Bolas Rider" }
      ]
    },
    mayans: {
      name: "Mayans",
      type: "Archer civilization",
      bonuses: [
        "Start with +1 Villager, but -50 food",
        "Resources last +15% longer",
        "Foot Archers cost -10/20/30% in Feudal/Castle/Imperial Age"
      ],
      teamBonus: "Walls cost -50%",
      uniqueTechs: [
        { name: "Obsidian Arrows", effect: "Archers +6 attack vs buildings." },
        { name: "El Dorado", effect: "Eagle Warriors +40 HP." }
      ],
      uniqueUnits: [
        { name: "Plumed Archer", upgradeName: "Elite Plumed Archer" }
      ]
    },
    mongols: {
      name: "Mongols",
      type: "Cavalry Archer civilization",
      bonuses: [
        "Hunters work +40% faster",
        "Cavalry Archers attack +25% faster",
        "Scout Cavalry-line and Steppe Lancers +20/30% HP in Castle/Imperial Age"
      ],
      teamBonus: "Scout Cavalry-line +2 line of sight",
      uniqueTechs: [
        { name: "Nomads", effect: "Houses are not destroyed when their inhabitants die." },
        { name: "Drill", effect: "Siege Workshop units move 50% faster." }
      ],
      uniqueUnits: [
        { name: "Mangudai", upgradeName: "Elite Mangudai" }
      ]
    },
    muisca: {
      name: "Muisca",
      type: "Archer and Monk civilization",
      bonuses: [
        "Advancing to the next Age costs -50% gold",
        "Settlements cost -25% and heal nearby units",
        "Champi Warriors and Archery Range Units +1/2/3 melee armor in Feudal/Castle/Imperial Age",
        "Monks regain faith +50% faster",
        "Caravan, Guilds free"
      ],
      teamBonus: "Natural gold sources last +15% longer",
      uniqueTechs: [
        { name: "Herbalismo", effect: "Increases movement speed of Archers and Champi Warriors." },
        { name: "Huaracas", effect: "Increases range and training speed of Slingers." }
      ],
      uniqueUnits: [
        { name: "Guecha Warrior", subtitle: "skirmisher", upgradeName: "Elite Guecha Warrior" },
        { name: "Temple Guard", subtitle: "heavy infantry", upgradeName: "Elite Temple Guard" }
      ]
    },
    persians: {
      name: "Persians",
      type: "Cavalry civilization",
      bonuses: [
        "Start with +50 wood and +50 food",
        "Town Centers and Docks +100% HP and work +5/10/15/20% faster in Dark/Feudal/Castle/Imperial Age",
        "Parthian Tactics available in Castle Age",
        "Can build Caravanserai in Imperial Age"
      ],
      teamBonus: "Knight-line +2 attack vs. Ranged Soldiers",
      uniqueTechs: [
        { name: "Kamandaran", effect: "Archer-line gold cost replaced by additional wood cost." },
        { name: "Citadels", effect: "Castles +4 attack, +3 vs. Rams, +3 vs. Infantry and receive -25% bonus damage." }
      ],
      uniqueUnits: [
        { name: "War Elephant", subtitle: "cavalry", upgradeName: "Elite War Elephant" },
        { name: "Savar", subtitle: "cavalry" }
      ]
    },
    poles: {
      name: "Poles",
      type: "Cavalry civilization",
      bonuses: [
        "Folwark replaces Mill",
        "Villagers regenerate 10/15/20 HP in Feudal/Castle/Imperial Age",
        "Stone Miners generate gold in addition to stone",
        "Bloodlines and Scout Cavalry-line upgrades cost -50% food"
      ],
      teamBonus: "Scout Cavalry-line +1 attack vs. Ranged Soldiers",
      uniqueTechs: [
        { name: "Szlachta Privileges", effect: "Light Cavalry costs -60% gold." },
        { name: "Lechitic Legacy", effect: "Cavalry generates gold when killing enemies." }
      ],
      uniqueUnits: [
        { name: "Obuch", upgradeName: "Elite Obuch" }
      ]
    },
    portuguese: {
      name: "Portuguese",
      type: "Naval and Gunpowder civilization",
      bonuses: [
        "Foragers generate wood in addition to food",
        "All units cost -20% gold",
        "Can build Feitoria in Imperial Age",
        "Ships +10/15/20% HP in Feudal/Castle/Imperial Age"
      ],
      teamBonus: "Technologies research +25% faster",
      uniqueTechs: [
        { name: "Circumnavigation", effect: "Sets the entire map to explored; Ships train 33% faster." },
        { name: "Arquebus", effect: "Gunpowder units 100% accuracy." }
      ],
      uniqueUnits: [
        { name: "Organ Gun", upgradeName: "Elite Organ Gun" }
      ]
    },
    romans: {
      name: "Romans",
      type: "Infantry and Cavalry civilization",
      bonuses: [
        "Villagers gather, build, and repair +5% faster",
        "Infantry armor upgrade effects are doubled",
        "Scorpions cost -50% gold",
        "Galley-line and Dromons +1 melee/+1 pierce armor"
      ],
      teamBonus: "Scorpions minimum range reduced",
      uniqueTechs: [
        { name: "Ballistas", effect: "Scorpions and War Galleys fire 33% faster." },
        { name: "Comitatenses", effect: "Infantry and cavalry created 50% faster; charge attack." }
      ],
      uniqueUnits: [
        { name: "Legionary", upgradeName: "Centurion" }
      ]
    },
    saracens: {
      name: "Saracens",
      type: "Camel and Naval civilization",
      bonuses: [
        "Market trading fee only 5%; Markets cost -100 wood",
        "Camel Units +25% HP",
        "Galley-line attacks +25% faster",
        "Transport Ships +100% HP, +20 carry capacity"
      ],
      teamBonus: "Foot Archers and Skirmishers +2 attack vs. buildings",
      uniqueTechs: [
        { name: "Bimaristan", effect: "Medical Caravan heals nearby units." },
        { name: "Madrasah", effect: "Monks refund 33% of their cost upon death." }
      ],
      uniqueUnits: [
        { name: "Mameluke", upgradeName: "Elite Mameluke" }
      ]
    },
    shu: {
      name: "Shu",
      type: "Archer and Siege civilization",
      bonuses: [
        "Lumberjacks generate food in addition to wood",
        "Archery Unit technologies at the Archery Range and Blacksmith cost -25%",
        "Siege Weapons and Siege Warships move +10/15% faster in Castle/Imperial Age"
      ],
      teamBonus: "Foot Archers +2 line of sight",
      uniqueTechs: [
        { name: "Unique Technology I", effect: "Mod effect." },
        { name: "Unique Technology II", effect: "Mod effect." }
      ],
      uniqueUnits: [
        { name: "Unique Unit", upgradeName: "Elite Unique Unit" }
      ]
    },
    sicilians: {
      name: "Sicilians",
      type: "Infantry and Cavalry civilization",
      bonuses: [
        "Start with +100 stone",
        "Farm upgrades provide +125% additional food",
        "Soldiers receive -40% bonus damage",
        "Can build Donjon in Dark Age, replaces Watch Tower-line",
        "Fortifications built +50% faster; Town Centers built +100% faster"
      ],
      teamBonus: "Transport Ships +5 line of sight and cost -50%",
      uniqueTechs: [
        { name: "First Crusade", effect: "Each Town Center spawns 7 Serjeants when researched." },
        { name: "Scutage", effect: "Each ally receives 15 gold per tributed unit." }
      ],
      uniqueUnits: [
        { name: "Serjeant", upgradeName: "Elite Serjeant" }
      ]
    },
    tatars: {
      name: "Tatars",
      type: "Cavalry Archer civilization",
      bonuses: [
        "Livestock animals last +50% longer",
        "Units deal +25% damage when fighting from higher elevation",
        "New Town Centers spawn 2 Sheep starting in Castle Age",
        "Thumb Ring, Parthian Tactics free"
      ],
      teamBonus: "Mounted Archers +2 line of sight",
      uniqueTechs: [
        { name: "Silk Armor", effect: "Steppe Lancers and Light Cavalry +1/+1 armor." },
        { name: "Timurid Siegecraft", effect: "Trebuchets +2 range; enables Flaming Camels." }
      ],
      uniqueUnits: [
        { name: "Keshik", upgradeName: "Elite Keshik" }
      ]
    },
    teutons: {
      name: "Teutons",
      type: "Infantry and Defensive civilization",
      bonuses: [
        "Farms cost -40%",
        "Town Centers +10 garrison capacity; Towers +5 garrison capacity",
        "Barracks and Stable Units +1/+2 melee armor in Castle/Imperial Age",
        "Monks +100% healing range",
        "Murder Holes, Herbal Medicine free"
      ],
      teamBonus: "Units more resistant to conversion",
      uniqueTechs: [
        { name: "Ironclad", effect: "Siege +4 melee armor." },
        { name: "Crenellations", effect: "Castles +3 range; garrisoned infantry can shoot." }
      ],
      uniqueUnits: [
        { name: "Teutonic Knight", upgradeName: "Elite Teutonic Knight" }
      ]
    },
    turks: {
      name: "Turks",
      type: "Gunpowder civilization",
      bonuses: [
        "Gold miners work +25% faster",
        "Scout Cavalry-line +1 pierce armor and upgrades free",
        "Chemistry free; Gunpowder technologies costs -50%",
        "Gunpowder Units +25% HP"
      ],
      teamBonus: "Gunpowder Units train +25% faster",
      uniqueTechs: [
        { name: "Sipahi", effect: "Cavalry Archers +20 HP." },
        { name: "Artillery", effect: "Bombard Cannons +2 range." }
      ],
      uniqueUnits: [
        { name: "Janissary", upgradeName: "Elite Janissary" }
      ]
    },
    tupi: {
      name: "Tupí",
      type: "Archer and Infantry civilization",
      bonuses: [
        "Start with +25 of each resource",
        "Villagers can garrison in Settlements",
        "Fallen units return 15% of their cost",
        "Archery Range and Barracks upgrades cost -50% food"
      ],
      teamBonus: "Towers and Castles provide +10 population space",
      uniqueTechs: [
        { name: "Caciques", effect: "Champi Warriors and Slingers attack faster." },
        { name: "Curare", effect: "Foot Archers and fortifications deal poison damage." }
      ],
      uniqueUnits: [
        { name: "Blackwood Archer", subtitle: "economic archer", upgradeName: "Elite Blackwood Archer" },
        { name: "Ibirapema Warrior", subtitle: "area infantry", upgradeName: "Elite Ibirapema Warrior" }
      ]
    },
    vietnamese: {
      name: "Vietnamese",
      type: "Archer civilization",
      bonuses: [
        "Enemy Town Centers are revealed at the start of the game",
        "Economic upgrades cost no wood and research +100% faster",
        "Archery Range units and Fire Lancers +20% HP",
        "Conscription free"
      ],
      teamBonus: "Imperial Skirmisher upgrade available in Imperial Age",
      uniqueTechs: [
        { name: "Chatras", effect: "Battle Elephants +50 HP." },
        { name: "Paper Money", effect: "Each ally receives 500 gold." }
      ],
      uniqueUnits: [
        { name: "Rattan Archer", upgradeName: "Elite Rattan Archer" }
      ]
    },
    vikings: {
      name: "Vikings",
      type: "Infantry and Naval civilization",
      bonuses: [
        "Wheelbarrow, Hand Cart free",
        "Infantry +20% HP starting in Feudal Age",
        "Warships cost -10/15/20% in Feudal/Castle/Imperial Age"
      ],
      teamBonus: "Docks cost -15%",
      uniqueTechs: [
        { name: "Chieftains", effect: "Infantry +5 attack vs cavalry." },
        { name: "Berserkergang", effect: "Berserks regenerate HP automatically." }
      ],
      uniqueUnits: [
        { name: "Berserk", upgradeName: "Elite Berserk" }
      ]
    },
    wei: {
      name: "Wei",
      type: "Cavalry civilization",
      bonuses: [
        "Receive one free Villager for each economic upgrade researched",
        "Hei Guang Cavalry and Xianbei Raider +20/30% HP in Castle/Imperial Age",
        "Traction Trebuchets and Lou Chuans cost -25%"
      ],
      teamBonus: "Cavalry +2 attack vs. Siege Weapons",
      uniqueTechs: [
        { name: "Unique Technology I", effect: "Mod effect." },
        { name: "Unique Technology II", effect: "Mod effect." }
      ],
      uniqueUnits: [
        { name: "Unique Unit", upgradeName: "Elite Unique Unit" }
      ]
    },
    wu: {
      name: "Wu",
      type: "Infantry and Naval civilization",
      bonuses: [
        "Military production buildings and Docks provide +55 food",
        "Infantry regenerates 10/15/30 HP per minute in Feudal/Castle/Imperial Age",
        "Jian Swordsmen and Hei Guang Cavalry +2 attack in Imperial Age",
        "Careening, Dry Dock free"
      ],
      teamBonus: "Houses built +100% faster",
      uniqueTechs: [
        { name: "Unique Technology I", effect: "Mod effect." },
        { name: "Unique Technology II", effect: "Mod effect." }
      ],
      uniqueUnits: [
        { name: "Unique Unit", upgradeName: "Elite Unique Unit" }
      ]
    }
  },

  uniqueTechsById: {
    "ui_uniquetech1": { name: "Unique Technology I", effect: "Unique technology for Castle Age." },
    "ui_uniquetech2": { name: "Unique Technology II", effect: "Unique technology for Imperial Age." },
    "armenians_uniquetech1": { name: "Cilician Fleet", effect: "Demolition Ships and Dromon fire additional projectile." },
    "armenians_uniquetech2": { name: "Fereters", effect: "Infantry except Spearmen line: +30 HP; Warrior Priests: +100% healing speed." },
    "aztecs_uniquetech1": { name: "Jaguar Claws", effect: "Jaguar Warriors +4 attack." },
    "aztecs_uniquetech2": { name: "Flowery Wars", effect: "Units lose 5 HP when killing but gain +4 attack." },
    "bengalis_uniquetech1": { name: "Palanquin of the Queen", effect: "Villagers work +35% faster." },
    "bengalis_uniquetech2": { name: "Mastery of Dwyaja", effect: "Battle Elephants +15 HP and +1 armor." },
    "berbers_uniquetech1": { name: "Berber Cavalry", effect: "Camels -30% research cost and train +30% faster." },
    "berbers_uniquetech2": { name: "Berber Cavalry", effect: "Camels -30% research cost and train +30% faster." },
    "bohemians_uniquetech1": { name: "Hussite Wagenburg", effect: "War Wagons shoot from melee range; garrisoned infantry shoots arrows." },
    "bohemians_uniquetech2": { name: "Hussite Wagenburg", effect: "War Wagons shoot from melee range; garrisoned infantry shoots arrows." },
    "britons_uniquetech1": { name: "Yeomen", effect: "Foot archers +1 range; Towers +2 attack." },
    "britons_uniquetech2": { name: "Warwolf", effect: "Trebuchets 100% accuracy and deal area damage." },
    "bulgarians_uniquetech1": { name: "Bulgarian Fire Launcher", effect: "Fire Launchers train +100% faster and cost -30%." },
    "bulgarians_uniquetech2": { name: "Boyar Blood", effect: "Boyars regenerate 10 HP per minute." },
    "burgundians_uniquetech1": { name: "First Crusade", effect: "Each Castle creates 5 Sergeants; improved conversion resistance." },
    "burgundians_uniquetech2": { name: "Hauberque", effect: "Knight line +1/+2 armor." },
    "burmese_uniquetech1": { name: "Elephant Battle Wagon", effect: "Battle Elephants available in Feudal Age; +3 HP regeneration." },
    "burmese_uniquetech2": { name: "Isolating Wall", effect: "Buildings +3 pierce armor." },
    "byzantines_uniquetech1": { name: "Cataphract Sarmatians", effect: "Cataphracts +30% HP." },
    "byzantines_uniquetech2": { name: "Greek Fire", effect: "Fire Ships and Dromon fire Greek fire." },
    "celts_uniquetech1": { name: "Celtic Fury", effect: "Infantry +25% attack speed." },
    "celts_uniquetech2": { name: "Celtic Fury", effect: "Infantry +25% attack speed." },
    "chinese_uniquetech1": { name: "Emperor Strategy", effect: "All Men-at-Arms +20 HP." },
    "chinese_uniquetech2": { name: "Powder Refinement", effect: "Gunpowder units fire +15% faster." },
    "cumans_uniquetech1": { name: "Cuman Horse Archers", effect: "Cavalry trains +25% faster." },
    "cumans_uniquetech2": { name: "Mongol Basaks", effect: "Cavalry +20% HP and +1/+2 armor." },
    "dravidians_uniquetech1": { name: "Shrivamsha Cavalry", effect: "Shrivamsha Cavalry +15 HP and +1 armor." },
    "dravidians_uniquetech2": { name: "Short Arm", effect: "Peons and Warrior Priests +20% attack speed." },
    "ethiopians_uniquetech1": { name: "Ethiopian Fire", effect: "Slingers +20 HP; Gunpowder +100% damage." },
    "ethiopians_uniquetech2": { name: "Ethiopian Fire", effect: "Slingers +20 HP; Gunpowder +100% damage." },
    "franks_uniquetech1": { name: "Frankish Cavalry", effect: "Cavalry trains +20% faster and costs -20%." },
    "franks_uniquetech2": { name: "Frankish Cavalry", effect: "Cavalry trains +20% faster and costs -20%." },
    "georgians_uniquetech1": { name: "Derbazi", effect: "Infantry +50 HP in Castle Age; +75 HP in Imperial Age." },
    "georgians_uniquetech2": { name: "Georgian Pride", effect: "Horses and Castles shoot arrows; infantry regenerate HP." },
    "goths_uniquetech1": { name: "Ironsides", effect: "Infantry -5/+10 melee armor in Feudal/Castle Age." },
    "goths_uniquetech2": { name: "Ironsides", effect: "Infantry -5/+10 melee armor in Feudal/Castle Age." },
    "gurjaras_uniquetech1": { name: "Battle Wagons", effect: "War Wagons available in Feudal Age; +3 attack speed." },
    "gurjaras_uniquetech2": { name: "Shrivamsha Cavalry", effect: "Men-at-Arms +20 HP; Shrivamsha Cavalry +3 attack." },
    "hindustanis_uniquetech1": { name: "Siege Elephant", effect: "Battle Elephants train +100% faster." },
    "hindustanis_uniquetech2": { name: "Fiery Mamelukes", effect: "Janissaries +15 HP." },
    "huns_uniquetech1": { name: "Nomads", effect: "Buildings construct without foundation." },
    "huns_uniquetech2": { name: "Frankish Cavalry", effect: "Cavalry +30% HP." },
    "incas_uniquetech1": { name: "Siege Platform", effect: "Siege trains +50% faster." },
    "incas_uniquetech2": { name: "Terraces", effect: "Economy +15%; Villagers gather +15% faster." },
    "italians_uniquetech1": { name: "Italian Battle Line", effect: "Infantry and crossbowmen +20% attack speed." },
    "italians_uniquetech2": { name: "Italian Battle Line", effect: "Infantry and crossbowmen +20% attack speed." },
    "japanese_uniquetech1": { name: "Samurai", effect: "Samurai train +50% faster." },
    "japanese_uniquetech2": { name: "Samurai", effect: "Samurai train +50% faster." },
    "jurchens_uniquetech1": { name: "Jurchen Armor", effect: "Infantry +2/+1 melee/pierce armor." },
    "jurchens_uniquetech2": { name: "Jurchen Cavalry", effect: "Cavalry train +33% faster." },
    "khitans_uniquetech1": { name: "Khitan Cataphract Sword", effect: "Infantry +30 HP." },
    "khitans_uniquetech2": { name: "Khitan Cavalry", effect: "Cavalry +20 HP and +1 armor." },
    "khmer_uniquetech1": { name: "Rice Gatherer", effect: "Villagers harvest farm +35% faster." },
    "khmer_uniquetech2": { name: "Battle Elephant", effect: "Battle Elephants +15 HP and +1 armor." },
    "koreans_uniquetech1": { name: "Goryeo Dynasty", effect: "Monks +50% HP and regenerate HP." },
    "koreans_uniquetech2": { name: "Turtle Ship", effect: "Turtle Ships train +50% faster." },
    "lithuanians_uniquetech1": { name: "Lithuanian Cavalry", effect: "Cavalry +20 HP and +1 armor." },
    "lithuanians_uniquetech2": { name: "Tribute", effect: "Each Castle generates gold passively." },
    "magyars_uniquetech1": { name: "Magyar Cavalry", effect: "Cavalry train +35% faster." },
    "magyars_uniquetech2": { name: "Magyar Cavalry", effect: "Cavalry train +35% faster." },
    "malay_uniquetech1": { name: "Malay War Wagon", effect: "War Wagons train +100% faster and cost -50%." },
    "malay_uniquetech2": { name: "Malay War Wagon", effect: "War Wagons train +100% faster and cost -50%." },
    "malians_uniquetech1": { name: "Griot Bow", effect: "Foot archers +4 attack." },
    "malians_uniquetech2": { name: "Gold Armor", effect: "Infantry +4/+4 armor." },
    "mapuche_uniquetech1": { name: "Mapuche Cavalry", effect: "Scout Cavalry +30 HP." },
    "mapuche_uniquetech2": { name: "Mapuche Cavalry", effect: "Scout Cavalry +30 HP." },
    "mayans_uniquetech1": { name: "El Dorado", effect: "Jaguars +4 attack; Puma Warriors train faster." },
    "mayans_uniquetech2": { name: "Observatory", effect: "University research +50% faster." },
    "mongols_uniquetech1": { name: "Mongol Composite Bow", effect: "Mounted archers +2 range." },
    "mongols_uniquetech2": { name: "Mongol Composite Bow", effect: "Mounted archers +2 range." },
    "muisca_uniquetech1": { name: "Muisca Cavalry", effect: "Cavalry +20 HP and train faster." },
    "muisca_uniquetech2": { name: "Muisca Cavalry", effect: "Cavalry +20 HP and train faster." },
    "persians_uniquetech1": { name: "Persian Battle Elephant", effect: "Battle Elephants +20 HP." },
    "persians_uniquetech2": { name: "Horse Race", effect: "Cavalry train +40% faster." },
    "poles_uniquetech1": { name: "Polish Hussars", effect: "Light cavalry train faster and have better armor." },
    "poles_uniquetech2": { name: "Polish Hussars", effect: "Light cavalry train faster and have better armor." },
    "portuguese_uniquetech1": { name: "Horse Race", effect: "Cavalry train +20% faster." },
    "portuguese_uniquetech2": { name: "Horse Race", effect: "Cavalry train +20% faster." },
    "romans_uniquetech1": { name: "Legionary", effect: "Infantry +50% HP." },
    "romans_uniquetech2": { name: "Legionary", effect: "Infantry +50% HP." },
    "saracens_uniquetech1": { name: "Saracen Cavalry", effect: "Light cavalry +20% HP." },
    "saracens_uniquetech2": { name: "Saracen Cavalry", effect: "Light cavalry +20% HP." },
    "shu_uniquetech1": { name: "Shu Cavalry", effect: "Cavalry +15 HP and +1 armor." },
    "shu_uniquetech2": { name: "Shu Administration", effect: "Villagers work +35% faster." },
    "sicilians_uniquetech1": { name: "Sicilian Fury", effect: "Infantry and cavalry +25% attack speed." },
    "sicilians_uniquetech2": { name: "Sicilian Fury", effect: "Infantry and cavalry +25% attack speed." },
    "slavs_uniquetech1": { name: "Slavic Infantry", effect: "Infantry +25% attack speed." },
    "slavs_uniquetech2": { name: "Slavic Infantry", effect: "Infantry +25% attack speed." },
    "spanish_uniquetech1": { name: "Conquest", effect: "Conquistadors train +33% faster." },
    "spanish_uniquetech2": { name: "Ship", effect: "Trade Cog train +100% faster." },
    "tatars_uniquetech1": { name: "Silk Armor", effect: "Steppe Lancers and Light Cavalry +1/+1 armor." },
    "tatars_uniquetech2": { name: "Timurid Siegecraft", effect: "Trebuchets +2 range; enables Fire Camel." },
    "teutons_uniquetech1": { name: "Ironclad", effect: "Siege +4 melee armor." },
    "teutons_uniquetech2": { name: "Crenellations", effect: "Castles +3 range; garrisoned infantry can shoot." },
    "turks_uniquetech1": { name: "Sipahi", effect: "Mounted archers +20 HP." },
    "turks_uniquetech2": { name: "Artillery", effect: "Bombard Cannons +2 range." },
    "tupi_uniquetech1": { name: "Caciques", effect: "Champi Warriors and slingers attack faster." },
    "tupi_uniquetech2": { name: "Curare", effect: "Foot archers and fortifications deal poison damage." },
    "vietnamese_uniquetech1": { name: "Weapon Armament", effect: "All Archers cost -30% and train faster." },
    "vietnamese_uniquetech2": { name: "Fire Explosion", effect: "Gunpowder fire +50% faster." },
    "vikings_uniquetech1": { name: "Viking Fury", effect: "Infantry +25% attack speed." },
    "vikings_uniquetech2": { name: "Longboat", effect: "Longboats shoot arrows." },
    "wei_uniquetech1": { name: "Wei Cavalry", effect: "Cavalry +15 HP and +1 armor." },
    "wei_uniquetech2": { name: "Wei Administration", effect: "Monks +40 HP and regenerate HP." },
    "wu_uniquetech1": { name: "Red Cliff Tactics", effect: "Demolition Ships and Fire Archers deal flame damage to ships and buildings." },
    "wu_uniquetech2": { name: "Sitting Tiger", effect: "Traction Trebuchets and Lou Chuans shoot additional projectiles." }
  }
};
