'use strict';
const LOCALE_EN = {

  ui: {
    legend:             "Legend",
    language:           "Language",
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
    hp:                 "HP",
    attack:             "ATK",
    armor_m:            "M.Arm",
    armor_p:            "P.Arm",
    range:              "RNG",
    speed:              "SPD",
    rof:                "RoF",
    blast_r:            "Blast R.",
    los:                "LoS",
    train:              "Train",
    build_cost:         "Build Cost",
    research_cost:      "Research Cost",
    train_cost:         "Train Cost",
    repair_cost:        "Repair (full HP)",
    build_efficiency:   "Build time vs. workers  ·  3t⁄(n+2)",
    prereq:             "Prerequisites",
    missing:            "Not available for this civilization",
    click_simulate:     "Click to simulate",
    other_effects:      "Other effects (not numeric)",
    click_details:      "Click for details",
    relevant_units:     "Relevant Units",
    classic_tree:       "Classic Tree",
    close:              "Close",
    unique_unit:        "Unique Unit",
    unique_units:       "Unique Units",
    unique_techs:       "Unique Technologies",
    team_bonus:         "Team Bonus",
    bonus_affected:     "Affected by Bonuses",
    elite_version:      "Elite version",
    ally_team:          "Allied Team",
    add_ally:           "+ Add ally…",
    remove:             "Remove",
    simulate:           "Simulate with technologies",
    applies_to:         "Applies to",
    no_data:            "No specific data for this civilization.",
    no_stats:           "Stats not available.",
    civ_bonuses:        "Bonuses:",
    techs_short:        "tech(s)",
    ally:               "ally",
    allies:             "allies",
    bonus_hint:         "Highlights what it affects in the tree · click to pin",
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
    heavy_warships:      "Heavy Warships",
    unique_units:        "Unique Units",
    walls:               "Walls & Gates",
    castles:             "Castles",
    cavalry_archers:     "Mounted Archers",
    heroes:              "Heroes & Kings",
    skirmishers:         "Skirmishers",
    houses:              "Houses",
  },


  ages: {
    0: "Dark Age",
    1: "Feudal Age",
    2: "Castle Age",
    3: "Imperial Age",
  },

  ages_short: {
    0: "Dark",
    1: "Feudal",
    2: "Castle",
    3: "Imperial",
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
    mill:           "Mill",
    farm:           "Farm",
    fishtrap:       "Fish Trap",
    lumber:         "Lumber Camp",
    mining:         "Mining Camp",
    tahsili:        "Settlement",
    mulecart:       "Mule Cart",
    outpost:        "Outpost",
    watchtower:     "Watch Tower",
    palisadewall:   "Palisade Wall",
    palisadegate:   "Palisade Gate",
    stonewall:      "Stone Wall",
    gate:           "Gate",
    guardtower:     "Guard Tower",
    keep:           "Keep",
    bombardtower:   "Bombard Tower",
    fortifiedwall:  "Fortified Wall",
    house:          "House",
    pasture:        "Pasture",
    krepost:        "Krepost",
    donjon:         "Donjon",
    feitoria:       "Feitoria",
    folwark:        "Folwark",
    caravanserai:   "Caravanserai",
    fortified_church: "Fortified Church",
    harbor:         "Harbor",
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
    thumbring:    { name: 'Thumb Ring',             effect: 'Archery Units attack +15% faster. Archery Units and Skirmishers fire with 100% accuracy.' },
    parthian:     { name: 'Parthian Tactics',       effect: 'Mounted Archers +1 melee/+2 pierce armor; +2 attack vs. Spearman-line.' },

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
    fletching:        { name: 'Fletching',               effect: 'Archery Units, Skirmishers, ranged Warships, ranged Fortifications +1 attack, +1 range; Town Centers +1 attack.' },
    bodkinarrow:      { name: 'Bodkin Arrow',            effect: 'Archery Units, Skirmishers, ranged Warships, ranged Fortifications +1 attack, +1 range; Town Centers +1 attack.' },
    bracer:           { name: 'Bracer',                  effect: 'Archery Units, Skirmishers, ranged Warships, ranged Fortifications +1 attack, +1 range; Town Centers +1 attack.' },

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
    drydock:      { name: 'Dry Dock',               effect: 'Ships +1 pierce armor.' },
    shipwright:   { name: 'Shipwright',             effect: 'Ships cost -20% wood and build +50% faster.' },
    fishing_lines:{ name: 'Fishing Lines',          effect: 'Fishing Ships gather +10% faster and carry +5 resources.' },
    gillnets:     { name: 'Gillnets',               effect: 'Fishing Ships work 10% faster and carry +5 resources.' },
    dragon_ship:  { name: 'Dragon Ship',            effect: '[Chinese only] Fire Ship upgrade.' },
    dromon:       { name: 'Dromon',                 effect: 'Anti-building siege warship with blast attack.' },
    lou_chuan:    { name: 'Lou Chuan',              effect: '[Chinese civs] Large regional warship.' },
    catapult_gall:{ name: 'Catapult Galley',        effect: '[American civs only] Siege ship.' },
    turtle_ship:  { name: 'Turtle Ship',            effect: '[Koreans only] Armored close-range warship.' },
    longship:     { name: 'Longship',               effect: '[Regional: Danes, Saxons, Varangians, Vikings] Warship that fires multiple arrows. Formerly the Viking unique Longboat.' },
    elite_longship:{ name: 'Elite Longship',        effect: 'Longship upgrade: +5 HP, +2 attack, +1 range and +1/+3 armor.' },
    caravel_d:    { name: 'Caravel',                effect: '[Portuguese only] Warship with pass-through attack.' },
    thirisadai:   { name: 'Thirisadai',             effect: '[Dravidians only] Massive warship.' },
    harbor:       { name: 'Harbor',                 effect: '[Malay only] Defensive dock that shoots arrows.' },

    // ── University ───────────────────────────────────────────
    masonry:          { name: 'Masonry',                 effect: 'Buildings +10% HP, +1 melee/+1 pierce armor and +3 building armor.' },
    architecture:     { name: 'Architecture',            effect: 'Buildings +10% HP, +1 melee/+1 pierce armor and +3 building armor.' },
    ballistics:       { name: 'Ballistics',              effect: 'Towers and TCs aim at moving units.' },
    chemistry:        { name: 'Chemistry',               effect: '+1 projectile attack. Enables Hand Cannoneers and Bombard Cannons.' },
    murderhole:       { name: 'Murder Holes',            effect: 'Castles and Towers have no minimum range.' },
    siegeengineers:   { name: 'Siege Engineers',         effect: 'Ranged Siege Weapons and Siege Warships +1 range. All Siege Weapons and Siege Warships +20% attack vs. buildings; Demolition Units +40% attack vs. buildings.' },
    treadmillcrane:   { name: 'Treadmill Crane',         effect: 'Buildings are constructed 20% faster.' },
    heatedshot:       { name: 'Heated Shot',             effect: 'Towers +125% attack vs. ships; Castles and Docks +4 attack vs. ships.' },
    careening:        { name: 'Careening',               effect: 'Increases +1 pierce armor.' },
    clinker_construction: { name: 'Clinker Construction',effect: 'Increases speed by 10%.' },
    carvel_hull:      { name: 'Carvel Hull',             effect: 'Ships move +10% faster.' },
    siphons:          { name: 'Greek Fire Siphons',      effect: 'Fire Galleys gain an explosive charge attack.' },
    incendiaries:     { name: 'Incendiaries',            effect: 'Fire Galleys detonate when sunk, dealing damage around them.' },
    arrowslits:       { name: 'Arrowslits',              effect: 'Watch Towers +1, Guard Towers +2, Keeps and Donjons +3 attack.' },

    // ── Monastery ────────────────────────────────────────────
    monk:         { name: 'Monk',                   effect: 'Heals allies and converts enemies.' },
    redemption:   { name: 'Redemption',             effect: 'Monks can convert buildings.' },
    atonement:    { name: 'Atonement',              effect: 'Monks can convert other monks.' },
    heresy:       { name: 'Heresy',                 effect: 'Units converted by enemy die instead.' },
    sanctity:     { name: 'Sanctity',               effect: 'Monks +15 HP.' },
    fervor:       { name: 'Fervor',                 effect: 'Monks +15% speed.' },
    herbalmedicine:{ name: 'Herbal Medicine',       effect: 'Units garrisoned in buildings heal +500% faster.' },
    illumination: { name: 'Illumination',           effect: 'Monastery Units regain their faith +100% faster after a successful conversion.' },
    blockprinting:{ name: 'Block Printing',         effect: 'Monks +3 conversion range.' },
    theocracy:    { name: 'Theocracy',              effect: 'Only one monk must rest after group conversion.' },
    faith:        { name: 'Faith',                  effect: 'Units are 50% harder for enemy Monks to convert.' },
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
    hoardings:    { name: 'Hoardings',              effect: 'Castles, Kreposts and Donjons +1,000 HP.' },
    conscription: { name: 'Conscription',           effect: 'Units created 33% faster.' },
    sappers:      { name: 'Sappers',                effect: 'Villagers +15 attack vs. buildings and +3 attack vs. rams.' },
    kipchak_c:    { name: 'Kipchak',                effect: '[Cumans/Team] Fast cavalry archer.' },
    krepost:      { name: 'Krepost',                effect: '[Bulgarians only] Minor castle. Creates Konniks.' },
    donjon:       { name: 'Donjon',                 effect: '[Sicilians only] Tower that trains Serjeants.' },

    // ── Market ───────────────────────────────────────────────
    tradecart:    { name: 'Trade Cart',             effect: 'Generates gold by trading with allied Markets.' },
    coinage:      { name: 'Coinage',                effect: 'Tributes to other players cost only 20%.' },
    banking:      { name: 'Banking',                effect: 'No tax on tributes.' },
    guilds:       { name: 'Guilds',                 effect: 'Market trading fee reduced to 15%.' },
    feitoria:     { name: 'Feitoria',               effect: '[Portuguese only] Automatically generates resources.' },
    caravanserai: { name: 'Caravanserai',           effect: '[Hindustanis & Persians] Heals and speeds up trade carts.' },

    // ── Town Center ──────────────────────────────────────────
    villager:     { name: 'Villager',               effect: 'Basic resource-gathering and building unit.' },
    loom:         { name: 'Loom',                   effect: 'Villagers +15 HP, +1/+2 armor.' },
    wheelbarrow:  { name: 'Wheelbarrow',            effect: 'Villagers +25% carry capacity and move +10% faster.' },
    townwatch:    { name: 'Town Watch',             effect: '+4 line of sight for Town Centers.' },
    handcart:     { name: 'Hand Cart',              effect: 'Villagers +50% carry capacity and move +10% faster.' },
    townpatrol:   { name: 'Town Patrol',            effect: 'Buildings +4 line of sight.' },
    feudalage:    { name: 'Feudal Age',             effect: 'Advance to the Feudal Age.' },
    castleage:    { name: 'Castle Age',             effect: 'Advance to the Castle Age.' },
    imperialage:  { name: 'Imperial Age',           effect: 'Advance to the Imperial Age.' },

    // ── Mill ─────────────────────────────────────────────────
    horsecollar:  { name: 'Horse Collar',           effect: 'Farms produce 75 extra food.' },
    heavyplow:    { name: 'Heavy Plow',             effect: 'New Farms provide +125 food. Farmers +1 carry capacity. Existing Farms provide a smaller food amount.' },
    croprotation: { name: 'Crop Rotation',          effect: 'New Farms provide +175 food. Existing Farms provide a smaller food amount.' },
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
    heavyplow_t:    { name: 'Heavy Plow',          effect: 'New Farms provide +125 food. Farmers +1 carry capacity. Existing Farms provide a smaller food amount.' },
    croprotation_t: { name: 'Crop Rotation',       effect: 'New Farms provide +175 food. Existing Farms provide a smaller food amount.' },
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

    // ── The Viking Sagas (update 185872) ─────────────────────
    mounted_crossbow:       { name: 'Mounted Crossbowman',         effect: '[Regional] Mounted archer with a powerful but slow attack. Replaces the Cavalry Archer for most European civs.' },
    heavy_mounted_crossbow: { name: 'Heavy Mounted Crossbowman',   effect: 'Mounted Crossbowman upgrade: +10 HP and +1 attack.' },
    cranequins:             { name: 'Cranequins',                  effect: 'Mounted Crossbowmen +1 range and +2 attack vs. infantry.' },
    varangian_guard:        { name: 'Varangian Guard',             effect: '[Regional] Shock infantry that generates gold when fighting other units.' },
    elite_varangian_guard:  { name: 'Elite Varangian Guard',       effect: 'Varangian Guard upgrade: +10 HP, +4 attack and +1 pierce armor.' },

    // ── Tower and wall upgrades (University) ─────────────────
    guardtower_tech:    { name: 'Guard Tower',     effect: 'Upgrades Watch Towers to Guard Towers.' },
    keep_tech:          { name: 'Keep',            effect: 'Upgrades Guard Towers to Keeps.' },
    bombardtower_tech:  { name: 'Bombard Tower',   effect: 'Allows building Bombard Towers (requires Chemistry).' },
    fortifiedwall_tech: { name: 'Fortified Wall',  effect: 'Upgrades Stone Walls to Fortified Walls.' },

    // ── Other game-tree nodes ─────────────────────────────────
    fishtrap:     { name: 'Fish Trap',             effect: 'Floating farm: a food source for Fishing Ships.' },
    spy:          { name: 'Spies/Treason',         effect: 'Reveals all enemy units and buildings.' },
    devotion:     { name: 'Devotion',              effect: 'Units are 15% harder for enemy Monks to convert.' },
    caravan:      { name: 'Caravan',               effect: 'Trade Units move +20% faster.' },
    domestication:{ name: 'Domestication',         effect: 'New Pastures provide +1 animal. Existing Pastures provide a smaller food amount.' },
    pastoralism:  { name: 'Pastoralism',           effect: 'New Pastures provide +2 animals. Existing Pastures provide a smaller food amount.' },
    transhumance: { name: 'Transhumance',          effect: 'New Pastures provide +3 animals. Existing Pastures provide a smaller food amount.' },
    elite_genitour:     { name: 'Elite Genitour',            effect: 'Genitour upgrade.' },
    elite_turtle_ship:  { name: 'Elite Turtle Ship',         effect: 'Turtle Ship upgrade.' },
    elite_caravel:      { name: 'Elite Caravel',             effect: 'Caravel upgrade.' },
    elite_bolas_rider:  { name: 'Elite Bolas Rider',         effect: 'Bolas Rider upgrade.' },
    elite_temple_guard: { name: 'Elite Temple Guard',        effect: 'Temple Guard upgrade.' },
    elite_ibirapema:    { name: 'Elite Ibirapema Warrior',   effect: 'Ibirapema Warrior upgrade.' },
    cao_cao:      { name: 'Cao Cao',               effect: '[Wei hero] Can be trained once at the Castle.' },
    liu_bei:      { name: 'Liu Bei',               effect: '[Shu hero] Can be trained once at the Castle.' },
    sun_jian:     { name: 'Sun Jian',              effect: '[Wu hero] Can be trained once at the Castle.' },
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
        { name: "Cilician Fleet", effect: "Demolition Ships +20% blast radius; Galley-line and Dromons +1 range." },
        { name: "Fereters", effect: "Infantry (except Spearman-line) +30 HP; Warrior Priests heal +100% faster." }
      ],
      uniqueUnits: [
        { name: "Composite Bowman", subtitle: "foot archer", upgradeName: "Elite Composite Bowman" },
        { name: "Warrior Priest", subtitle: "infantry" }
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
        { name: "Atlatl", effect: "Skirmishers +1 attack, +1 range." },
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
        { name: "Paiks", effect: "Rathas and Elephant Units attack +20% faster." },
        { name: "Mahayana", effect: "Villagers and Monks take -10% population space." }
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
        { name: "Kasbah", effect: "Team Castles work +25% faster." },
        { name: "Maghrebi Camels", effect: "Camel Units regenerate 15 HP per minute." }
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
        { name: "Manipur Cavalry", effect: "Cavalry +4 attack vs. Ranged Soldiers." },
        { name: "Howdah", effect: "Battle Elephants +1 melee/+1 pierce armor." }
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
        { name: "Greek Fire", effect: "Fire Ships +1 range; Dromons and Bombard Towers increased blast radius." },
        { name: "Logistica", effect: "Cataphracts and Varangian Guards deal trample damage." }
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
        { name: "Wagenburg Tactics", effect: "Gunpowder Units move +10% faster." },
        { name: "Hussite Reforms", effect: "Monks and Monastery technologies gold cost is replaced by food cost." }
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
        { name: "Burgundian Vineyards", effect: "Farmers slowly generate gold in addition to food." },
        { name: "Flemish Revolution", effect: "All existing Villagers are transformed to Flemish Militia." }
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
        { name: "Yeomen", effect: "Foot Archers and Skirmisher-line +1 range; Watch Tower-line +2 attack." },
        { name: "Warwolf", effect: "Trebuchets deal blast damage and are more accurate." }
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
        { name: "Stirrups", effect: "Cavalry attacks +33% faster." },
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
        { name: "Stronghold", effect: "Castles and Watch Tower-line attack +33% faster; Castles heal allied Infantry in a 7 tile radius." },
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
        { name: "Great Wall", effect: "Walls, Watch Tower-line and Bombard Towers +30% HP." },
        { name: "Rocketry", effect: "Scorpions, Rocket Carts and Lou Chuans +25% attack; Lou Chuans fire rockets." }
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
        { name: "Eupseong", effect: "Watch Tower-line +2 range." },
        { name: "Shinkichon", effect: "Rocket Carts and Turtle Ships +1 range, fire additional projectiles." }
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
        { name: "Steppe Husbandry", effect: "Scout Cavalry-line, Steppe Lancers and Cavalry Archers train +100% faster." },
        { name: "Cuman Mercenaries", effect: "All team members can train 5 free Elite Kipchaks per Castle." }
      ],
      uniqueUnits: [
        { name: "Kipchak", upgradeName: "Elite Kipchak" }
      ]
    },
    danes: {
      name: "Danes",
      type: "Infantry and Siege civilization",
      bonuses: [
        "Fishing Ships and Villagers drop off +5% food",
        "Loot 25% of the resource cost of each destroyed building",
        "Barracks and Siege Workshop upgrades cost -66% gold",
        "Varangian Guards and Longships move +10% faster"
      ],
      teamBonus: "Siege Weapons +2 line of sight",
      uniqueTechs: [
        { name: "Hamask", effect: "Infantry deal more damage as they lose HP." },
        { name: "Northmen's Fury", effect: "Mangonel-line and Catapult Galleons +1 range; Siege Weapons and Siege Warships +40% attack vs buildings." }
      ],
      uniqueUnits: [
        { name: "Jomsviking", subtitle: "infantry", upgradeName: "Elite Jomsviking" }
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
        { name: "Medical Corps", effect: "Elephant Units regenerate 30 HP per minute." },
        { name: "Wootz Steel", effect: "Infantry and Cavalry attacks ignore armor." }
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
        { name: "Detinets", effect: "Replaces 40% of Castle and Watch Tower-line stone cost with additional wood cost." },
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
        { name: "Inquisition", effect: "Monks and Missionaries convert faster; Missionaries +1 range." },
        { name: "Supremacy", effect: "Villagers +40 HP, +6 attack, +2 melee/+2 pierce armor." }
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
        { name: "Torsion Engines", effect: "Siege Workshop Units' blast radius increased." }
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
        { name: "Ordonnance Companies", effect: "Mounted Crossbowmen cost -40% gold." },
        { name: "Chivalry", effect: "Stables work +40% faster." }
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
        { name: "Svan Towers", effect: "Fortifications +2 attack; Watch Tower-line deals pass through damage." },
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
        { name: "Anarchy", effect: "Huskarls can be trained at Barracks." },
        { name: "Perfusion", effect: "Barracks work +100% faster." }
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
        "Mounted Units deal +20/30/40% bonus damage in Feudal/Castle/Imperial Age"
      ],
      teamBonus: "Camel and Elephant Units train +25% faster",
      uniqueTechs: [
        { name: "Kshatriyas", effect: "Military Units cost -25% food." },
        { name: "Frontier Guards", effect: "Camel Riders and Elephant Archers +4 melee armor." }
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
        { name: "Marauders", effect: "Tarkans can be trained at Stables." },
        { name: "Atheism", effect: "Enemy Relics generate -50% resources; Wonder and Relic victory takes +100 years." }
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
        { name: "Andean Sling", effect: "Skirmishers and Slingers no minimum range; Slingers +1 attack." },
        { name: "Fabric Shields", effect: "Kamayuks, Slingers and Champi Warriors +1 melee/+1 pierce armor." }
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
        { name: "Pirotechnia", effect: "Hand Cannoneers deal +15% pass through damage and are more accurate." }
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
        { name: "Yasama", effect: "Watch Tower-line fires additional arrows." },
        { name: "Kataparuto", effect: "Trebuchets attack and pack/unpack faster." }
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
        { name: "Fortified Bastions", effect: "Fortifications and Town Centers regenerate 500 HP per minute." },
        { name: "Thunderclap Bombs", effect: "Rocket Carts, Grenadiers and Lou Chuans detonate when defeated; projectiles produce additional explosions." }
      ],
      uniqueUnits: [
        { name: "Iron Pagoda", upgradeName: "Elite Iron Pagoda" }
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
        { name: "Lamellar Armor", effect: "Infantry and Skirmishers reflect 25% melee damage back to the attacker." },
        { name: "Ordo Cavalry", effect: "Cavalry regenerates HP in combat." }
      ],
      uniqueUnits: [
        { name: "Liao Dao", upgradeName: "Elite Liao Dao" }
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
        { name: "Hill Forts", effect: "Town Centers +3 range." },
        { name: "Tower Shields", effect: "Spearman-line and Skirmishers +2 pierce armor." }
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
        { name: "Corvinian Army", effect: "Magyar Huszar gold cost is replaced by additional food cost." },
        { name: "Recurve Bow", effect: "Mounted Archers +1 attack, +1 range." }
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
        { name: "Thalassocracy", effect: "Docks are upgraded to Harbors." },
        { name: "Forced Levy", effect: "Militia-line gold cost is replaced by additional food cost." }
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
        { name: "Tigui", effect: "Town Centers fire arrows without garrison." },
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
        { name: "Butalmapu", effect: "Team Castle Unique Units and Bolas Riders cost -15%." }
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
        { name: "Hul'che Javelineers", effect: "Skirmishers fire an additional projectile." },
        { name: "Holcans", effect: "Eagle Warriors +40 HP." }
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
        { name: "Nomads", effect: "Lost Houses do not decrease population space." },
        { name: "Drill", effect: "Siege Workshop Units move +50% faster." }
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
        { name: "Herbalism", effect: "Archer-line and Champi Warriors move +15% faster." },
        { name: "Huaracas", effect: "Slingers +1 range; train +50% faster." }
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
        { name: "Szlachta Privileges", effect: "Knight-line costs -60% gold." },
        { name: "Lechitic Legacy", effect: "Scout Cavalry-line deals trample damage." }
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
        { name: "Circumnavigation", effect: "Sets the entire map to explored; Ships train +33% faster." },
        { name: "Arquebus", effect: "Gunpowder Units fire more accurately at moving targets." }
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
        { name: "Ballistas", effect: "Scorpions attack +33% faster; Galley-line +2 attack." },
        { name: "Comitatenses", effect: "Militia-line, Knight-line, and Centurions train +50% faster and receive a charge attack." }
      ],
      uniqueUnits: [
        { name: "Centurion", subtitle: "cavalry", upgradeName: "Elite Centurion" }
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
        { name: "Bimaristan", effect: "Monks passively heal multiple nearby units." },
        { name: "Counterweights", effect: "Trebuchets and Mangonel-line +15% attack." }
      ],
      uniqueUnits: [
        { name: "Mameluke", upgradeName: "Elite Mameluke" }
      ]
    },
    saxons: {
      name: "Saxons",
      type: "Infantry and Defensive civilization",
      bonuses: [
        "Mills, Lumber- and Mining Camps provide +35 food and +10 stone when built",
        "Foot Soldiers cost -5% per Town Center or Castle controlled (maximum -20%)",
        "Towers and Castles fire +100% base arrows starting in Castle Age",
        "Longships and Catapult Galleons +20% HP"
      ],
      teamBonus: "Repairers work +25% faster",
      uniqueTechs: [
        { name: "Clerical Recruitment", effect: "Monks +1 conversion range; train +33% faster." },
        { name: "Shield Wall", effect: "Infantry gain additional armor when massed." }
      ],
      uniqueUnits: [
        { name: "Hearth Troop", subtitle: "infantry", upgradeName: "Elite Hearth Troop" }
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
        { name: "Coiled Serpent Array", effect: "Spearman-line and White Feather Guards gain additional HP when near each other." },
        { name: "Bolt Magazine", effect: "Archer-line, War Chariots and Lou Chuans fire additional projectiles." }
      ],
      uniqueUnits: [
        { name: "White Feather Guard", upgradeName: "Elite White Feather Guard" }
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
        { name: "First Crusade", effect: "Up to 5 Town Centers spawn 5 Serjeants each; units more resistant to conversion." },
        { name: "Hauberk", effect: "Knight-line +1 melee/+2 pierce armor." }
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
        { name: "Silk Armor", effect: "Scout Cavalry-line, Steppe Lancers and Cavalry Archers +1 melee/+1 pierce armor." },
        { name: "Timurid Siegecraft", effect: "Trebuchets +2 range." }
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
        "Infantry and Mounted Units +1/+2 melee armor in Castle/Imperial Age",
        "Monks +100% healing range",
        "Murder Holes, Herbal Medicine free"
      ],
      teamBonus: "Units more resistant to conversion",
      uniqueTechs: [
        { name: "Ironclad", effect: "Siege Weapons +4 melee armor." },
        { name: "Crenellations", effect: "Castles +3 range, garrisoned Infantry fires arrows." }
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
        { name: "Sipahi", effect: "Mounted Archers +20 HP." },
        { name: "Artillery", effect: "Bombard Towers, Bombard Cannons, Cannon Galleons +2 range." }
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
        { name: "Caciques", effect: "Champi Warriors and Slingers attack +25% faster." },
        { name: "Curare", effect: "Foot Archers and Fortifications deal poison damage." }
      ],
      uniqueUnits: [
        { name: "Blackwood Archer", subtitle: "economic archer", upgradeName: "Elite Blackwood Archer" },
        { name: "Ibirapema Warrior", subtitle: "area infantry", upgradeName: "Elite Ibirapema Warrior" }
      ]
    },
    varangians: {
      name: "Varangians",
      type: "Cavalry and Naval civilization",
      bonuses: [
        "Shepherding, fishing, and hunting also generate gold",
        "Bloodlines and Caravan effects +50%",
        "Varangian Guards attack +25% faster and generate +50% gold",
        "Longships and Catapult Galleons attack +15% faster"
      ],
      teamBonus: "Knight-line +1 attack vs. Infantry",
      uniqueTechs: [
        { name: "Vendel Legacy", effect: "Knight-line deals trample damage." },
        { name: "Gothikon", effect: "Varangian Guards throw axes periodically." }
      ],
      uniqueUnits: [
        { name: "Jarl", subtitle: "cavalry", upgradeName: "Elite Jarl" }
      ]
    },
    vietnamese: {
      name: "Vietnamese",
      type: "Archer civilization",
      bonuses: [
        "Enemy Town Centers are revealed at the start of the game",
        "Economic upgrades cost no wood and research +100% faster",
        "Foot Archers and Skirmishers +20% HP",
        "Conscription free"
      ],
      teamBonus: "Imperial Skirmisher upgrade available in Imperial Age",
      uniqueTechs: [
        { name: "Chatras", effect: "Battle Elephants +100 HP." },
        { name: "Paper Money", effect: "Lumberjacks slowly generate gold in addition to wood." }
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
        { name: "Chieftains", effect: "Infantry +5 attack vs. Cavalry, +4 vs. Camel Units." },
        { name: "Bogsveigar", effect: "Archer-line and Longships +1 attack." }
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
        { name: "Tuntian", effect: "Soldiers passively produce food." },
        { name: "Ming Guang Armor", effect: "Mounted Units +4 melee armor." }
      ],
      uniqueUnits: [
        { name: "Tiger Cavalry", upgradeName: "Elite Tiger Cavalry" }
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
        { name: "Red Cliffs Tactics", effect: "Demolition Ships and Fire Archers deal fire damage to ships and buildings." },
        { name: "Sitting Tiger", effect: "Traction Trebuchets and Lou Chuan trebuchet weapons fire additional projectiles." }
      ],
      uniqueUnits: [
        { name: "Fire Archer", upgradeName: "Elite Fire Archer" }
      ]
    }
  }
};
