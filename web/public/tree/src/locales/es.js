'use strict';
const LOCALE_ES = {

  ui: {
    legend:             "Leyenda",
    unit:               "Unidad",
    building:           "Edificio",
    tech:               "Tecnología",
    upgrade:            "Mejora",
    unique:             "Único",
    lg_common:          "Gen.",
    lg_regional:        "Reg.",
    lg_unique:          "Único",
    version:            "Versión",
    zoom_in:            "Acercar",
    zoom_out:           "Alejar",
    fit:                "Ajustar",
    search_placeholder: "Buscar...",
    hp:                 "PV",
    attack:             "ATQ",
    armor_m:            "ARM-C",
    armor_p:            "ARM-P",
    range:              "ALC",
    melee_range:        "CaC",
    speed:              "VEL",
    rof:                "CdF",
    blast_r:            "R. Expl.",
    los:                "LDV",
    train:              "Prod.",
    cost:               "Costo",
    build_cost:         "Costo de Construcción",
    research_cost:      "Costo de Investigación",
    train_cost:         "Costo de Entrenamiento",
    repair_cost:        "Reparar (HP completo)",
    build_efficiency:   "Tiempo de construcción vs. aldeanos  ·  3t⁄(n+2)",
    prereq:             "Requisitos",
    missing:            "No disponible para esta civilización",
    bonus_dmg:          "Daño adicional",
  },

  bonus_targets: {
    shock_infantry:      "Inf. de Choque",
    standard_buildings:  "Edif. Estándar",
    all_buildings:       "Todos los Edif.",
    stone_defense:       "Defensa de Piedra",
    archers:             "Arqueros",
    cavalry:             "Caballería",
    infantry:            "Infantería",
    siege:               "Asedio",
    ships:               "Barcos",
    fishing_ships:       "Barcos Pesqueros",
    camel_units:         "Unidades de Camello",
    monks:               "Monjes",
    rams:                "Arietes",
    spearmen:            "Lanceros",
    camels:              "Camellos",
    mamelukes:           "Mamelucos",
    gunpowder:           "Pólvora",
    elephants:           "Elefantes",
    heavy_siege:         "Asedio Pesado",
    fire_ships:          "Barcos de Fuego",
    long_range_warship:  "Barco de Guerra de Largo Alcance",
    siege_weapons:       "Armas de Asedio",
    elephant_units:      "Unid. Elefante",
  },

  types: {
    infantry:   "Civilización de infantería",
    cavalry:    "Civilización de caballería",
    archers:    "Civilización de arqueros",
    naval:      "Civilización naval",
    defensive:  "Civilización defensiva",
    monks:      "Civilización de monjes",
    siege:      "Civilización de asedio",
    gunpowder:  "Civilización de pólvora",
  },

  ages: {
    0: "Alta Edad Media",
    1: "Edad Feudal",
    2: "Edad de los Castillos",
    3: "Edad Imperial",
  },

  buildings: {
    barracks:       "Cuartel",
    archery:        "Galería de Tiro",
    stable:         "Establo",
    siege:          "Taller de Asedio",
    dock:           "Muelle",
    monastery:      "Monasterio",
    university:     "Universidad",
    castle:         "Castillo",
    wonder:         "Maravilla",
    market:         "Mercado",
    blacksmith:     "Herrería",
    tc:             "Centro Urbano",
    tc_castle:      "Centro Urbano adicional",
    towncenter:     "Centro Urbano",
    mill:           "Molino",
    farm:           "Granja",
    fishtrap:       "Trampa para Peces",
    lumber:         "Camp. Maderero",
    mining:         "Camp. Minero",
    tahsili:        "Asentamiento",
    mulecart:       "Mula de Carga",
    // Torres
    outpost:        "Puesto Avanzado",
    watchtower:     "Torre de Vigilancia",
    guardtower_b:   "Torre de Guardia",
    keep_b:         "Torreón",
    bombardtower_b: "Torre de Bombarda",
    // Murallas
    palisadewall:   "Empalizada",
    palisadegate:   "Puerta de Empalizada",
    stonewall:      "Muro de Piedra",
    gate:           "Puerta",
    fortifiedwall_b:"Muro Fortificado",
  },

  // ── Nodos: { name, effect } por ID ───────────────────────
  nodes: {

    // ── Cuartel ─────────────────────────────────────────────
    militia:      { name: 'Milicia',              effect: 'Infantería básica.' },
    manatarms:    { name: 'Hombre de Armas',       effect: '+2 ataque, +1 armadura vs milicia.' },
    longsword:    { name: 'Espadachín',            effect: '+2 ataque, +1 PV.' },
    twohanded:    { name: 'Espadachín 2 Manos',    effect: '+1 ataque, +1 armadura.' },
    champion:     { name: 'Campeón',               effect: '+1 ataque, +1 PV.' },
    spearman:     { name: 'Lancero',               effect: 'Anti-caballería. +20 ataque vs caballos.' },
    pikeman:      { name: 'Piquero',               effect: '+2 ataque, +1 armadura. Mejor anti-caballería.' },
    halberdier:   { name: 'Alabardero',            effect: '+1 ataque. El mejor anti-caballería.' },
    squires:      { name: 'Escuderos',             effect: 'Infantería +10% velocidad de movimiento.' },
    arson:        { name: 'Incendio',              effect: 'Infantería +2 ataque vs edificios.' },
    gambesons:    { name: 'Gambesones',            effect: 'Milicia +1 armadura perforante.' },

    eaglescout:   { name: 'Águila Explorador',     effect: '[Solo civs meso] Explorador rápido sin caballos.' },
    eaglewarrior: { name: 'Guerrero Águila',        effect: '[Solo civs meso] Mejora del Águila.' },
    eliteeagle:   { name: 'Águila de Élite',        effect: '[Solo civs meso] Élite.' },

    champiscout:  { name: 'Explorador Champi',     effect: '[Solo S. Americanos] Infantería rápida con escudo.' },
    champirunner: { name: 'Corredor Champi',        effect: '[Solo S. Americanos] Mejora del Champi.' },
    champiwarrior:{ name: 'Guerrero Champi',        effect: '[Solo S. Americanos] Mejora del Champi.' },
    elitechampi:  { name: 'Champi de Élite',        effect: '[Solo S. Americanos] Máxima potencia regional.' },

    legionary:    { name: 'Legionario',            effect: '[Solo Romanos] Sustituye al Campeón.' },
    fire_lancer:  { name: 'Lancero de Fuego',      effect: '[Civs Dinásticas] Infantería rápida con daño de área.' },
    elite_fire_lancer: { name: 'Lancero de Fuego Elite', effect: 'Versión elite.' },
    flemish_militia:   { name: 'Milicia Flamenca', effect: '[Solo Borgoñones] Infantería pesada tras Revolución Flamenca.' },
    jian_swordsman:    { name: 'Espadachín Jian',  effect: '[Solo Wu] Infantería ágil.' },
    temple_guard: { name: 'Guardia del Templo',    effect: '[Solo Muiscas] Infantería regional.' },
    ibirapema:    { name: 'Guerrero Ibirapema',    effect: '[Solo Tupíes] Infantería regional.' },
    condottiero:  { name: 'Condottiero',           effect: '[Solo Italianos/Equipo] Anti-pólvora.' },
    huskarl_b:    { name: 'Huskarl',               effect: '[Solo Godos] Infantería rápida anti-arqueros.' },

    // ── Galería de Tiro ─────────────────────────────────────
    archer:       { name: 'Arquero',               effect: 'Unidad de ataque a distancia.' },
    crossbow:     { name: 'Ballestero',             effect: '+1 ataque, +1 rango.' },
    arbalester:   { name: 'Arbalestero',            effect: '+1 ataque, +1 rango.' },
    skirmisher:   { name: 'Escaramuzador',          effect: 'Anti-arquero. Resistente a proyectiles.' },
    eliteskirm:   { name: 'Escar. de Elite',        effect: '+1 ataque, +1 PV.' },
    handcannon:   { name: 'Arcabucero',             effect: '[Requiere Química] Unidad de pólvora.' },
    cavarcher:    { name: 'Arquero a Caballo',      effect: 'Arquero montado, muy móvil.' },
    hcavarcher:   { name: 'Arq. Cab. Pesado',       effect: '+1 ataque, +20 PV.' },
    thumbring:    { name: 'Anillo Pulgar',          effect: '100% precisión, arcos disparan más rápido.' },
    parthian:     { name: 'Tácticas Partas',        effect: '+2/+4 atq vs lanzas; Arq. Cab. disparan en retroceso.' },

    imp_skirmisher:      { name: 'Escarm. Imperial',      effect: '[Solo Vietnamitas/Equipo] Máxima mejora del escaramuzador.' },
    elephant_archer:     { name: 'Elefante Arquero',      effect: '[Civs Indias] Arquero montado muy resistente.' },
    elite_elephant_archer:{ name: 'Elefante Arq. Elite', effect: 'Élite.' },
    grenadier:    { name: 'Granadero',             effect: '[Solo Jurchens] Unidad de pólvora con daño de área.' },
    xianbei_raider:{ name: 'Incursor Xianbei',     effect: '[Solo Wei] Arquero a caballo ligero.' },
    bolas_rider:  { name: 'Jinete de Bolas',       effect: '[Solo Mapuches] Unidad regional.' },
    slinger:      { name: 'Hondero',               effect: '[Solo civs Americanas] Anti-infantería.' },
    genitour:     { name: 'Jinete Genitour',       effect: '[Solo Bereberes/Equipo] Escaramuzador montado.' },

    // ── Establo ──────────────────────────────────────────────
    scout:        { name: 'Cab. Explorador',       effect: 'Caballería rápida de reconocimiento.' },
    lightcav:     { name: 'Caballería Ligera',     effect: '+10 PV, +2 ataque.' },
    hussar:       { name: 'Húsar',                 effect: '+10 PV. Anti-monjes y arietes.' },
    knight:       { name: 'Caballero',             effect: 'Caballería pesada. Alta armadura y ataque.' },
    cavalier:     { name: 'Caballer. Pesado',      effect: '+2 ataque, +1 armadura.' },
    paladin:      { name: 'Paladín',               effect: '+10 PV, +1 ataque. La élite de caballería.' },
    camel:        { name: 'Jinete en Camello',     effect: '[Solo civs orientales] Anti-caballería montada.' },
    heavycamel:   { name: 'Camello Pesado',        effect: '+1 ataque extra.' },
    battleeleph:  { name: 'Elefante de Combate',   effect: '[Solo civs SE Asiático] Muy resistente.' },
    eliteeleph:   { name: 'Elefante Elite',        effect: '+20 PV, +1 ataque.' },
    bloodlines:   { name: 'Linaje',                effect: 'Toda caballería +20 PV.' },
    husbandry:    { name: 'Ganadería',             effect: 'Toda caballería +10% velocidad.' },

    winged_hussar:{ name: 'Húsar Alado',           effect: '[Solo Polacos/Lituanos] Mejora superior del Húsar.' },
    savar:        { name: 'Savar',                 effect: '[Solo Persas] Sustituye al Paladín.' },
    camel_scout:  { name: 'Explorador Camello',    effect: '[Solo Gurjaras] Camello disponible en Feudal.' },
    imp_camel:    { name: 'Camello Imperial',      effect: '[Solo Hindustanís] Máxima mejora de camello.' },
    steppe_lancer:{ name: 'Lancero Estepario',     effect: '[Civs Esteparias] Caballería con mayor rango de ataque.' },
    elite_steppe_lancer: { name: 'Lancero Estep. Elite', effect: 'Élite.' },
    xolotl_warrior:{ name: 'Guerrero Xolotl',     effect: '[Solo Americanos] Caballería capturada.' },
    shrivamsha:   { name: 'Jinete Shrivamsha',     effect: '[Solo Gurjaras] Caballería capaz de esquivar proyectiles.' },
    elite_shrivamsha: { name: 'Shrivamsha Elite', effect: 'Élite.' },
    hei_guang:    { name: 'Caballería Hei Guang',  effect: '[Civs Tres Reinos] Caballería pesada regional.' },
    heavy_hei_guang: { name: 'Hei Guang Pesada',  effect: 'Élite.' },
    tarkan_s:     { name: 'Tarkán',               effect: '[Solo Hunos] Caballería anti-edificios.' },

    // ── Taller de Asedio ─────────────────────────────────────
    batteringram: { name: 'Ariete',                effect: 'Unidad anti-edificios.' },
    cappedram:    { name: 'Ariete Reforzado',       effect: '+50 PV, +5 ataque vs edificios.' },
    siegeram:     { name: 'Ariete de Asedio',       effect: '+50 PV, mejor armadura.' },
    mangonel:     { name: 'Mangonela',             effect: 'Daño en área. Buena contra arqueros en masa.' },
    onager:       { name: 'Onagro',                effect: '+2 rango, +5 ataque.' },
    siegeonager:  { name: 'Onagro de Asedio',      effect: 'Daño en área aumentado, corta árboles.' },
    scorpion:     { name: 'Escorpión',             effect: 'Ballesta de asedio anti-infantería.' },
    heavyscorpion:{ name: 'Escorpión Pesado',      effect: '+1 rango, más daño.' },
    bombcannon:   { name: 'Cañón de Bombarda',     effect: '[Requiere Química] Cañón de pólvora.' },
    siegetower:   { name: 'Torre de Asedio',       effect: 'Transporte terrestre rápido que permite a la infantería pasar por encima de muros enemigos.' },

    houfnice:     { name: 'Houfnice',              effect: '[Solo Bohemios] Máxima mejora de cañón.' },
    traction_treb:{ name: 'Lanzapiedras Tracción', effect: '[Civs Tres Reinos] Lanzapiedras temprano.' },
    mounted_treb: { name: 'Lanzapiedras Montado',  effect: '[Solo Khitans] Lanzapiedras móvil.' },
    rocket_cart:  { name: 'Carro de Cohetes',      effect: '[Civs Dinásticas] Artillería regional.' },
    heavy_rocket_cart: { name: 'Carro Cohete Pesado', effect: 'Élite.' },
    flaming_camel:{ name: 'Camello Llameante',     effect: '[Solo Tártaros] Unidad suicida anti-elefantes.' },
    armored_elephant:  { name: 'Elefante Acorazado', effect: '[Civs Indias] Elefante de asedio.' },
    siege_elephant:    { name: 'Elefante de Asedio', effect: 'Élite.' },
    war_chariot_s:{ name: 'Carro de Guerra',       effect: '[Solo Shu] Carro pesado de asedio.' },

    // ── Herrería ─────────────────────────────────────────────
    forging:          { name: 'Forja',                    effect: '+1 ataque cuerpo a cuerpo.' },
    ironcasting:      { name: 'Fundición de Hierro',      effect: '+1 ataque cuerpo a cuerpo.' },
    blastfurnace:     { name: 'Alto Horno',               effect: '+2 ataque cuerpo a cuerpo.' },
    scalemailarmor:   { name: 'Cota de Malla',            effect: '+1/+1 armadura infantería.' },
    chainmailarmor:   { name: 'Cota de Malla Pesada',     effect: '+1/+1 armadura infantería.' },
    platemailarmor:   { name: 'Armadura de Placas',       effect: '+1/+2 armadura infantería.' },
    paddedarcharmor:  { name: 'Armad. Arquero Ligera',    effect: '+1/+1 armadura arqueros.' },
    leatherarcharmor: { name: 'Cuero de Arquero',         effect: '+1/+1 armadura arqueros.' },
    ringarcherarmor:  { name: 'Armad. Anillos',           effect: '+1/+2 armadura arqueros.' },
    scalebarding:     { name: 'Barda Escamada',           effect: '+1/+1 armadura caballería.' },
    chainbarding:     { name: 'Barda de Malla',           effect: '+1/+1 armadura caballería.' },
    platebarding:     { name: 'Barda de Placas',          effect: '+1/+2 armadura caballería.' },
    fletching:        { name: 'Emplumado',                effect: '+1 rango y +1 ataque para arqueros.' },
    bodkinarrow:      { name: 'Flecha de Bodkin',         effect: '+1 rango y +1 ataque para arqueros.' },
    bracer:           { name: 'Brazalete',                effect: '+1 rango y +1 ataque para arqueros.' },

    // ── Muelle ───────────────────────────────────────────────
    medium_warships:  { name: 'Barcos de Guerra Medianos', effect: 'Mejora galeras, barcos de fuego y hulks a galeras de guerra, barcos de fuego y war hulks.' },
    heavy_warships:   { name: 'Barcos de Guerra Pesados',  effect: 'Mejora galeras de guerra, barcos de fuego y war hulks a galeones, barcos fuego rápido y carracas.' },
    fishingship:  { name: 'Barco Pesquero',        effect: 'Recoge comida del mar.' },
    transportship:{ name: 'Barco de Transporte',   effect: 'Transporta unidades terrestres.' },
    tradecog:     { name: 'Cog Comercial',         effect: 'Comercia oro en el océano.' },
    galley:       { name: 'Galera',                effect: 'Nave de combate básica.' },
    wargalley:    { name: 'Galera de Guerra',      effect: '+15 PV, +1 ataque.' },
    galleon:      { name: 'Galeón',                effect: '+50 PV, +1 ataque.' },
    firegalley:   { name: 'Galera de Fuego',       effect: 'Anti-naves; lanza fuego.' },
    fireship:     { name: 'Barco Fuego',           effect: '+50 PV, más velocidad de ataque.' },
    fastfireship: { name: 'Barco Fuego Rápido',    effect: '+50 PV, más velocidad de ataque.' },
    hulk:         { name: 'Hulk',                  effect: 'Navío de guerra regional.' },
    war_hulk:     { name: 'Hulk de Guerra',        effect: 'Mejora.' },
    carrack:      { name: 'Carraca',               effect: 'Máxima mejora.' },
    demoraft:     { name: 'Balsa de Demolición',   effect: 'Barco suicida, daño de área.' },
    demoship:     { name: 'Barco de Demolición',   effect: 'Barco suicida, daño de área.' },
    heavydemo:    { name: 'Buque de Demolición Pesado', effect: 'Más daño y radio de explosión.' },
    cannongalleon:{ name: 'Galeón de Artillería',  effect: '[Requiere Química] Barco de asedio de largo alcance.' },
    elitecannon:  { name: 'Galeón Artillería Élite', effect: 'Más rango y daño.' },
    drydock:      { name: 'Dique Seco',            effect: 'Barcos +15% velocidad y +10 capacidad de transporte.' },
    shipwright:   { name: 'Constructor Naval',     effect: 'Naves -20% costo; muelles construyen 10% más rápido.' },
    fishing_lines:{ name: 'Líneas de Pesca',       effect: 'Barcos pesqueros trabajan +10% más rápido y cargan +5 recursos.' },
    gillnets:     { name: 'Redes de Malla',        effect: 'Barcos pesqueros trabajan 10% más rápido y cargan +5 recursos.' },
    dragon_ship:  { name: 'Barco Dragón',          effect: '[Solo Chinos] Mejora del Barco de Fuego.' },
    dromon:       { name: 'Dromón',                effect: 'Navío de asedio que lanza fuego.' },
    lou_chuan:    { name: 'Lou Chuan',             effect: '[Civs Dinásticas] Navío de guerra de asedio. Modo anti-edificio: trebuchet (rng 13). Modo anti-unidad: flechas (rng 10).' },
    catapult_gall:{ name: 'Galera de Catapulta',   effect: '[Solo Americanos] Barco de asedio.' },
    turtle_ship:  { name: 'Barco Tortuga',         effect: '[Solo Coreanos] Barco acorazado de corto alcance.' },
    longboat:     { name: 'Drakkar',               effect: '[Solo Vikingos] Barco de guerra que dispara múltiples flechas.' },
    caravel_d:    { name: 'Carabela',              effect: '[Solo Portugueses] Barco de guerra con daño de área.' },
    thirisadai:   { name: 'Thirisadai',            effect: '[Solo Dravídicos] Navío masivo de guerra.' },
    harbor:       { name: 'Puerto',                effect: '[Solo Malayos] Muelle defensivo que dispara flechas.' },

    // ── Universidad ──────────────────────────────────────────
    masonry:          { name: 'Albañilería',              effect: 'Edificios +10% PV, +1 melee/+1 perforante y +3 armadura de edificio.' },
    architecture:     { name: 'Arquitectura',             effect: 'Edificios +10% PV, +1 melee/+1 perforante y +3 armadura de edificio.' },
    ballistics:       { name: 'Balística',                effect: 'Arqueros a pie, Escaramuzadores, Arqueros montados, Barcos de guerra de rango, Fortificaciones de rango y algunas Armas de Asedio disparan con más precisión a objetivos en movimiento.' },
    chemistry:        { name: 'Química',                  effect: 'Arqueros a pie, Escaramuzadores, Arqueros montados, Barcos de guerra de rango y Fortificaciones de rango +1 ataque. Requerido para Unidades de Pólvora (Arcabucero, Galeón Cañonero, Cañón Bombardero, Torre Bombardera).' },
    murderhole:       { name: 'Troneras',                 effect: 'Elimina el rango mínimo de Fortificaciones para que puedan atacar a enemigos en su base.' },
    siegeengineers:   { name: 'Ingenieros de Asedio',     effect: 'Armas de Asedio de rango y Barcos de Guerra de Asedio +1 rango. Todas las Armas de Asedio y Barcos de Guerra de Asedio +20% ataque vs. edificios; Unidades de Demolición +40% ataque vs. edificios.' },
    treadmillcrane:   { name: 'Grúa de Rueda',           effect: 'Aldeanos construyen edificios +20% más rápido.' },
    heatedshot:       { name: 'Balas Rojas',              effect: 'Torres +125% ataque vs. barcos; Castillos y Puertos +4 ataque vs. barcos.' },
    careening:        { name: 'Carenado',                 effect: 'Barcos +1 armadura perforante.' },
    clinker_construction: { name: 'Construcción a Tingladillo', effect: 'Barcos se mueven +10% más rápido.' },
    carvel_hull:      { name: 'Casco de Carabela',        effect: 'Barcos se mueven +10% más rápido.' },
    siphons:          { name: 'Sifones',                  effect: 'Barcos de Fuego obtienen un ataque de carga explosiva.' },
    incendiaries:     { name: 'Incendiarios',             effect: 'Barcos de Fuego detonan al hundirse, ganando radio de explosión.' },
    arrowslits:       { name: 'Aspilleras',               effect: 'Torres +1 ataque.' },

    // ── Monasterio ───────────────────────────────────────────
    monk:         { name: 'Monje',                 effect: 'Cura aliados y convierte enemigos.' },
    redemption:   { name: 'Redención',             effect: 'Monjes pueden convertir edificios.' },
    atonement:    { name: 'Expiación',             effect: 'Monjes pueden convertir monjes.' },
    heresy:       { name: 'Herejía',               effect: 'Unidades convertidas por el enemigo mueren.' },
    sanctity:     { name: 'Santidad',              effect: 'Monjes +15 PV.' },
    fervor:       { name: 'Fervor',                effect: 'Monjes +15% velocidad.' },
    herbalmedicine:{ name: 'Medicina Herbal',      effect: 'Unidades guarecidas sanan 4× más rápido.' },
    illumination: { name: 'Iluminación',           effect: 'Los monjes se recargan más rápido.' },
    blockprinting:{ name: 'Imprenta de Bloques',   effect: 'Monjes +3 rango de conversión.' },
    theocracy:    { name: 'Teocracia',             effect: 'Solo un monje recarga tras conversión grupal.' },
    faith:        { name: 'Fe',                    effect: 'Unidades muy resistentes a la conversión.' },
    warrior_priest:{ name: 'Sacerdote Guerrero',   effect: '[Solo Armenios] Monje capaz de combatir.' },
    missionary:   { name: 'Misionero',             effect: '[Solo Españoles] Monje montado.' },
    fortified_church: { name: 'Iglesia Fortificada', effect: '[Armenios y Georgianos] Monasterio defensivo. Dispara cuando guarnecido con Aldeanos o Reliquias; +5 ataque vs. barcos, +1 vs. camellos.' },

    // ── Castillo ─────────────────────────────────────────────
    trebuchet:    { name: 'Trebuchet',             effect: 'Lanzaproyectiles de largo alcance. Debe plegarse.' },
    petard:       { name: 'Petardo',               effect: 'Unidad suicida anti-edificios.' },
    uniqueunit:   { name: 'Unidad Única',          effect: 'Unidad exclusiva de la civilización seleccionada.' },
    eliteunique:  { name: 'Unidad Única Elite',    effect: 'Versión mejorada de la unidad única.' },
    uniquetech1:  { name: 'Tecnología Única I',    effect: 'Tecnología exclusiva del Castillo (Edad Castillos).' },
    uniquetech2:  { name: 'Tecnología Única II',   effect: 'Tecnología exclusiva del Castillo (Edad Imperial).' },
    hoardings:    { name: 'Almacenamiento',        effect: 'Castillos +500 PV.' },
    conscription: { name: 'Conscripción',          effect: 'Unidades se crean 33% más rápido.' },
    sappers:      { name: 'Zapadores',             effect: 'Infantería +15 ataque vs edificios.' },
    kipchak_c:    { name: 'Kipchak Mercenario',    effect: '[Solo Cumanos/Equipo] Arquero a caballo rápido.' },
    krepost:      { name: 'Krepost',               effect: '[Solo Búlgaros] Castillo menor. Crea Konniks.' },
    donjon:       { name: 'Donjon',                effect: '[Solo Sicilianos] Torre que entrena Sargentos.' },

    // ── Mercado ──────────────────────────────────────────────
    tradecart:    { name: 'Carro de Comercio',     effect: 'Genera oro comerciando con mercados aliados.' },
    coinage:      { name: 'Acuñación',             effect: '-15% tributo recibido.' },
    banking:      { name: 'Banca',                 effect: 'Sin impuestos en tributos.' },
    guilds:       { name: 'Gremios',               effect: 'Comerciantes trabajan 50% más rápido.' },
    feitoria:     { name: 'Feitoria',              effect: '[Solo Portugueses] Genera recursos automáticamente.' },
    caravanserai: { name: 'Caravasar',             effect: '[Hindustaníes y Persas] Cura y acelera carros de comercio.' },

    // ── Centro Urbano ────────────────────────────────────────
    villager:     { name: 'Aldeano',               effect: 'Unidad básica recolectora y constructora.' },
    loom:         { name: 'Telar',                 effect: 'Aldeanos +15 PV, +1/+2 armadura.' },
    wheelbarrow:  { name: 'Carretilla',            effect: 'Aldeanos +3 capacidad de carga, +5% velocidad.' },
    townwatch:    { name: 'Guardia Municipal',     effect: '+4 línea de visión para Centros Urbanos.' },
    handcart:     { name: 'Carro de Mano',         effect: 'Aldeanos +7 carga, +10% velocidad.' },
    townpatrol:   { name: 'Patrulla Urbana',       effect: '+6 LDV para Torres y CU.' },
    feudalage:    { name: 'Edad Feudal',           effect: 'Avanza a la Edad Feudal.' },
    castleage:    { name: 'Edad de los Castillos', effect: 'Avanza a la Edad de los Castillos.' },
    imperialage:  { name: 'Edad Imperial',         effect: 'Avanza a la Edad Imperial.' },

    // ── Molino ───────────────────────────────────────────────
    horsecollar:  { name: 'Collarín para Caballo', effect: 'Granjas producen 75 de comida extra.' },
    heavyplow:    { name: 'Arado Pesado',          effect: 'Granjas producen 125 de comida extra.' },
    croprotation: { name: 'Rotación de Cultivos',  effect: 'Granjas producen 375 de comida extra.' },
    folwark:      { name: 'Folwark',               effect: '[Solo Polacos] Reemplaza al Molino. Recolecta comida de granjas adyacentes instantáneamente.' },
    mule_cart:    { name: 'Carro Mula',            effect: '[Armenios y Georgianos] Campamento móvil de recursos.' },

    // ── Camp. Maderero ────────────────────────────────────────
    doublebitaxe: { name: 'Hacha Doble Filo',      effect: 'Tala de madera +20% velocidad.' },
    bowsaw:       { name: 'Sierra de Arco',        effect: 'Tala de madera +20% velocidad.' },
    twomansaw:    { name: 'Sierra de Dos Hombres', effect: 'Tala de madera +10% velocidad.' },

    // ── Camp. Minero ──────────────────────────────────────────
    goldmining:   { name: 'Minería de Oro',        effect: 'Minería de oro +15% velocidad.' },
    goldshaft:    { name: 'Pozos de Oro',          effect: 'Minería de oro +15% velocidad.' },
    stonemining:  { name: 'Minería de Piedra',     effect: 'Minería de piedra +15% velocidad.' },
    stoneshaft:   { name: 'Pozos de Piedra',       effect: 'Minería de piedra +15% velocidad.' },

    // ── Tahsili (Asentamiento) ───────────────────────────────
    horsecollar_t:  { name: 'Collarín para Caballo', effect: 'Granjas producen 75 de comida extra.' },
    heavyplow_t:    { name: 'Arado Pesado',          effect: 'Granjas producen 125 de comida extra.' },
    croprotation_t: { name: 'Rotación de Cultivos',  effect: 'Granjas producen 375 de comida extra.' },
    doublebitaxe_t: { name: 'Hacha Doble Filo',      effect: 'Tala de madera +20% velocidad.' },
    bowsaw_t:       { name: 'Sierra de Arco',        effect: 'Tala de madera +20% velocidad.' },
    twomansaw_t:    { name: 'Sierra de Dos Hombres', effect: 'Tala de madera +10% velocidad.' },
    goldmining_t:   { name: 'Minería de Oro',        effect: 'Minería de oro +15% velocidad.' },
    goldshaft_t:    { name: 'Pozos de Oro',          effect: 'Minería de oro +15% velocidad.' },
    stonemining_t:  { name: 'Minería de Piedra',     effect: 'Minería de piedra +15% velocidad.' },
    stoneshaft_t:   { name: 'Pozos de Piedra',       effect: 'Minería de piedra +15% velocidad.' },

    // ── Mula de Carga ────────────────────────────────────────
    doublebitaxe_m: { name: 'Hacha Doble Filo',      effect: 'Tala de madera +20% velocidad.' },
    bowsaw_m:       { name: 'Sierra de Arco',        effect: 'Tala de madera +20% velocidad.' },
    twomansaw_m:    { name: 'Sierra de Dos Hombres', effect: 'Tala de madera +10% velocidad.' },
    goldmining_m:   { name: 'Minería de Oro',        effect: 'Minería de oro +15% velocidad.' },
    goldshaft_m:    { name: 'Pozos de Oro',          effect: 'Minería de oro +15% velocidad.' },
    stonemining_m:  { name: 'Minería de Piedra',     effect: 'Minería de piedra +15% velocidad.' },
    stoneshaft_m:   { name: 'Pozos de Piedra',       effect: 'Minería de piedra +15% velocidad.' },
  },

  civs: {
    armenians: {
      name: "Armenios",
      type: "Civilización de infantería y naval",
      bonuses: [
        "Los carros de mulas cuestan -25%",
        "Las tecnologías de carros de mulas son +40% más efectivas",
        "Mejoras de línea de lanceros y milicia (excepto Hombre de Armas) disponibles una era antes",
        "La primera Iglesia Fortificada recibe una Reliquia gratis",
        "La línea de galeras y los Dromones disparan un proyectil adicional"
      ],
      teamBonus: "Infantería +2 de alcance visual",
      uniqueTechs: [
        { name: "Flota ciliciana", effect: "buques de demolición: +20% de radio de explosión; dromones y línea de galeras: +1 de alcance" },
        { name: "Feretorios", effect: "infantería, excepto línea de lanceros: +30 PV; sacerdotes guerreros: +100% de velocidad de curación" }
      ],
      uniqueUnits: [
        { name: "Arqueros con arco compuesto", subtitle: "arqueros a pie", upgradeName: "Arquero Compuesto Elite" },
        { name: "Sacerdotes guerreros", subtitle: "infantería" }
      ]
    },
    aztecs: {
      name: "Aztecas",
      type: "Civilización de infantería y monjes",
      bonuses: [
        "Empiezan con +50 de oro",
        "Los aldeanos transportan +3 recursos",
        "Las unidades militares se entrenan +15% más rápido",
        "Los monjes ganan +5 PV por cada tecnología de monasterio investigada"
      ],
      teamBonus: "Las Reliquias generan +33% de oro",
      uniqueTechs: [
        { name: "Atlatl", effect: "Escaramuzadores +1 ataque y +1 rango." },
        { name: "Guerras de Guirnaldas", effect: "Infantería +4 ataque." }
      ],
      uniqueUnits: [
        { name: "Guerrero Jaguar", upgradeName: "Guerrero Jaguar Elite" }
      ]
    },
    bengalis: {
      name: "Bengalíes",
      type: "Civilización de elefantes y naval",
      bonuses: [
        "Los Centros Urbanos crean 2 aldeanos al avanzar de era",
        "Caballería +2 de ataque vs. escaramuzadores",
        "Las unidades de elefante reciben -25% de daño adicional y son más resistentes a la conversión",
        "Monjes +3 armadura cuerpo a cuerpo/+3 armadura perforante",
        "Los barcos regeneran 15 PV por minuto"
      ],
      teamBonus: "Las unidades de comercio generan +10% de comida además de oro",
      uniqueTechs: [
        { name: "Paiks", effect: "Ratha y unidades de elefante atacan 20% más rápido." },
        { name: "Mahayana", effect: "Casas dan +10 población extra." }
      ],
      uniqueUnits: [
        { name: "Ratha", upgradeName: "Ratha Elite" }
      ]
    },
    berbers: {
      name: "Bereberes",
      type: "Civilización de caballería y naval",
      bonuses: [
        "Los aldeanos se mueven +5% más rápido en la Alta Edad Media y +10% más rápido desde la Edad Feudal",
        "Las unidades de establo cuestan -15/20% en la Edad de los Castillos/Imperial",
        "Los barcos se mueven +10% más rápido"
      ],
      teamBonus: "El Genitour disponible en la Galería de Tiro desde la Edad de los Castillos",
      uniqueTechs: [
        { name: "Kasbah", effect: "Edificios únicos trabajan 25% más rápido." },
        { name: "Camellos Magrebi", effect: "Camellos se auto-regeneran." }
      ],
      uniqueUnits: [
        { name: "Arquero en Camello", upgradeName: "Arquero en Camello Elite" }
      ]
    },
    burmese: {
      name: "Birmanos",
      type: "Civilización de infantería y caballería",
      bonuses: [
        "Las tecnologías del Campamento Maderero son gratuitas",
        "Infantería +1/+2/+3 de ataque en Edad Feudal/Castillos/Imperial",
        "Los Elefantes de Batalla tienen +1 armadura cuerpo a cuerpo/+1 armadura perforante",
        "Las tecnologías del Monasterio cuestan -50%"
      ],
      teamBonus: "Las Reliquias son visibles en el mapa al inicio de la partida",
      uniqueTechs: [
        { name: "Caballería Manipur", effect: "Caballería +4 de ataque vs arqueros." },
        { name: "Howdah", effect: "Elefantes de Batalla +1/+1 armadura." }
      ],
      uniqueUnits: [
        { name: "Arambai", upgradeName: "Arambai Elite" }
      ]
    },
    byzantines: {
      name: "Bizantinos",
      type: "Civilización defensiva",
      bonuses: [
        "Edificios con +10/20/30/40% de PV en Alta Edad Media/Feudal/Castillos/Imperial",
        "Los Jinetes de Camello, Escaramuzadores y línea de Lanceros cuestan -25%",
        "Vigilancia Urbana y Patrulla Urbana son gratuitas",
        "Avanzar a la Edad Imperial cuesta -33%",
        "Los Barcos de Fuego y los Dromones atacan +25% más rápido"
      ],
      teamBonus: "Los monjes curan +100% más rápido",
      uniqueTechs: [
        { name: "Fuego Griego", effect: "Barcos de Fuego +1 rango." },
        { name: "Logística", effect: "Catafractos causan daño de pisoteo; +6 ataque vs infantería." }
      ],
      uniqueUnits: [
        { name: "Catafracto", upgradeName: "Catafracto Elite" }
      ]
    },
    bohemians: {
      name: "Bohemios",
      type: "Civilización de pólvora y monjes",
      bonuses: [
        "Las tecnologías del Campamento Minero son gratuitas",
        "Las Herrerías y las Universidades cuestan -100 de madera",
        "La línea de Lanceros causa +25% de daño adicional",
        "Fervor y Santidad afectan a los aldeanos",
        "Química y Arcabucero disponibles en la Edad de los Castillos"
      ],
      teamBonus: "Los Mercados trabajan +80% más rápido",
      uniqueTechs: [
        { name: "Wagenburg Tactics", effect: "Unidades de pólvora se mueven 15% más rápido." },
        { name: "Hussite Reforms", effect: "Monjes y tecnologías de Monasterio: coste de oro reemplazado por comida." }
      ],
      uniqueUnits: [
        { name: "Carro Husita", upgradeName: "Carro Husita Elite" }
      ]
    },
    burgundians: {
      name: "Borgoñones",
      type: "Civilización de caballería",
      bonuses: [
        "Las mejoras económicas están disponibles una era antes y cuestan -33% de comida",
        "Las tecnologías del Establo cuestan -50%",
        "La mejora de Caballero disponible en la Edad de los Castillos",
        "Las unidades de pólvora tienen +25% de ataque"
      ],
      teamBonus: "Las Reliquias generan comida además de oro",
      uniqueTechs: [
        { name: "Viñedos Borgoñones", effect: "Granjas también generan pequeñas cantidades de oro." },
        { name: "Revolución Flamenca", effect: "Transforma todos los aldeanos en Milicia Flamenca." }
      ],
      uniqueUnits: [
        { name: "Coustillier", upgradeName: "Coustillier Elite" }
      ]
    },
    britons: {
      name: "Britones",
      type: "Civilización de arqueros a pie",
      bonuses: [
        "Los pastores trabajan +25% más rápido",
        "Los Centros Urbanos cuestan -50% de madera desde la Edad de los Castillos",
        "Los arqueros a pie tienen +1/+2 de rango en la Edad de los Castillos/Imperial"
      ],
      teamBonus: "Las Galerías de Tiro trabajan +10% más rápido",
      uniqueTechs: [
        { name: "Yeomen", effect: "Arqueros a pie +1 rango; Torres +2 ataque." },
        { name: "Warwolf", effect: "Trebuchets 100% precisión y daño en área." }
      ],
      uniqueUnits: [
        { name: "Longbowman", upgradeName: "Longbowman Elite" }
      ]
    },
    bulgarians: {
      name: "Búlgaros",
      type: "Civilización de infantería y caballería",
      bonuses: [
        "Las mejoras de la línea de Milicia son gratuitas",
        "Las tecnologías de Herrería y Taller de Asedio cuestan -50% de comida",
        "Los Centros Urbanos cuestan -50% de piedra",
        "Puede construir Krepost en la Edad de los Castillos"
      ],
      teamBonus: "Las Herrerías trabajan +80% más rápido",
      uniqueTechs: [
        { name: "Stirrups", effect: "Caballería ataca 33% más rápido." },
        { name: "Bagains", effect: "Milicia-línea +5 armadura cuerpo a cuerpo." }
      ],
      uniqueUnits: [
        { name: "Konnik", upgradeName: "Konnik Elite" }
      ]
    },
    celts: {
      name: "Celtas",
      type: "Civilización de infantería y asedio",
      bonuses: [
        "Los leñadores trabajan +15% más rápido",
        "Los animales de granja en el alcance visual de unidades celtas no pueden ser robados",
        "La infantería se mueve +5/10/15/20% más rápido en Alta Edad Media/Feudal/Castillos/Imperial",
        "Las armas de asedio atacan +25% más rápido"
      ],
      teamBonus: "Los Talleres de Asedio trabajan +20% más rápido",
      uniqueTechs: [
        { name: "Stronghold", effect: "Castillos y línea de Torre Vigía atacan 33% más rápido; los Castillos curan Infantería aliada en un radio de 7 casillas." },
        { name: "Furor Celticus", effect: "Unidades del Taller de Asedio +40% PV." }
      ],
      uniqueUnits: [
        { name: "Woad Raider", upgradeName: "Woad Raider Elite" }
      ]
    },
    chinese: {
      name: "Chinos",
      type: "Civilización de arqueros y pólvora",
      bonuses: [
        "Empiezan con +3 aldeanos, pero -50 de madera y -200 de comida",
        "Las tecnologías cuestan -5/10/15% en Edad Feudal/Castillos/Imperial",
        "Los Centros Urbanos tienen +7 de alcance visual y proporcionan +15 de espacio de población",
        "Los Lanceros de Fuego y los Barcos de Fuego se mueven +5/10% más rápido en Edad de los Castillos/Imperial"
      ],
      teamBonus: "Las granjas producen +10% de comida",
      uniqueTechs: [
        { name: "Gran Muralla", effect: "Muros, línea de Torres de Vigilancia y Torres de Bombardeo +30% PV." },
        { name: "Cohetes", effect: "Escorpiones, Carros de Cohetes y Lou Chuans +25% ataque; Lou Chuans disparan cohetes." }
      ],
      uniqueUnits: [
        { name: "Chu Ko Nu", upgradeName: "Chu Ko Nu Elite" },
        { name: "Barco Dragón", subtitle: "barco de guerra", upgradeName: "Barco Dragón Elite" }
      ]
    },
    koreans: {
      name: "Coreanos",
      type: "Civilización defensiva y naval",
      bonuses: [
        "Los mineros de piedra trabajan +20% más rápido",
        "Los soldados a distancia e infantería cuestan -50% de madera",
        "Las mejoras de armadura de arquero y de torres son gratuitas (la Torre de Bombardeo requiere Química)",
        "Los barcos de guerra cuestan -20% de madera"
      ],
      teamBonus: "Los aldeanos tienen +3 de alcance visual",
      uniqueTechs: [
        { name: "Eupseong", effect: "Torres (excepto Bombarda) +2 rango." },
        { name: "Shinkichon", effect: "Carros de Cohetes y Barcos Tortuga +1 rango; disparan cohetes adicionales." }
      ],
      uniqueUnits: [
        { name: "Carro de Guerra", subtitle: "arquero montado", upgradeName: "Carro de Guerra Elite" },
        { name: "Barco Tortuga", subtitle: "barco de guerra", upgradeName: "Barco Tortuga Elite" }
      ]
    },
    cumans: {
      name: "Cumanos",
      type: "Civilización de caballería",
      bonuses: [
        "Se puede construir un Centro Urbano adicional en la Edad Feudal",
        "Las unidades montadas se mueven +5/10/15% más rápido en Edad Feudal/Castillos/Imperial",
        "Las Galerías de Tiro y los Establos cuestan -75 de madera",
        "El Taller de Asedio y el Ariete disponibles en Edad Feudal; el Ariete Reforzado disponible en Edad de los Castillos"
      ],
      teamBonus: "Las Murallas de Estacas tienen +33% de PV",
      uniqueTechs: [
        { name: "Steppe Husbandry", effect: "Lanceros de Estepa y Cav. Ligera se crean 2× más rápido." },
        { name: "Cuman Mercenaries", effect: "Aliados pueden crear Kipchaks Elite desde sus Castillos." }
      ],
      uniqueUnits: [
        { name: "Kipchak", upgradeName: "Kipchak Elite" }
      ]
    },
    dravidians: {
      name: "Dravídicos",
      type: "Civilización de infantería y naval",
      bonuses: [
        "Los pescadores y los barcos de pesca transportan +15 recursos",
        "Reciben +200 de madera al avanzar de era",
        "Los escaramuzadores y los arqueros de elefante atacan +25% más rápido",
        "Las tecnologías del Cuartel cuestan -50%",
        "Las armas de asedio cuestan -33% de madera"
      ],
      teamBonus: "Los Muelles proporcionan +5 de espacio de población",
      uniqueTechs: [
        { name: "Medical Corps", effect: "Elefantes de Asedio/Combate se auto-regeneran." },
        { name: "Wootz Steel", effect: "Infantería y Caballería ignoran armadura del enemigo." }
      ],
      uniqueUnits: [
        { name: "Urumi Swordsman", upgradeName: "Urumi Elite" }
      ]
    },
    slavs: {
      name: "Eslavos",
      type: "Civilización de infantería y asedio",
      bonuses: [
        "Los agricultores trabajan +15% más rápido",
        "Incendio y Gambesones son gratuitos",
        "Las unidades del Taller de Asedio cuestan -15%",
        "Los monjes se mueven +20% más rápido"
      ],
      teamBonus: "Los edificios militares (excepto Castillos) proporcionan +5 de espacio de población",
      uniqueTechs: [
        { name: "Detinets", effect: "Torres cuestan -25%." },
        { name: "Druzhina", effect: "Infantería causa daño de pisoteo." }
      ],
      uniqueUnits: [
        { name: "Boyar", upgradeName: "Boyar Elite" }
      ]
    },
    spanish: {
      name: "Españoles",
      type: "Civilización de pólvora y monjes",
      bonuses: [
        "Los constructores trabajan +30% más rápido",
        "Reciben +20 de oro por cada tecnología investigada",
        "Las mejoras de la Herrería no cuestan oro",
        "Las unidades de pólvora atacan +18% más rápido",
        "Las Galeras de Cañón disparan con más precisión a objetivos en movimiento"
      ],
      teamBonus: "Las unidades de comercio generan +25% de oro",
      uniqueTechs: [
        { name: "Inquisición", effect: "Monjes convierten más rápido." },
        { name: "Supremacía", effect: "Aldeanos mejoran ataque, armadura y PV." }
      ],
      uniqueUnits: [
        { name: "Conquistador", upgradeName: "Conquistador Elite" }
      ]
    },
    ethiopians: {
      name: "Etíopes",
      type: "Civilización de arqueros",
      bonuses: [
        "Reciben +100 de oro y +100 de comida al avanzar de era",
        "Los arqueros a pie atacan +18% más rápido",
        "La mejora de Piquero es gratuita"
      ],
      teamBonus: "Los Puestos de Avanzada tienen +3 de alcance visual y no cuestan piedra",
      uniqueTechs: [
        { name: "Royal Heirs", effect: "Guerreros Shotel y Jinetes de Camello reciben -3 de daño de unidades montadas." },
        { name: "Torsion Engines", effect: "Unidades del Taller de Asedio disparan proyectiles extra." }
      ],
      uniqueUnits: [
        { name: "Guerrero Shotel", upgradeName: "Guerrero Shotel Elite" }
      ]
    },
    franks: {
      name: "Francos",
      type: "Civilización de caballería",
      bonuses: [
        "Los recolectores trabajan +15% más rápido",
        "Las tecnologías del Molino son gratuitas",
        "Las unidades montadas tienen +20% de PV desde la Edad Feudal",
        "Los Castillos cuestan -15/25% en la Edad de los Castillos/Imperial"
      ],
      teamBonus: "La línea de Caballeros tiene +2 de alcance visual",
      uniqueTechs: [
        { name: "Hacha con Barba", effect: "Hacha Arrojadiza +2 rango." },
        { name: "Chivalry", effect: "Establos trabajan 40% más rápido." }
      ],
      uniqueUnits: [
        { name: "Hacha Arrojadiza", upgradeName: "Hacha Arrojadiza Elite" }
      ]
    },
    georgians: {
      name: "Georgianos",
      type: "Civilización defensiva y de caballería",
      bonuses: [
        "Comienza con un carro de mulas",
        "Las unidades y los edificios reciben un 15 % menos de daño al luchar desde una elevación superior",
        "La caballería regenera 2/8/14 PR por minuto en la Edad Feudal/Edad de los Castillos/Edad Imperial",
        "Las iglesias fortificadas proporcionan un 10 % más de velocidad de trabajo a los aldeanos en un radio de 9 casillas"
      ],
      teamBonus: "Reparar edificios cuesta un 25 % menos",
      uniqueTechs: [
        { name: "Torres esvanas", effect: "Las fortificaciones ganan 2 de ataque; la línea de torres inflige daño cuando se atraviesan" },
        { name: "Caballería aznauri", effect: "Las unidades de caballería ocupan un 20 % menos de espacio de población" }
      ],
      uniqueUnits: [
        { name: "Monaspa", subtitle: "caballería", upgradeName: "Monaspa Elite" }
      ]
    },
    goths: {
      name: "Godos",
      type: "Civilización de infantería",
      bonuses: [
        "El Telar se investiga al instante",
        "Los cazadores transportan +15 recursos; los animales cazados duran +20% más",
        "La infantería cuesta -15/20/25/30% en Alta Edad Media/Feudal/Castillos/Imperial",
        "Infantería +1/+2/+3 de ataque vs. edificios en Edad Feudal/Castillos/Imperial",
        "+10 de espacio de población en la Edad Imperial"
      ],
      teamBonus: "Los Cuarteles trabajan +20% más rápido",
      uniqueTechs: [
        { name: "Anarquía", effect: "Los huscarles pueden entrenarse en los cuarteles" },
        { name: "Movilización", effect: "Los cuarteles funcionan un 100 % más rápido" }
      ],
      uniqueUnits: [
        { name: "Huskarl", upgradeName: "Huskarl Elite" }
      ]
    },
    gurjaras: {
      name: "Gurjaras",
      type: "Civilización de camellos y caballería",
      bonuses: [
        "Empieza con 2 arbustos",
        "Se puede guarnecer ganado en el molino para producir comida de forma pasiva",
        "Las unidades montadas infligen un 20/30/40 % más de daño en las edades Feudal/de los Castillos/Imperial",
        "Los muelles tienen +5 de capacidad de guarnición"
      ],
      teamBonus: "Las unidades del camello y el elefante entrenan un 25 % más rápido",
      uniqueTechs: [
        { name: "Chatrias", effect: "Las unidades militares cuestan un 25 % menos de comida" },
        { name: "Guardas fronterizos", effect: "+4 de armadura cuerpo a cuerpo a los jinetes de camello y arqueros sobre elefante" }
      ],
      uniqueUnits: [
        { name: "Lanzador de chakrams", subtitle: "infantería", upgradeName: "Lanzador de chakrams Elite" },
        { name: "Jinete de shrivamsha", subtitle: "caballería", upgradeName: "Jinete de shrivamsha Elite" },
        { name: "Explorador a camello", subtitle: "caballería", upgradeName: "Explorador a camello Elite" }
      ]
    },
    hindustanis: {
      name: "Hindustanís",
      type: "Civilización de camellos y pólvora",
      bonuses: [
        "Los aldeanos cuestan -8/13/18/23% en Alta Edad Media/Feudal/Castillos/Imperial",
        "Los Jinetes de Camello atacan +20% más rápido",
        "Las unidades de pólvora tienen +1 armadura cuerpo a cuerpo/+1 armadura perforante",
        "Pueden construir Caravanserai en la Edad Imperial"
      ],
      teamBonus: "La línea de Caballería Exploradora y las unidades de camello tienen +2 de ataque vs. edificios",
      uniqueTechs: [
        { name: "Camino del Gran Tronco", effect: "Todos los ingresos de oro son un 10 % más rápidos; la tarifa de mercado se reduce al 10 %" },
        { name: "Shatagni", effect: "Los artilleros manuales obtienen +2 de alcance" }
      ],
      uniqueUnits: [
        { name: "Ghulam", subtitle: "infantería", upgradeName: "Ghulam Elite" }
      ]
    },
    huns: {
      name: "Hunos",
      type: "Civilización de caballería",
      bonuses: [
        "No necesitan casas, pero empiezan con -100 de madera",
        "Los Arqueros a Caballo cuestan -10/20% en la Edad de los Castillos/Imperial",
        "Los Trebuchets disparan con más precisión a unidades y objetivos pequeños",
        "En mapas nómadas, el primer Centro Urbano crea un Caballo explorador"
      ],
      teamBonus: "Los Establos trabajan +20% más rápido",
      uniqueTechs: [
        { name: "Razias", effect: "Crear tarcanos en establos" },
        { name: "Ateísmo", effect: "Las reliquias enemigas generan un 50 % menos de recursos; las victorias por maravillas y reliquias tardan 100 años más" }
      ],
      uniqueUnits: [
        { name: "Tarcano", subtitle: "caballería", upgradeName: "Tarcano Elite" }
      ]
    },
    incas: {
      name: "Incas",
      type: "Civilización de infantería",
      bonuses: [
        "Las casas y asentamientos proporcionan +5 de espacio de población",
        "Los edificios cuestan -15% de piedra",
        "Las unidades militares cuestan -5/10/15/20% de comida en Alta Edad Media/Feudal/Castillos/Imperial",
        "Los aldeanos se benefician de las mejoras de infantería de la Herrería desde la Edad de los Castillos"
      ],
      teamBonus: "Empiezan con una Llama gratis",
      uniqueTechs: [
        { name: "Eslinga Andina", effect: "Los guerrilleros y los soldados con honda no tienen alcance mínimo; los soldados con honda ganan +1 de ataque." },
        { name: "Escudos de tela", effect: "Los kamayuks, los soldados con honda y los guerreros champi ganan +1 de armadura y +1 de armadura perforante." }
      ],
      uniqueUnits: [
        { name: "Kamayuk", upgradeName: "Kamayuk Elite" }
      ]
    },
    italians: {
      name: "Italianos",
      type: "Civilización de arqueros y naval",
      bonuses: [
        "Avanzar a la siguiente era cuesta -15%",
        "Los Arqueros a pie y los Condotieros tienen +1 armadura cuerpo a cuerpo/+1 armadura perforante",
        "Las tecnologías del Muelle y la Universidad cuestan -25%",
        "Las unidades de pólvora cuestan -20%",
        "Los barcos pesqueros cuestan -15%"
      ],
      teamBonus: "El Condotiero disponible en el Cuartel en la Edad Imperial",
      uniqueTechs: [
        { name: "Ruta de la seda", effect: "Las unidades mercantes cuestan un 50 % menos" },
        { name: "Pirotecnia", effect: "Los artilleros manuales infligen un 15 % más de daño perforante y son más precisos" }
      ],
      uniqueUnits: [
        { name: "Ballestero genovés", subtitle: "arquero a pie", upgradeName: "Ballestero genovés Elite" }
      ]
    },
    japanese: {
      name: "Japoneses",
      type: "Civilización de infantería",
      bonuses: [
        "Los Molinos, Campamentos Madereros y Mineros cuestan -50%",
        "La infantería ataca +33% más rápido desde la Edad Feudal",
        "Los Arqueros a Caballo tienen +2 de ataque vs. soldados a distancia (excepto escaramuzadores)",
        "Los barcos pesqueros trabajan +5/10/15/20% más rápido en Alta Edad Media/Feudal/Castillos/Imperial; +100% de PV"
      ],
      teamBonus: "La línea de Galeras tiene +4 de alcance visual",
      uniqueTechs: [
        { name: "Yasama", effect: "Las torres disparan flechas adicionales" },
        { name: "Kataparuto", effect: "Los trebuchets atacan y se arman y desarman más rápido" }
      ],
      uniqueUnits: [
        { name: "Samurái", upgradeName: "Samurái Elite" }
      ]
    },
    jurchens: {
      name: "Jurchens",
      type: "Civilización de caballería y pólvora",
      bonuses: [
        "La carne de animales cazados y de granja no se descompone",
        "Las unidades montadas y los Lanceros de Fuego atacan +25% más rápido desde la Edad Feudal",
        "Los Ingenieros de Asedio disponibles en la Edad de los Castillos",
        "Las mejoras de asedio y fortificación cuestan -75% de madera y se investigan +100% más rápido",
        "Las unidades reciben -50% de daño de fuego amigo"
      ],
      teamBonus: "Las unidades de pólvora tienen +2 de alcance visual",
      uniqueTechs: [
        { name: "Bastiones Fortificados", effect: "Las defensas regeneran 500 PV/min." },
        { name: "Bombas de Trueno", effect: "Carros de Cohetes, Granaderos y Lou Chuans detonan al morir." }
      ],
      uniqueUnits: [
        { name: "Pagoda de Hierro", subtitle: "caballería pesada", upgradeName: "Pagoda de Hierro Elite" },
        { name: "Granadero", subtitle: "unidad de pólvora", upgradeName: "Granadero Elite" }
      ]
    },
    khmer: {
      name: "Jemer",
      type: "Civilización de asedio y elefantes",
      bonuses: [
        "No se requieren edificios para avanzar de era ni para desbloquear otros edificios",
        "Los agricultores no necesitan Molinos ni Centros Urbanos para depositar comida",
        "Los aldeanos pueden guarnecer en casas",
        "Los Elefantes de Batalla se mueven +10% más rápido"
      ],
      teamBonus: "Los Escorpiones tienen +1 de rango",
      uniqueTechs: [
        { name: "Colmillos de acero", effect: "+3 de ataque en elefantes de combate" },
        { name: "Ballesta doble", effect: "Los elefantes con balista y los escorpiones disparan un proyectil adicional" }
      ],
      uniqueUnits: [
        { name: "Balistario", upgradeName: "Balistario Elite" }
      ]
    },
    khitans: {
      name: "Khitán",
      type: "Civilización de infantería y caballería",
      bonuses: [
        "Los Pastos reemplazan a las Granjas",
        "Los efectos de las mejoras de ataque cuerpo a cuerpo se duplican",
        "Los escaramuzadores, la línea de Lanceros y de Caballería Exploradora se entrenan y mejoran +15% más rápido",
        "La mejora de Arquero de Caballería Pesada disponible en la Edad de los Castillos y cuesta -50%"
      ],
      teamBonus: "Infantería +2 de ataque vs. soldados a distancia",
      uniqueTechs: [
        { name: "Armadura laminada", effect: "La infantería y los guerrilleros devuelven un 25 % del daño cuerpo a cuerpo al atacante" },
        { name: "Caballería ordo", effect: "La caballería regenera puntos de resistencia en combate" }
      ],
      uniqueUnits: [
        { name: "Liao Dao", subtitle: "infantería", upgradeName: "Liao Dao Elite" }
      ]
    },
    lithuanians: {
      name: "Lituanos",
      type: "Civilización de caballería y monjes",
      bonuses: [
        "Cada Centro Urbano proporciona +100 de comida",
        "La línea de Lanceros y la línea de Escaramuzadores se mueven +10% más rápido",
        "Cada Reliquia guarnecida otorga +1 de ataque a la línea de Caballeros y a los Leitis (máximo +4)"
      ],
      teamBonus: "Los Monasterios trabajan +20% más rápido",
      uniqueTechs: [
        { name: "Fuertes en las colinas", effect: "Centros urbanos: +3 de alcance" },
        { name: "Escudo rectangular", effect: "Lanceros y guerrilleros: +2 de armadura" }
      ],
      uniqueUnits: [
        { name: "Leitis", subtitle: "caballería", upgradeName: "Leitis Elite" },
        { name: "Húsares alados", subtitle: "caballería", upgradeName: "Húsares alados Elite" }
      ]
    },
     magyars: {
       name: "Magiares",
       type: "Civilización de caballería",
       bonuses: [
         "Los aldeanos eliminan a los lobos de un golpe",
         "La línea de caballería de exploración cuesta un 15 % menos",
         "Mejoras de ataque cuerpo a cuerpo gratis"
       ],
       teamBonus: "Los arqueros a caballo se crean un 25 % más rápido",
       uniqueTechs: [
         { name: "Ejército corviniano", effect: "Los huszár magiares dejan de costar oro y pasan a costar comida adicional" },
         { name: "Arco recurvo", effect: "+1 ataque y +1 alcance para arqueros a caballo" }
       ],
       uniqueUnits: [
         { name: "Huszár magiar", subtitle: "caballería", upgradeName: "Huszár magiar Elite" }
       ]
     },
    malay: {
      name: "Malayo",
      type: "Civilización naval",
      bonuses: [
        "Avanzar a la siguiente era es +66% más rápido",
        "Las mejoras de armadura de infantería son gratuitas",
        "Los Elefantes de Batalla cuestan -25/35% en la Edad de los Castillos/Imperial",
        "Las trampas de peces cuestan -33% y proporcionan +200% de comida"
      ],
      teamBonus: "Los Muelles tienen +6 de alcance visual",
      uniqueTechs: [
        { name: "Talasocracia", effect: "Mejora los muelles a puertos" },
        { name: "Leva en masa", effect: "La milicia y subsiguientes dejan de costar oro y cuestan comida adicional" }
      ],
      uniqueUnits: [
        { name: "Recluta con karambit", subtitle: "infantería", upgradeName: "Recluta con karambit Elite" }
      ]
    },
    malians: {
      name: "Malienses",
      type: "Civilización de infantería",
      bonuses: [
        "Los edificios cuestan -15% de madera",
        "Los aldeanos depositan +10% más de oro",
        "Las unidades del Cuartel tienen +1/+2/+3 de armadura perforante en Edad Feudal/Castillos/Imperial"
      ],
      teamBonus: "Las Universidades trabajan +80% más rápido",
      uniqueTechs: [
        { name: "Tigui", effect: "CU disparan flechas aunque estén vacíos." },
        { name: "Farimba", effect: "Caballería +5 ataque." }
      ],
      uniqueUnits: [
        { name: "Gbeto", upgradeName: "Gbeto Elite" }
      ]
    },
    mapuche: {
      name: "Mapuche",
      type: "Civilización de caballería y unidades de contraataque",
      bonuses: [
        "Los recolectores depositan +20% más de comida",
        "Los asentamientos pueden entrenar la línea de Lanceros y Escaramuzadores",
        "Infantería, Honderos y Escaramuzadores +5/10/15 PV en Edad Feudal/Castillos/Imperial",
        "Las unidades montadas generan +3 de oro al derrotar unidades militares",
        "Los Castillos enemigos se revelan en el mapa"
      ],
      teamBonus: "La línea de Lanceros y los Escaramuzadores tienen +2 de alcance visual",
      uniqueTechs: [
        { name: "Malón", effect: "Los jinetes con boleadoras, los soldados con honda y los guerrilleros infligen daño perforante" },
        { name: "Butalmapu", effect: "Las unidades únicas de equipo del castillo y los jinetes con boleadoras cuestan un 15 % menos" }
      ],
      uniqueUnits: [
        { name: "Kona", subtitle: "caballería pesada", upgradeName: "Kona Elite" },
        { name: "Bolas Rider", subtitle: "caballería a distancia", upgradeName: "Bolas Rider Elite" }
      ]
    },
    mayans: {
      name: "Mayas",
      type: "Civilización de arqueros",
      bonuses: [
        "Empiezan con +1 aldeano, pero -50 de comida",
        "Los recursos duran +15% más",
        "Los arqueros a pie cuestan -10/20/30% en Edad Feudal/Castillos/Imperial"
      ],
      teamBonus: "Las murallas cuestan -50%",
      uniqueTechs: [
        { name: "Lanzadores de Hul'che", effect: "Escaramuzadores lanzan un proyectil adicional con +1 ataque perforante." },
        { name: "Holcans", effect: "Guerreros Águila +40 PV." }
      ],
      uniqueUnits: [
        { name: "Arquero de Plumas", upgradeName: "Arquero de Plumas Elite" }
      ]
    },
    mongols: {
      name: "Mongoles",
      type: "Civilización de arqueros a caballo",
      bonuses: [
        "Los cazadores trabajan +40% más rápido",
        "Los Arqueros a Caballo atacan +25% más rápido",
        "La línea de Caballería Exploradora y los Lanceros de Estepa tienen +20/30% de PV en Edad de los Castillos/Imperial"
      ],
      teamBonus: "La línea de Caballería Exploradora tiene +2 de alcance visual",
      uniqueTechs: [
        { name: "Nómadas", effect: "Las casas perdidas no disminuyen el espacio de población" },
        { name: "Instrucción militar", effect: "Las unidades del taller de maquinaria de asedio se mueven un 50 % más rápido" }
      ],
      uniqueUnits: [
        { name: "Mangudai", upgradeName: "Mangudai Elite" }
      ]
    },
    muisca: {
      name: "Muisca",
      type: "Civilización de arqueros y monjes",
      bonuses: [
        "Avanzar a la siguiente era cuesta -50% de oro",
        "Los asentamientos cuestan -25% y curan las unidades cercanas",
        "Los Guerreros Champi y las unidades de Galería de Tiro tienen +1/2/3 de armadura cuerpo a cuerpo en Edad Feudal/Castillos/Imperial",
        "Los monjes recuperan fe +50% más rápido",
        "Caravana y Gremios son gratuitos"
      ],
      teamBonus: "Las fuentes de oro naturales duran +15% más",
      uniqueTechs: [
        { name: "Herbología", effect: "La línea de arqueros y los guerreros champi se mueven un 15 % más rápido" },
        { name: "Huaracas", effect: "Aumenta el rango y la velocidad de entrenamiento de los honderos." }
      ],
      uniqueUnits: [
        { name: "Guerrero Guecha", subtitle: "hostigador", upgradeName: "Guerrero Guecha Elite" },
        { name: "Guardia del Templo", subtitle: "infantería pesada", upgradeName: "Guardia del Templo Elite" }
      ]
    },
    persians: {
      name: "Persas",
      type: "Civilización de caballería",
      bonuses: [
        "Empieza con +50 de madera y comida",
        "Los centros urbanos y los muelles ganan un 100 % más de PR y trabajan un 5/10/15/20 % más rápido en la Edad Oscura, la Edad Feudal, la Edad de los Castillos, y la Edad Imperial, respectivamente",
        "Tácticas de los partias disponibles en la Edad de los Castillos",
        "Puedes construir caravasares en la Edad Imperial"
      ],
      teamBonus: "Los caballeros ganan +2 de ataque contra los soldados a distancia",
      uniqueTechs: [
        { name: "Kamandaran", effect: "el coste de oro de los arqueros se reemplaza por un coste adicional de madera" },
        { name: "Ciudadelas", effect: "los castillos infligen +4 de ataque, +3 contra arietes, +3 contra infantería y reciben un 25 % menos de daño adicional" }
      ],
      uniqueUnits: [
        { name: "Elefante de guerra", subtitle: "caballería", upgradeName: "Elefante de guerra Elite" },
        { name: "Savar", subtitle: "caballería" }
      ]
    },
    poles: {
      name: "Polacos",
      type: "Civilización de caballería",
      bonuses: [
        "El Folwark reemplaza al Molino",
        "Los aldeanos regeneran 10/15/20 PV en Edad Feudal/Castillos/Imperial",
        "Los mineros de piedra generan oro además de piedra",
        "Línea de Sangre y las mejoras de la línea de Caballería Exploradora cuestan -50% de comida"
      ],
      teamBonus: "La línea de Caballería Exploradora tiene +1 de ataque vs. soldados a distancia",
      uniqueTechs: [
        { name: "Szlachta Privileges", effect: "Caballería Ligera cuesta -60% oro." },
        { name: "Lechitic Legacy", effect: "Caballería genera oro al matar enemigos." }
      ],
      uniqueUnits: [
        { name: "Obuch", upgradeName: "Obuch Elite" }
      ]
    },
    portuguese: {
      name: "Portugueses",
      type: "Civilización naval y de pólvora",
      bonuses: [
        "Los recolectores generan madera además de comida",
        "Todas las unidades cuestan -20% de oro",
        "Pueden construir Feitoria en la Edad Imperial",
        "Los barcos tienen +10/15/20% de PV en Edad Feudal/Castillos/Imperial"
      ],
      teamBonus: "Las tecnologías se investigan +25% más rápido",
      uniqueTechs: [
        { name: "Circunnavegación", effect: "Todo el mapa se revela como explorado; los barcos se entrenan 33% más rápido." },
        { name: "Arquebus", effect: "Unidades de pólvora con 100% precisión." }
      ],
      uniqueUnits: [
        { name: "Órgano de Cañones", upgradeName: "Órgano de Cañones Elite" }
      ]
    },
    romans: {
      name: "Romanos",
      type: "Civilización de infantería y caballería",
      bonuses: [
        "Los aldeanos recolectan, construyen y reparan +5% más rápido",
        "Los efectos de las mejoras de armadura de infantería se duplican",
        "Los Escorpiones cuestan -50% de oro",
        "La línea de Galeras y los Dromones tienen +1 armadura cuerpo a cuerpo/+1 armadura perforante"
      ],
      teamBonus: "El rango mínimo de los Escorpiones se reduce",
      uniqueTechs: [
        { name: "Ballistas", effect: "Escorpiones y Galeras de guerra disparan 33% más rápido." },
        { name: "Comitatenses", effect: "Infantería y caballería se crean un 50% más rápido; carga de ataque." }
      ],
      uniqueUnits: [
        { name: "Legionario", upgradeName: "Centurión" }
      ]
    },
    saracens: {
      name: "Sarracenos",
      type: "Civilización de camellos y naval",
      bonuses: [
        "La tarifa comercial del Mercado es solo del 5%; los Mercados cuestan -100 de madera",
        "Las unidades de camello tienen +25% de PV",
        "La línea de Galeras ataca +25% más rápido",
        "Los Barcos de Transporte tienen +100% de PV y +20 de capacidad de carga"
      ],
      teamBonus: "Los Arqueros a pie y los Escaramuzadores tienen +2 de ataque vs. edificios",
      uniqueTechs: [
        { name: "Bimaristan", effect: "Monjes curan automáticamente a múltiples unidades cercanas." },
        { name: "Contrapesos", effect: "Trebuchets y línea de Mangonela +15% ataque." }
      ],
      uniqueUnits: [
        { name: "Mameluco", upgradeName: "Mameluco Elite" }
      ]
    },
    shu: {
      name: "Shu",
      type: "Civilización de arqueros y asedio",
      bonuses: [
        "Los leñadores generan comida además de madera",
        "Las tecnologías de unidades de arqueros en la Galería de Tiro y la Herrería cuestan -25%",
        "Las armas de asedio y los barcos de guerra de asedio se mueven +10/15% más rápido en Edad de los Castillos/Imperial"
      ],
      teamBonus: "Los arqueros a pie tienen +2 de alcance visual",
      uniqueTechs: [
        { name: "Formación Serpiente Enrollada", effect: "Lanceros y Guardianes de Pluma Blanca ganan PV al estar agrupados." },
        { name: "Cargador de Virotes", effect: "Línea de arqueros, Carros de Guerra y Lou Chuans disparan proyectiles adicionales." }
      ],
      uniqueUnits: [
        { name: "Guardián de Pluma Blanca", upgradeName: "Guardián de Pluma Blanca Elite" }
      ]
    },
    sicilians: {
      name: "Sicilianos",
      type: "Civilización de infantería y caballería",
      bonuses: [
        "Empiezan con +100 de piedra",
        "Las mejoras de granjas proporcionan +125% de comida adicional",
        "Los soldados reciben -40% de daño adicional",
        "Pueden construir Donjon en la Alta Edad Media, reemplaza la línea de Torres de Vigilancia",
        "Las fortificaciones se construyen +50% más rápido; los Centros Urbanos se construyen +100% más rápido"
      ],
      teamBonus: "Los Barcos de Transporte tienen +5 de alcance visual y cuestan -50%",
      uniqueTechs: [
        { name: "Primera Cruzada", effect: "Cada CU crea 5 Sargentos; mayor resistencia a la conversión." },
        { name: "Hauberque", effect: "Línea de Caballeros +1/+2 armadura." }
      ],
      uniqueUnits: [
        { name: "Sargento", upgradeName: "Sargento Elite" }
      ]
    },
    tatars: {
      name: "Tártaros",
      type: "Civilización de arqueros a caballo",
      bonuses: [
        "Los animales de granja duran +50% más",
        "Las unidades causan +25% de daño cuando combaten desde terreno elevado",
        "Los nuevos Centros Urbanos crean 2 Ovejas desde la Edad de los Castillos",
        "Anillo Pulgar y Tácticas Partas son gratuitos"
      ],
      teamBonus: "Los Arqueros Montados tienen +2 de alcance visual",
      uniqueTechs: [
        { name: "Silk Armor", effect: "Lanceros de Estepa y Cav. Ligera +1/+1 armadura." },
        { name: "Timurid Siegecraft", effect: "Trebuchets +2 rango; habilita Camellos Ardientes." }
      ],
      uniqueUnits: [
        { name: "Keshik", upgradeName: "Keshik Elite" }
      ]
    },
    teutons: {
      name: "Teutones",
      type: "Civilización de infantería y defensiva",
      bonuses: [
        "Las granjas cuestan -40%",
        "Los Centros Urbanos tienen +10 de capacidad de guarnición; las Torres tienen +5 de capacidad de guarnición",
        "Las unidades del Cuartel y del Establo tienen +1/+2 de armadura cuerpo a cuerpo en Edad de los Castillos/Imperial",
        "Los monjes tienen +100% de rango de curación",
        "Aspilleras y Medicina Herbal son gratuitas"
      ],
      teamBonus: "Las unidades son más resistentes a la conversión",
      uniqueTechs: [
        { name: "Ironclad", effect: "Asedio +4 armadura cuerpo a cuerpo." },
        { name: "Crenellations", effect: "Castillos +3 rango; infantería garnisonada puede disparar." }
      ],
      uniqueUnits: [
        { name: "Caballero Teutónico", upgradeName: "Cab. Teutónico Elite" }
      ]
    },
    turks: {
      name: "Turcos",
      type: "Civilización de pólvora",
      bonuses: [
        "Los mineros de oro trabajan +25% más rápido",
        "La línea de Caballería Exploradora tiene +1 de armadura perforante y sus mejoras son gratuitas",
        "Química es gratuita; las tecnologías de pólvora cuestan -50%",
        "Las unidades de pólvora tienen +25% de PV"
      ],
      teamBonus: "Las unidades de pólvora se entrenan +25% más rápido",
      uniqueTechs: [
        { name: "Sipahi", effect: "Arqueros a Caballo +20 PV." },
        { name: "Artillery", effect: "Cañones de Bombarda +2 rango." }
      ],
      uniqueUnits: [
        { name: "Jenízaro", upgradeName: "Jenízaro Elite" }
      ]
    },
    tupi: {
      name: "Tupí",
      type: "Civilización de arqueros e infantería",
      bonuses: [
        "Empiezan con +25 de cada recurso",
        "Los aldeanos pueden guarnecer en asentamientos",
        "Las unidades caídas devuelven el 15% de su costo",
        "Las mejoras de Galería de Tiro y Cuartel cuestan -50% de comida"
      ],
      teamBonus: "Las Torres y Castillos proporcionan +10 de espacio de población",
      uniqueTechs: [
        { name: "Caciques", effect: "Champi Warriors y honderos atacan más rápido." },
        { name: "Curare", effect: "Arqueros a pie y fortificaciones causan daño por veneno." }
      ],
      uniqueUnits: [
        { name: "Arquero de Madera Negra", subtitle: "arquero económico", upgradeName: "Arquero de Madera Negra Elite" },
        { name: "Guerrero Ibirapema", subtitle: "infantería de área", upgradeName: "Guerrero Ibirapema Elite" }
      ]
    },
    vietnamese: {
      name: "Vietnamitas",
      type: "Civilización de arqueros",
      bonuses: [
        "Los Centros Urbanos enemigos se revelan al inicio de la partida",
        "Las mejoras económicas no cuestan madera y se investigan +100% más rápido",
        "Las unidades de Galería de Tiro y los Lanceros de Fuego tienen +20% de PV",
        "El Reclutamiento es gratuito"
      ],
      teamBonus: "La mejora de Escaramuzador Imperial disponible en la Edad Imperial",
      uniqueTechs: [
        { name: "Chatras", effect: "Elefantes de Batalla +100 PV." },
        { name: "Paper Money", effect: "Los leñadores generan oro lentamente en adición a la madera." }
      ],
      uniqueUnits: [
        { name: "Rattan Archer", upgradeName: "Rattan Archer Elite" },
        { name: "Escaramuzador Imperial", subtitle: "escaramuzador", upgradeName: "Escaramuzador Imperial Elite" }
      ]
    },
    vikings: {
      name: "Vikingos",
      type: "Civilización de infantería y naval",
      bonuses: [
        "La Carretilla y el Carrito de Mano son gratuitos",
        "La infantería tiene +20% de PV desde la Edad Feudal",
        "Los barcos de guerra cuestan -10/15/20% en Edad Feudal/Castillos/Imperial"
      ],
      teamBonus: "Los Muelles cuestan -15%",
      uniqueTechs: [
        { name: "Chieftains", effect: "Infantería +5 ataque vs caballería, +4 vs camellos; genera oro al matar aldeanos y comerciantes." },
        { name: "Bogsveigar", effect: "Arqueros y Longboats +1 ataque." }
      ],
      uniqueUnits: [
        { name: "Berserk", upgradeName: "Berserk Elite" }
      ]
    },
    wei: {
      name: "Wei",
      type: "Civilización de caballería",
      bonuses: [
        "Reciben un aldeano gratis por cada mejora económica investigada",
        "La Caballería Hei Guang y el Xianbei Raider tienen +20/30% de PV en Edad de los Castillos/Imperial",
        "Los Trebuchets de Tracción y los Lou Chuans cuestan -25%"
      ],
      teamBonus: "La caballería tiene +2 de ataque vs. armas de asedio",
      uniqueTechs: [
        { name: "Tuntian", effect: "Los soldados generan comida pasivamente." },
        { name: "Armadura Ming Guang", effect: "Unidades montadas +4 armadura cuerpo a cuerpo." }
      ],
      uniqueUnits: [
        { name: "Caballería Tigre", subtitle: "caballería", upgradeName: "Caballería Tigre Elite" },
        { name: "Xianbei Raider", subtitle: "arquero montado", upgradeName: "Xianbei Raider Elite" }
      ]
    },
    wu: {
      name: "Wu",
      type: "Civilización de infantería y naval",
      bonuses: [
        "Los edificios de producción militar y los Muelles proporcionan +55 de comida",
        "La infantería regenera 10/15/30 PV por minuto en Edad Feudal/Castillos/Imperial",
        "Los Espadachines Jian y la Caballería Hei Guang tienen +2 de ataque en la Edad Imperial",
        "Carenado y Dique Seco son gratuitos"
      ],
      teamBonus: "Las casas se construyen +100% más rápido",
      uniqueTechs: [
        { name: "Tácticas del Acantilado Rojo", effect: "Barcos de demolición y Arqueros de Fuego causan daño de llamas a barcos y edificios." },
        { name: "Tigre Sentado", effect: "Trebuchets de Tracción y Lou Chuans disparan proyectiles adicionales." }
      ],
      uniqueUnits: [
        { name: "Arquero de Fuego", subtitle: "arquero a pie", upgradeName: "Arquero de Fuego Elite" },
        { name: "Espadachín Jian", subtitle: "infantería", upgradeName: "Espadachín Jian Elite" }
      ]
    }
  },

  uniqueTechsById: {
    "ui_uniquetech1": { name: "Tecnología Única I", effect: "Tecnología exclusiva Edad Castillos." },
    "ui_uniquetech2": { name: "Tecnología Única II", effect: "Tecnología exclusiva Edad Imperial." },
    "armenians_uniquetech1": { name: "Flota ciliciana", effect: "Buques de demolición y Dromones disparan un proyectil adicional." },
    "armenians_uniquetech2": { name: "Feretorios", effect: "Infantería, excepto línea de lanceros: +30 PV; sacerdotes guerreros: +100% de velocidad de curación." },
    "aztecs_uniquetech1": { name: "Garras de Jaguar", effect: "Guerreros Jaguar tienen +4 de ataque." },
    "aztecs_uniquetech2": { name: "Ritual Florido", effect: "Unidades pierden 5 PV al matar pero reciben +4 de ataque." },
    "bengalis_uniquetech1": { name: "Palanquín de la Reina", effect: "Villagers trabajan +35% más rápido." },
    "bengalis_uniquetech2": { name: "Maestría Dwyaja", effect: "Elefantes de Batalla tienen +15 PV y +1 de armadura." },
    "berbers_uniquetech1": { name: "Mejora de Caballería Beréber", effect: "Camellos reciben -30% de costo de investigación y se entrenan +30% más rápido." },
    "berbers_uniquetech2": { name: "Mejora de Caballería Beréber", effect: "Camellos reciben -30% de costo de investigación y se entrenan +30% más rápido." },
    "bohemians_uniquetech1": { name: "Husita Wagenburg", effect: "Carros de Guerra disparan desde rango melee; infantería garnisonada dispara flecha." },
    "bohemians_uniquetech2": { name: "Husita Wagenburg", effect: "Carros de Guerra disparan desde rango melee; infantería garnisonada dispara flecha." },
    "britons_uniquetech1": { name: "Yeomen", effect: "Arqueros a pie +1 rango; Torres +2 ataque." },
    "britons_uniquetech2": { name: "Warwolf", effect: "Trebuchets 100% precisión y daño en área." },
    "bulgarians_uniquetech1": { name: "Lanzadera de Fuego Búlgara", effect: "Lanzaderas de Fuego se entrenan +100% más rápido y cuestan -30%." },
    "bulgarians_uniquetech2": { name: "Boyar Sangre", effect: "Boyars regeneran 10 PV por minuto." },
    "burgundians_uniquetech1": { name: "Primera Cruzada", effect: "Cada Castillo crea 5 Sargentos; mayor resistencia a la conversión." },
    "burgundians_uniquetech2": { name: "Hauberque", effect: "Línea de Caballeros +1/+2 de armadura." },
    "burmese_uniquetech1": { name: "Carro de Batalla Elefante", effect: "Elefantes de Batalla disponibles en Edad Feudal; +3 PV regeneración." },
    "burmese_uniquetech2": { name: "Muro Aislador", effect: "Edificios +3 de armadura perforante." },
    "byzantines_uniquetech1": { name: "Catafractos Sármatas", effect: "Catafractos tienen +30% de PV." },
    "byzantines_uniquetech2": { name: "Fuego Griego", effect: "Galeras de Fuego y Dromones disparan fuego griego." },
    "celts_uniquetech1": { name: "Furor Celta", effect: "Infantería +25% de velocidad de ataque." },
    "celts_uniquetech2": { name: "Furor Celta", effect: "Infantería +25% de velocidad de ataque." },
    "chinese_uniquetech1": { name: "Estrategia del Emperador", effect: "Todos los Hombres de Armas +20 PV." },
    "chinese_uniquetech2": { name: "Refinación de Pólvora", effect: "Unidades de pólvora disparan +15% más rápido." },
    "cumans_uniquetech1": { name: "Jinetes Cumanos", effect: "Caballería se entrena +25% más rápido." },
    "cumans_uniquetech2": { name: "Baskaks Mongoles", effect: "Caballería tiene +20% de PV y +1/+2 de armadura." },
    "dravidians_uniquetech1": { name: "Shrivamsha Cavalry", effect: "Caballos de Shrivamsha tienen +15 PV y +1 de armadura." },
    "dravidians_uniquetech2": { name: "Brazo Corto", effect: "Peons y Sacerdotes Guerreros tienen +20% de velocidad de ataque." },
    "ethiopians_uniquetech1": { name: "Fuego Etíope", effect: "Honderos tienen +20 PV; Pólvora +100% de daño." },
    "ethiopians_uniquetech2": { name: "Fuego Etíope", effect: "Honderos tienen +20 PV; Pólvora +100% de daño." },
    "franks_uniquetech1": { name: "Caballería Franca", effect: "Caballería se entrena +20% más rápido y cuesta -20%." },
    "franks_uniquetech2": { name: "Caballería Franca", effect: "Caballería se entrena +20% más rápido y cuesta -20%." },
    "georgians_uniquetech1": { name: "Derbazi", effect: "Infantería tiene +50 PV en Edad Castillos; +75 PV en Edad Imperial." },
    "georgians_uniquetech2": { name: "Orgullo Georgiano", effect: "Caballos y Castillos disparan flechas; infantería regenera HP." },
    "goths_uniquetech1": { name: "Ironsides", effect: "Infantería -5/+10 armadura cuerpo a cuerpo en Edad Feudal/Castillos." },
    "goths_uniquetech2": { name: "Ironsides", effect: "Infantería -5/+10 armadura cuerpo a cuerpo en Edad Feudal/Castillos." },
    "gurjaras_uniquetech1": { name: "Chariots de Carro de Batalla", effect: "Carros de Guerra disponibles en Edad Feudal; +3 de velocidad de ataque." },
    "gurjaras_uniquetech2": { name: "Shrivamsha Cavalry", effect: "Hombres de Armas tienen +20 PV; Caballos de Shrivamsha +3 de ataque." },
    "hindustanis_uniquetech1": { name: "Elefante de Asedio", effect: "Elefantes de Batalla se entrenan +100% más rápido." },
    "hindustanis_uniquetech2": { name: "Mamelucos de Fuego", effect: "Jenízaros tienen +15 PV." },
    "huns_uniquetech1": { name: "Nómadas", effect: "Edificios se construyen sin cimiento." },
    "huns_uniquetech2": { name: "Caballería Franca", effect: "Caballería tiene +30% de PV." },
    "incas_uniquetech1": { name: "Plataforma de Asedio", effect: "Asedio se entrena +50% más rápido." },
    "incas_uniquetech2": { name: "Andenes", effect: "Economía +15%; Aldeanos cosechan +15% más rápido." },
    "italians_uniquetech1": { name: "Línea de Batalla Italiana", effect: "Infantería y crossbowmen tienen +20% de velocidad de ataque." },
    "italians_uniquetech2": { name: "Línea de Batalla Italiana", effect: "Infantería y crossbowmen tienen +20% de velocidad de ataque." },
    "japanese_uniquetech1": { name: "Samurái", effect: "Samurais se entrenan +50% más rápido." },
    "japanese_uniquetech2": { name: "Samurái", effect: "Samurais se entrenan +50% más rápido." },
    "jurchens_uniquetech1": { name: "Corazas de Jurchen", effect: "Infantería tiene +2/+1 armadura cuerpo a cuerpo/piercing." },
    "jurchens_uniquetech2": { name: "Caballería Jurchen", effect: "Caballería se entrena +33% más rápido." },
    "khitans_uniquetech1": { name: "Espada Catafracta Khitan", effect: "Infantería tiene +30 PV." },
    "khitans_uniquetech2": { name: "Caballería Khitan", effect: "Caballería tiene +20 PV y +1 armadura." },
    "khmer_uniquetech1": { name: "Recolector de Arroz", effect: "Aldeanos cosechan granja +35% más rápido." },
    "khmer_uniquetech2": { name: "Batalla Elefante", effect: "Elefantes de Batalla tienen +15 PV y +1 armadura." },
    "koreans_uniquetech1": { name: "Dinastía Goryeo", effect: "Monjes tienen +50% de PV y regeneran HP." },
    "koreans_uniquetech2": { name: "Tortuga Marina", effect: "Barcos de Tortugas se entrenan +50% más rápido." },
    "lithuanians_uniquetech1": { name: "Caballería Lituania", effect: "Caballería tiene +20 PV y +1 armadura." },
    "lithuanians_uniquetech2": { name: "Tributo", effect: "Cada Castillo genera oro pasivamente." },
    "magyars_uniquetech1": { name: "Caballería Magiar", effect: "Caballería se entrena +35% más rápido." },
    "magyars_uniquetech2": { name: "Caballería Magiar", effect: "Caballería se entrena +35% más rápido." },
    "malay_uniquetech1": { name: "Carro de Batalla Malayo", effect: "Carros de Guerra se entrenan +100% más rápido y cuestan -50%." },
    "malay_uniquetech2": { name: "Carro de Batalla Malayo", effect: "Carros de Guerra se entrenan +100% más rápido y cuestan -50%." },
    "malians_uniquetech1": { name: "Arco Compuesto Griót", effect: "Arqueros a pie tienen +4 de ataque." },
    "malians_uniquetech2": { name: "Armadura de Oro", effect: "Infantería tiene +4/+4 armadura." },
    "mapuche_uniquetech1": { name: "Caballería Mapuche", effect: "Caballería Exploradora tiene +30 PV." },
    "mapuche_uniquetech2": { name: "Caballería Mapuche", effect: "Caballería Exploradora tiene +30 PV." },
    "mayans_uniquetech1": { name: "El Dorado", effect: "Jaguares tienen +4 de ataque y Guerreros Puma se entrenan más rápido." },
    "mayans_uniquetech2": { name: "Observatorio", effect: "Tecnologías de investigación +50% más rápidas en Universidades." },
    "mongols_uniquetech1": { name: "Arco Compuesto Mongol", effect: "Arqueros a caballo tienen +2 de rango." },
    "mongols_uniquetech2": { name: "Arco Compuesto Mongol", effect: "Arqueros a caballo tienen +2 de rango." },
    "muisca_uniquetech1": { name: "Caballería Muisca", effect: "Caballería tiene +20 PV y se entrena más rápido." },
    "muisca_uniquetech2": { name: "Caballería Muisca", effect: "Caballería tiene +20 PV y se entrena más rápido." },
    "persians_uniquetech1": { name: "Elefante de Batalla Persa", effect: "Elefantes de Batalla tienen +20 PV." },
    "persians_uniquetech2": { name: "Carrera de Caballos", effect: "Caballería se entrena +40% más rápido." },
    "poles_uniquetech1": { name: "Husares Polacos", effect: "Caballería ligera se entrena más rápido y tiene mejor armadura." },
    "poles_uniquetech2": { name: "Husares Polacos", effect: "Caballería ligera se entrena más rápido y tiene mejor armadura." },
    "portuguese_uniquetech1": { name: "Carrera de Caballos", effect: "Caballería se entrena +20% más rápido." },
    "portuguese_uniquetech2": { name: "Carrera de Caballos", effect: "Caballería se entrena +20% más rápido." },
    "romans_uniquetech1": { name: "Legionario", effect: "Infantería tiene +50% de PV." },
    "romans_uniquetech2": { name: "Legionario", effect: "Infantería tiene +50% de PV." },
    "saracens_uniquetech1": { name: "Caballería Sárracena", effect: "Caballería ligera tiene +20% de PV." },
    "saracens_uniquetech2": { name: "Caballería Sárracena", effect: "Caballería ligera tiene +20% de PV." },
    "shu_uniquetech1": { name: "Caballería Shu", effect: "Caballería tiene +15 PV y +1 armadura." },
    "shu_uniquetech2": { name: "Administración Shu", effect: "Aldeanos trabajan +35% más rápido." },
    "sicilians_uniquetech1": { name: "Furor Siciliano", effect: "Infantería y Caballería tienen +25% de velocidad de ataque." },
    "sicilians_uniquetech2": { name: "Furor Siciliano", effect: "Infantería y Caballería tienen +25% de velocidad de ataque." },
    "slavs_uniquetech1": { name: "Infantería Eslava", effect: "Infantería +25% de velocidad de ataque." },
    "slavs_uniquetech2": { name: "Infantería Eslava", effect: "Infantería +25% de velocidad de ataque." },
    "spanish_uniquetech1": { name: "Conquista", effect: "Conquistadores se entrenan +33% más rápido." },
    "spanish_uniquetech2": { name: "Navío", effect: "Navío Mercante se entrena +100% más rápido." },
    "tatars_uniquetech1": { name: "Silk Armor", effect: "Lanceros de Estepa y Caballería Ligera +1/+1 armadura." },
    "tatars_uniquetech2": { name: "Timurid Siegecraft", effect: "Trebuchets +2 rango; habilita Camellos Ardientes." },
    "teutons_uniquetech1": { name: "Ironclad", effect: "Asedio +4 armadura cuerpo a cuerpo." },
    "teutons_uniquetech2": { name: "Crenellations", effect: "Castillos +3 rango; infantería garnisonada puede disparar." },
    "turks_uniquetech1": { name: "Sipahi", effect: "Arqueros a Caballo +20 PV." },
    "turks_uniquetech2": { name: "Artillery", effect: "Cañones de Bombarda +2 rango." },
    "tupi_uniquetech1": { name: "Caciques", effect: "Champi Warriors y honderos atacan más rápido." },
    "tupi_uniquetech2": { name: "Curare", effect: "Arqueros a pie y fortificaciones causan daño por veneno." },
    "vietnamese_uniquetech1": { name: "Alquiler de Armas", effect: "Todos los Arqueros cuestan -30% y se entrenan más rápido." },
    "vietnamese_uniquetech2": { name: "Explosión de Fuego", effect: "Pólvora dispara +50% más rápido." },
    "vikings_uniquetech1": { name: "Furor Vikingo", effect: "Infantería +25% de velocidad de ataque." },
    "vikings_uniquetech2": { name: "Barco Largo", effect: "Barcos de Larga Distancia disparan flechas." },
    "wei_uniquetech1": { name: "Caballería Wei", effect: "Caballería tiene +15 PV y +1 armadura." },
    "wei_uniquetech2": { name: "Administración Wei", effect: "Monjes tienen +40 PV y regeneran HP." },
    "wu_uniquetech1": { name: "Tácticas del Acantilado Rojo", effect: "Barcos de demolición y Arqueros de Fuego causan daño de llamas a barcos y edificios." },
    "wu_uniquetech2": { name: "Tigre Sentado", effect: "Trebuchets de Tracción y Lou Chuans disparan proyectiles adicionales." }
  }
};
