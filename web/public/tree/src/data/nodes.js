export const NODES = [

  // ── BARRACKS ────────────────────────────────────────────
  { id: 'militia', type: 'unit', age: 0, building: 'barracks', row: 1, col: 0, prereqs: [], train_cost: { food: 60, gold: 20 }, imgPath: 'img/Unit/8.png' },
  { id: 'manatarms', type: 'upgrade', age: 1, building: 'barracks', row: 2, col: 0, prereqs: ['militia'], research_cost: { food: 100, gold: 40 }, research_time: 40, imgPath: 'img/Unit/10.png', train_cost: { food: 60, gold: 20 } },
  { id: 'longsword', type: 'upgrade', age: 2, building: 'barracks', row: 4, col: 0, prereqs: ['manatarms'], research_cost: { food: 150, gold: 65 }, research_time: 45, imgPath: 'img/Unit/13.png', train_cost: { food: 60, gold: 20 } },
  { id: 'twohanded', type: 'upgrade', age: 3, building: 'barracks', row: 6, col: 0, prereqs: ['longsword'], research_cost: { food: 200, gold: 100 }, research_time: 75, imgPath: 'img/Unit/12.png', train_cost: { food: 60, gold: 20 } },
  { id: 'champion', type: 'upgrade', age: 3, building: 'barracks', row: 7, col: 0, prereqs: ['twohanded'], research_cost: { food: 650, gold: 350 }, research_time: 100, imgPath: 'img/Unit/72.png', train_cost: { food: 60, gold: 20 } },
  { id: 'spearman', type: 'unit', age: 1, building: 'barracks', row: 2, col: 1, prereqs: [], train_cost: { food: 35, wood: 25 }, imgPath: 'img/Unit/31.png' },
  { id: 'pikeman', type: 'upgrade', age: 2, building: 'barracks', row: 4, col: 1, prereqs: ['spearman'], research_cost: { food: 160, gold: 60 }, research_time: 45, imgPath: 'img/Unit/11.png', train_cost: { food: 35, wood: 25 } },
  { id: 'halberdier', type: 'upgrade', age: 3, building: 'barracks', row: 6, col: 1, prereqs: ['pikeman'], research_cost: { food: 75, gold: 25 }, research_time: 50, imgPath: 'img/Unit/104.png', train_cost: { food: 35, wood: 25 } },
  { id: 'squires', type: 'tech', age: 2, building: 'barracks', row: 5, col: 5, prereqs: [], research_cost: { food: 100 }, research_time: 40, imgPath: 'img/Tech/80.png' },
  { id: 'arson', type: 'tech', age: 1, building: 'barracks', row: 2, col: 5, prereqs: [], research_cost: { food: 75, gold: 25 }, research_time: 50, imgPath: 'img/Tech/118.png' },
  { id: 'gambesons', type: 'tech', age: 2, building: 'barracks', row: 4, col: 5, prereqs: [], research_cost: { food: 100, gold: 100 }, research_time: 45, imgPath: 'img/Tech/116.png' },

  // ── Eagle Line (Mesoamerican regional) ──────────────────
  { id: 'eaglescout', type: 'unit', age: 1, building: 'barracks', row: 2, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { food: 20, gold: 50 }, imgPath: 'img/Unit/109.png' },
  { id: 'eaglewarrior', type: 'upgrade', age: 2, building: 'barracks', row: 4, col: 3, special: true, variant: 'regional', prereqs: ['eaglescout'], research_cost: { food: 200, gold: 200 }, research_time: 50, imgPath: 'img/Unit/148.png', train_cost: { food: 20, gold: 50 } },
  { id: 'eliteeagle', type: 'upgrade', age: 3, building: 'barracks', row: 6, col: 3, special: true, variant: 'regional', prereqs: ['eaglewarrior'], research_cost: { food: 800, gold: 500 }, research_time: 75, imgPath: 'img/Unit/149.png', train_cost: { food: 20, gold: 50 } },

  // ── Champi Line (South American regional) ───────────────
  { id: 'champiscout', type: 'unit', age: 0, building: 'barracks', row: 1, col: 0, special: true, variant: 'regional', prereqs: [], train_cost: { food: 50, gold: 25 }, imgPath: 'img/Unit/540.png' },
  { id: 'champirunner', type: 'upgrade', age: 1, building: 'barracks', row: 2, col: 0, special: true, variant: 'regional', prereqs: ['champiscout'], research_cost: { food: 120, gold: 60 }, research_time: 40, imgPath: 'img/Unit/555.png', train_cost: { food: 50, gold: 25 } },
  { id: 'champiwarrior', type: 'upgrade', age: 2, building: 'barracks', row: 4, col: 0, special: true, variant: 'regional', prereqs: ['champirunner'], research_cost: { food: 200, gold: 175 }, research_time: 50, imgPath: 'img/Unit/541.png', train_cost: { food: 50, gold: 25 } },
  { id: 'elitechampi', type: 'upgrade', age: 3, building: 'barracks', row: 6, col: 0, special: true, variant: 'regional', prereqs: ['champiwarrior'], research_cost: { food: 650, gold: 450 }, research_time: 75, imgPath: 'img/Unit/542.png', train_cost: { food: 50, gold: 25 } },

  // ── Barracks special / unique ────────────────────────────
  { id: 'legionary', type: 'upgrade', age: 3, building: 'barracks', row: 6, col: 0, special: true, variant: 'unique', prereqs: ['longsword'], research_cost: { food: 300, gold: 200 }, research_time: 60, imgPath: 'img/Unit/139.png', train_cost: { food: 60, gold: 20 } },
  { id: 'fire_lancer', type: 'unit', age: 2, building: 'barracks', row: 4, col: 2, special: true, variant: 'regional', prereqs: [], train_cost: { wood: 45, gold: 45 }, imgPath: 'img/Unit/457.png' },
  { id: 'elite_fire_lancer', type: 'upgrade', age: 3, building: 'barracks', row: 6, col: 2, special: true, variant: 'regional', prereqs: ['fire_lancer'], research_cost: { food: 750, gold: 400 }, research_time: 75, imgPath: 'img/Unit/458.png', train_cost: { wood: 45, gold: 45 } },
  { id: 'flemish_militia', type: 'unit', age: 1, building: 'barracks', row: 2, col: 2, special: true, variant: 'unique', prereqs: [], train_cost: { food: 30, gold: 25 }, imgPath: 'img/Unit/354.png' },
  { id: 'jian_swordsman', type: 'unit', age: 2, building: 'barracks', row: 4, col: 2, special: true, variant: 'unique', prereqs: [], train_cost: { food: 45, gold: 50 }, imgPath: 'img/Unit/437.png' },
  { id: 'temple_guard', type: 'unit', age: 2, building: 'barracks', row: 4, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { food: 50, gold: 30 }, imgPath: 'img/Unit/553.png' },
  { id: 'ibirapema', type: 'unit', age: 2, building: 'barracks', row: 4, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { food: 40, gold: 20 }, imgPath: 'img/Unit/551.png' },
  { id: 'condottiero', type: 'unit', age: 3, building: 'barracks', row: 6, col: 2, special: true, variant: 'unique', prereqs: [], train_cost: { food: 50, gold: 35 }, imgPath: 'img/Unit/134.png' },
  { id: 'huskarl_b', type: 'unit', age: 2, building: 'barracks', row: 4, col: 2, special: true, variant: 'unique', prereqs: [], train_cost: { food: 52, gold: 26 }, imgPath: 'img/Unit/50.png' },


  // ── ARCHERY RANGE ───────────────────────────────────────
  { id: 'archer', type: 'unit', age: 1, building: 'archery', row: 3, col: 0, prereqs: [], train_cost: { wood: 25, gold: 45 }, imgPath: 'img/Unit/17.png' },
  { id: 'crossbow', type: 'upgrade', age: 2, building: 'archery', row: 4, col: 0, prereqs: ['archer'], research_cost: { food: 125, gold: 75 }, research_time: 35, imgPath: 'img/Unit/18.png', train_cost: { wood: 25, gold: 45 } },
  { id: 'arbalester', type: 'upgrade', age: 3, building: 'archery', row: 6, col: 0, prereqs: ['crossbow'], research_cost: { food: 300, gold: 700 }, research_time: 60, imgPath: 'img/Unit/90.png', train_cost: { wood: 25, gold: 45 } },
  { id: 'skirmisher', type: 'unit', age: 1, building: 'archery', row: 3, col: 1, prereqs: [], train_cost: { food: 35, wood: 25 }, imgPath: 'img/Unit/20.png' },
  { id: 'eliteskirm', type: 'upgrade', age: 2, building: 'archery', row: 4, col: 1, prereqs: ['skirmisher'], research_cost: { food: 240, gold: 60 }, research_time: 50, imgPath: 'img/Unit/21.png', train_cost: { food: 35, wood: 25 } },
  { id: 'handcannon', type: 'unit', age: 3, building: 'archery', row: 6, col: 1, prereqs: [], train_cost: { food: 45, gold: 50 }, imgPath: 'img/Unit/22.png' },
  { id: 'cavarcher', type: 'unit', age: 2, building: 'archery', row: 4, col: 2, prereqs: [], train_cost: { wood: 40, gold: 60 }, imgPath: 'img/Unit/19.png' },
  { id: 'hcavarcher', type: 'upgrade', age: 3, building: 'archery', row: 6, col: 2, prereqs: ['cavarcher'], research_cost: { food: 400, gold: 175 }, research_time: 50, imgPath: 'img/Unit/71.png', train_cost: { wood: 40, gold: 60 } },
  { id: 'thumbring', type: 'tech', age: 2, building: 'archery', row: 4, col: 4, prereqs: [], research_cost: { food: 300, wood: 250 }, research_time: 45, imgPath: 'img/Tech/112.png' },
  { id: 'parthian', type: 'tech', age: 3, building: 'archery', row: 6, col: 4, prereqs: [], research_cost: { food: 200, gold: 250 }, research_time: 65, imgPath: 'img/Tech/111.png' },

  // ── Archery Range special / unique ──────────────────────
  { id: 'imp_skirmisher', type: 'upgrade', age: 3, building: 'archery', row: 6, col: 1, special: true, variant: 'unique', prereqs: ['eliteskirm'], research_cost: { food: 300, gold: 450 }, research_time: 75, imgPath: 'img/Unit/229.png', train_cost: { food: 35, wood: 25 } },
  { id: 'elephant_archer', type: 'unit', age: 2, building: 'archery', row: 4, col: 3, special: true, variant: 'regional', prereqs: [], train_cost: { food: 100, gold: 70 }, imgPath: 'img/Unit/393.png' },
  { id: 'elite_elephant_archer', type: 'upgrade', age: 3, building: 'archery', row: 6, col: 3, special: true, variant: 'regional', prereqs: ['elephant_archer'], research_cost: { food: 1000, gold: 800 }, research_time: 75, imgPath: 'img/Unit/93.png', train_cost: { food: 100, gold: 70 } },
  { id: 'grenadier', type: 'unit', age: 2, building: 'archery', row: 4, col: 2, special: true, variant: 'unique', prereqs: [], train_cost: { food: 35, gold: 65 }, imgPath: 'img/Unit/462.png' },
  { id: 'xianbei_raider', type: 'unit', age: 2, building: 'archery', row: 4, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { wood: 60, gold: 25 }, imgPath: 'img/Unit/433.png' },
  { id: 'bolas_rider', type: 'unit', age: 2, building: 'archery', row: 4, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { wood: 45, gold: 50 }, imgPath: 'img/Unit/547.png' },
  { id: 'elite_bolas_rider', type: 'upgrade', age: 3, building: 'archery', row: 6, col: 3, special: true, variant: 'unique', prereqs: ['bolas_rider'], research_cost: { food: 500, gold: 450 }, research_time: 75, imgPath: 'img/Unit/548.png' },
  { id: 'slinger', type: 'unit', age: 2, building: 'archery', row: 4, col: 4, special: true, variant: 'regional', prereqs: [], train_cost: { food: 70, wood: 10 }, imgPath: 'img/Unit/143.png' },
  { id: 'genitour', type: 'unit', age: 2, building: 'archery', row: 4, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { food: 50, wood: 35 }, imgPath: 'img/Unit/201.png' },


  // ── STABLE ──────────────────────────────────────────────
  { id: 'scout', type: 'unit', age: 1, building: 'stable', row: 3, col: 0, prereqs: [], train_cost: { food: 80 }, imgPath: 'img/Unit/64.png' },
  { id: 'lightcav', type: 'upgrade', age: 2, building: 'stable', row: 4, col: 0, prereqs: ['scout'], research_cost: { food: 150, gold: 75 }, research_time: 45, imgPath: 'img/Unit/91.png', train_cost: { food: 80 } },
  { id: 'hussar', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 0, prereqs: ['lightcav'], research_cost: { food: 250, gold: 300 }, research_time: 50, imgPath: 'img/Unit/103.png', train_cost: { food: 80 } },
  { id: 'knight', type: 'unit', age: 2, building: 'stable', row: 4, col: 1, prereqs: [], train_cost: { food: 60, gold: 75 }, imgPath: 'img/Unit/1.png' },
  { id: 'cavalier', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 1, prereqs: ['knight'], research_cost: { food: 300, gold: 300 }, research_time: 100, imgPath: 'img/Unit/49.png', train_cost: { food: 60, gold: 75 } },
  { id: 'paladin', type: 'upgrade', age: 3, building: 'stable', row: 7, col: 1, prereqs: ['cavalier'], research_cost: { food: 750, gold: 550 }, research_time: 125, imgPath: 'img/Unit/2.png', train_cost: { food: 60, gold: 75 } },
  { id: 'camel', type: 'unit', age: 2, building: 'stable', row: 4, col: 2, special: true, variant: 'regional', prereqs: [], train_cost: { food: 55, gold: 60 }, imgPath: 'img/Unit/78.png' },
  { id: 'heavycamel', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 2, special: true, variant: 'regional', prereqs: ['camel'], research_cost: { food: 325, gold: 360 }, research_time: 125, imgPath: 'img/Unit/79.png', train_cost: { food: 55, gold: 60 } },
  { id: 'battleeleph', type: 'unit', age: 2, building: 'stable', row: 4, col: 3, special: true, variant: 'regional', prereqs: [], train_cost: { food: 100, gold: 70 }, imgPath: 'img/Unit/228.png' },
  { id: 'eliteeleph', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 3, special: true, variant: 'regional', prereqs: ['battleeleph'], research_cost: { food: 1100, gold: 700 }, research_time: 150, imgPath: 'img/Unit/246.png', train_cost: { food: 100, gold: 70 } },
  { id: 'bloodlines', type: 'tech', age: 2, building: 'stable', row: 3, col: 4, prereqs: [], research_cost: { food: 150, gold: 100 }, research_time: 40, imgPath: 'img/Tech/110.png' },
  { id: 'husbandry', type: 'tech', age: 3, building: 'stable', row: 4, col: 4, prereqs: [], research_cost: { food: 150 }, research_time: 40, imgPath: 'img/Tech/10.png' },

  // ── Stable special / unique ──────────────────────────────
  { id: 'winged_hussar', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 0, special: true, variant: 'regional', prereqs: ['lightcav'], research_cost: { food: 600, gold: 400 }, research_time: 75, imgPath: 'img/Unit/371.png', train_cost: { food: 80 } },
  { id: 'savar', type: 'upgrade', age: 3, building: 'stable', row: 7, col: 1, special: true, variant: 'unique', prereqs: ['cavalier'], research_cost: { food: 1000, gold: 600 }, research_time: 150, imgPath: 'img/Unit/410.png', train_cost: { food: 60, gold: 75 } },
  { id: 'camel_scout', type: 'unit', age: 1, building: 'stable', row: 3, col: 2, special: true, variant: 'regional', prereqs: [], train_cost: { food: 55, gold: 60 }, imgPath: 'img/Unit/392.png' },
  { id: 'imp_camel', type: 'upgrade', age: 3, building: 'stable', row: 7, col: 2, special: true, variant: 'regional', prereqs: ['heavycamel'], research_cost: { food: 1000, gold: 500 }, research_time: 125, imgPath: 'img/Unit/185.png', train_cost: { food: 55, gold: 60 } },
  { id: 'steppe_lancer', type: 'unit', age: 2, building: 'stable', row: 4, col: 3, special: true, variant: 'regional', prereqs: [], train_cost: { food: 70, gold: 40 }, imgPath: 'img/Unit/273.png' },
  { id: 'elite_steppe_lancer', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 3, special: true, variant: 'regional', prereqs: ['steppe_lancer'], research_cost: { food: 600, gold: 550 }, research_time: 75, imgPath: 'img/Unit/274.png', train_cost: { food: 70, gold: 40 } },
  { id: 'xolotl_warrior', type: 'unit', age: 2, building: 'stable', row: 4, col: 3, special: true, variant: 'regional', prereqs: [], train_cost: { food: 60, gold: 75 }, imgPath: 'img/Unit/232.png' },
  { id: 'shrivamsha', type: 'unit', age: 2, building: 'stable', row: 4, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { food: 70, gold: 30 }, imgPath: 'img/Unit/391.png' },
  { id: 'elite_shrivamsha', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 3, special: true, variant: 'unique', prereqs: ['shrivamsha'], research_cost: { food: 600, gold: 400 }, research_time: 75, imgPath: 'img/Unit/519.png', train_cost: { food: 70, gold: 30 } },
  { id: 'hei_guang', type: 'unit', age: 2, building: 'stable', row: 4, col: 2, special: true, variant: 'regional', prereqs: [], train_cost: { food: 65, gold: 65 }, imgPath: 'img/Unit/429.png' },
  { id: 'heavy_hei_guang', type: 'upgrade', age: 3, building: 'stable', row: 6, col: 2, special: true, variant: 'regional', prereqs: ['hei_guang'], research_cost: { food: 350, gold: 250 }, research_time: 60, imgPath: 'img/Unit/430.png', train_cost: { food: 65, gold: 65 } },
  { id: 'tarkan_s', type: 'unit', age: 2, building: 'stable', row: 4, col: 2, special: true, variant: 'unique', prereqs: [], train_cost: { food: 60, gold: 60 }, imgPath: 'img/Unit/105.png' },


  // ── SIEGE WORKSHOP ──────────────────────────────────────
  { id: 'batteringram', type: 'unit', age: 2, building: 'siege', row: 5, col: 0, prereqs: [], train_cost: { wood: 160, gold: 75 }, imgPath: 'img/Unit/74.png' },
  { id: 'cappedram', type: 'upgrade', age: 3, building: 'siege', row: 6, col: 0, prereqs: ['batteringram'], research_cost: { food: 300 }, imgPath: 'img/Unit/63.png', research_time: 50, train_cost: { wood: 160, gold: 75 } },
  { id: 'siegeram', type: 'upgrade', age: 3, building: 'siege', row: 7, col: 1, prereqs: ['cappedram'], research_cost: { food: 1000 }, imgPath: 'img/Unit/73.png', research_time: 75, train_cost: { wood: 160, gold: 75 } },
  { id: 'mangonel', type: 'unit', age: 2, building: 'siege', row: 5, col: 1, prereqs: [], train_cost: { wood: 160, gold: 135 }, imgPath: 'img/Unit/27.png' },
  { id: 'onager', type: 'upgrade', age: 3, building: 'siege', row: 6, col: 1, prereqs: ['mangonel'], research_cost: { food: 800, gold: 500 }, imgPath: 'img/Unit/101.png', research_time: 75, train_cost: { wood: 160, gold: 135 } },
  { id: 'siegeonager', type: 'upgrade', age: 3, building: 'siege', row: 7, col: 1, prereqs: ['onager'], research_cost: { food: 1450, gold: 1000 }, imgPath: 'img/Unit/102.png', research_time: 150, train_cost: { wood: 160, gold: 135 } },
  { id: 'scorpion', type: 'unit', age: 2, building: 'siege', row: 5, col: 2, prereqs: [], train_cost: { wood: 75, gold: 75 }, imgPath: 'img/Unit/80.png' },
  { id: 'heavyscorpion', type: 'upgrade', age: 3, building: 'siege', row: 6, col: 2, prereqs: ['scorpion'], research_cost: { food: 800, wood: 750 }, imgPath: 'img/Unit/89.png', research_time: 50, train_cost: { wood: 75, gold: 75 } },
  { id: 'bombcannon', type: 'unit', age: 3, building: 'siege', row: 6, col: 3, prereqs: [], train_cost: { wood: 225, gold: 225 }, imgPath: 'img/Unit/30.png' },
  { id: 'siegetower', type: 'unit', age: 2, building: 'siege', row: 5, col: 3, prereqs: [], train_cost: { wood: 200, gold: 160 }, imgPath: 'img/Unit/212.png' },

  // ── Siege special / unique ───────────────────────────────
  { id: 'houfnice', type: 'upgrade', age: 3, building: 'siege', row: 7, col: 3, special: true, variant: 'unique', prereqs: ['bombcannon'], research_cost: { food: 1100, gold: 800 }, imgPath: 'img/Unit/372.png', research_time: 140, train_cost: { wood: 225, gold: 225 } },
  { id: 'traction_treb', type: 'unit', age: 3, building: 'siege', row: 6, col: 3, special: true, variant: 'regional', prereqs: [], train_cost: { wood: 175, gold: 210 }, imgPath: 'img/Unit/428.png' },
  { id: 'mounted_treb', type: 'unit', age: 3, building: 'siege', row: 6, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { wood: 200, gold: 200 }, imgPath: 'img/Unit/464.png' },
  { id: 'rocket_cart', type: 'unit', age: 2, building: 'siege', row: 5, col: 1, special: true, variant: 'regional', prereqs: [], train_cost: { wood: 135, gold: 155 }, imgPath: 'img/Unit/459.png' },
  { id: 'heavy_rocket_cart', type: 'upgrade', age: 3, building: 'siege', row: 6, col: 1, special: true, variant: 'regional', prereqs: ['rocket_cart'], research_cost: { wood: 800, gold: 600 }, research_time: 60, imgPath: 'img/Unit/460.png', train_cost: { wood: 135, gold: 155 } },
  { id: 'flaming_camel', type: 'unit', age: 3, building: 'siege', row: 6, col: 3, special: true, variant: 'unique', prereqs: [], train_cost: { food: 75, gold: 30 }, imgPath: 'img/Unit/270.png' },
  { id: 'armored_elephant', type: 'unit', age: 2, building: 'siege', row: 5, col: 0, special: true, variant: 'regional', prereqs: [], train_cost: { food: 120, gold: 95 }, imgPath: 'img/Unit/394.png' },
  { id: 'siege_elephant', type: 'upgrade', age: 3, building: 'siege', row: 6, col: 0, special: true, variant: 'regional', prereqs: ['armored_elephant'], research_cost: { food: 650, gold: 0 }, research_time: 75, imgPath: 'img/Unit/395.png', train_cost: { food: 120, gold: 95 } },
  { id: 'war_chariot_s', type: 'unit', age: 2, building: 'siege', row: 5, col: 2, special: true, variant: 'unique', prereqs: [], train_cost: { food: 65, gold: 90 }, imgPath: 'img/Unit/435.png' },


  // ── BLACKSMITH ──────────────────────────────────────────
  { id: 'forging', type: 'tech', age: 1, building: 'blacksmith', row: 3, col: 0, prereqs: [], research_cost: { food: 150 }, research_time: 75, imgPath: 'img/Tech/17.png' },
  { id: 'ironcasting', type: 'tech', age: 2, building: 'blacksmith', row: 4, col: 0, prereqs: ['forging'], research_cost: { food: 220, gold: 120 }, research_time: 75, imgPath: 'img/Tech/18.png' },
  { id: 'blastfurnace', type: 'tech', age: 3, building: 'blacksmith', row: 6, col: 0, prereqs: ['ironcasting'], research_cost: { food: 275, gold: 225 }, research_time: 100, imgPath: 'img/Tech/21.png' },
  { id: 'scalemailarmor', type: 'tech', age: 1, building: 'blacksmith', row: 3, col: 1, prereqs: [], research_cost: { food: 100 }, research_time: 50, imgPath: 'img/Tech/63.png' },
  { id: 'chainmailarmor', type: 'tech', age: 2, building: 'blacksmith', row: 4, col: 1, prereqs: ['scalemailarmor'], research_cost: { food: 200, gold: 100 }, research_time: 75, imgPath: 'img/Tech/22.png' },
  { id: 'platemailarmor', type: 'tech', age: 3, building: 'blacksmith', row: 6, col: 1, prereqs: ['chainmailarmor'], research_cost: { food: 300, gold: 150 }, research_time: 100, imgPath: 'img/Tech/64.png' },
  { id: 'paddedarcharmor', type: 'tech', age: 1, building: 'blacksmith', row: 3, col: 2, prereqs: [], research_cost: { food: 100 }, research_time: 50, imgPath: 'img/Tech/49.png' },
  { id: 'leatherarcharmor', type: 'tech', age: 2, building: 'blacksmith', row: 4, col: 2, prereqs: ['paddedarcharmor'], research_cost: { food: 150, gold: 150 }, research_time: 75, imgPath: 'img/Tech/50.png' },
  { id: 'ringarcherarmor', type: 'tech', age: 3, building: 'blacksmith', row: 6, col: 2, prereqs: ['leatherarcharmor'], research_cost: { food: 250, gold: 250 }, research_time: 100, imgPath: 'img/Tech/51.png' },
  { id: 'scalebarding', type: 'tech', age: 1, building: 'blacksmith', row: 3, col: 3, prereqs: [], research_cost: { food: 150 }, research_time: 50, imgPath: 'img/Tech/66.png' },
  { id: 'chainbarding', type: 'tech', age: 2, building: 'blacksmith', row: 4, col: 3, prereqs: ['scalebarding'], research_cost: { food: 250, gold: 150 }, research_time: 75, imgPath: 'img/Tech/23.png' },
  { id: 'platebarding', type: 'tech', age: 3, building: 'blacksmith', row: 6, col: 3, prereqs: ['chainbarding'], research_cost: { food: 350, gold: 200 }, research_time: 100, imgPath: 'img/Tech/65.png' },
  { id: 'fletching', type: 'tech', age: 1, building: 'blacksmith', row: 3, col: 4, prereqs: [], research_cost: { food: 100, gold: 50 }, research_time: 30, imgPath: 'img/Tech/34.png' },
  { id: 'bodkinarrow', type: 'tech', age: 2, building: 'blacksmith', row: 4, col: 4, prereqs: ['fletching'], research_cost: { food: 200, gold: 100 }, research_time: 50, imgPath: 'img/Tech/35.png' },
  { id: 'bracer', type: 'tech', age: 3, building: 'blacksmith', row: 6, col: 4, prereqs: ['bodkinarrow'], research_cost: { food: 300, gold: 200 }, research_time: 75, imgPath: 'img/Tech/37.png' },


  // ── DOCK ────────────────────────────────────────────────

  { id: 'medium_warships', type: 'tech', age: 2, building: 'dock', row: 4, col: 5, prereqs: [], research_cost: { wood: 150, gold: 100 }, research_time: 50, imgPath: 'img/Tech/147.png' },
  { id: 'heavy_warships', type: 'tech', age: 3, building: 'dock', row: 6, col: 5, prereqs: ['medium_warships'], research_cost: { wood: 400, gold: 315 }, research_time: 60, imgPath: 'img/Tech/148.png' },
  { id: 'fishingship', type: 'unit', age: 0, building: 'dock', row: 1, col: 0, prereqs: [], train_cost: { wood: 75 }, imgPath: 'img/Unit/24.png' },
  { id: 'transportship', type: 'unit', age: 0, building: 'dock', row: 1, col: 1, prereqs: [], train_cost: { wood: 125, gold: 50 }, imgPath: 'img/Unit/95.png' },
  { id: 'tradecog', type: 'unit', age: 1, building: 'dock', row: 2, col: 5, prereqs: [], train_cost: { wood: 100, gold: 50 }, imgPath: 'img/Unit/23.png' },

  { id: 'galley', type: 'unit', age: 1, building: 'dock', row: 2, col: 2, prereqs: [], train_cost: { wood: 90, gold: 30 }, imgPath: 'img/Unit/87.png' },
  { id: 'wargalley', type: 'upgrade', age: 2, building: 'dock', row: 4, col: 2, prereqs: ['galley', 'medium_warships'], research_cost: { wood: 150, gold: 100 }, imgPath: 'img/Unit/25.png', research_time: 50, train_cost: { wood: 90, gold: 30 } },
  { id: 'galleon', type: 'upgrade', age: 3, building: 'dock', row: 6, col: 2, prereqs: ['wargalley'], research_cost: { food: 400, gold: 315 }, research_time: 60, imgPath: 'img/Unit/60.png', train_cost: { wood: 90, gold: 30 } },

  { id: 'firegalley', type: 'unit', age: 1, building: 'dock', row: 2, col: 1, prereqs: [], train_cost: { wood: 75, gold: 45 }, imgPath: 'img/Unit/203.png' },
  { id: 'fireship', type: 'upgrade', age: 2, building: 'dock', row: 4, col: 1, prereqs: ['firegalley'], research_cost: { food: 230, gold: 100 }, research_time: 50, imgPath: 'img/Unit/86.png', train_cost: { wood: 75, gold: 45 } },
  { id: 'fastfireship', type: 'upgrade', age: 3, building: 'dock', row: 6, col: 1, prereqs: ['fireship'], research_cost: { food: 280, gold: 250 }, research_time: 50, imgPath: 'img/Unit/85.png', train_cost: { wood: 75, gold: 45 } },

  { id: 'hulk', type: 'unit', age: 1, building: 'dock', row: 2, col: 3, prereqs: [], train_cost: { wood: 75, gold: 35 }, imgPath: 'img/Unit/566.png' },
  { id: 'war_hulk', type: 'upgrade', age: 2, building: 'dock', row: 4, col: 3, prereqs: ['hulk', 'medium_warships'], research_cost: { wood: 150, gold: 100 }, imgPath: 'img/Unit/565.png', research_time: 50, train_cost: { wood: 75, gold: 35 } },
  { id: 'carrack', type: 'upgrade', age: 3, building: 'dock', row: 6, col: 3, prereqs: ['war_hulk'], research_cost: { food: 400, gold: 300 }, research_time: 60, imgPath: 'img/Unit/567.png', train_cost: { wood: 75, gold: 35 } },

  { id: 'demoraft', type: 'unit', age: 1, building: 'dock', row: 2, col: 4, prereqs: [], train_cost: { wood: 70, gold: 50 }, imgPath: 'img/Unit/202.png' },
  { id: 'demoship', type: 'upgrade', age: 2, building: 'dock', row: 4, col: 4, prereqs: ['demoraft'], research_cost: { food: 230, gold: 100 }, research_time: 50, imgPath: 'img/Unit/84.png', train_cost: { wood: 70, gold: 50 } },
  { id: 'heavydemo', type: 'upgrade', age: 3, building: 'dock', row: 6, col: 4, prereqs: ['demoship'], research_cost: { food: 200, gold: 200 }, research_time: 50, imgPath: 'img/Unit/83.png', train_cost: { wood: 70, gold: 50 } },

  { id: 'cannongalleon', type: 'unit', age: 3, building: 'dock', row: 6, col: 6, prereqs: [], train_cost: { wood: 200, gold: 150 }, imgPath: 'img/Unit/55.png' },
  { id: 'elitecannon', type: 'upgrade', age: 3, building: 'dock', row: 7, col: 6, prereqs: ['cannongalleon'], research_cost: { food: 525, gold: 500 }, research_time: 75, imgPath: 'img/Unit/298.png', train_cost: { wood: 200, gold: 150 } },


  { id: 'fishing_lines', type: 'tech', age: 1, building: 'dock', row: 3, col: 0, prereqs: [], research_cost: { food: 50, wood: 100 }, research_time: 30, imgPath: 'img/Tech/140.png' },
  { id: 'gillnets', type: 'tech', age: 2, building: 'dock', row: 4, col: 0, prereqs: ['fishing_lines'], research_cost: { food: 150, wood: 200 }, research_time: 40, imgPath: 'img/Tech/41.png' },

  // ── Dock special / unique ────────────────────────────────
  { id: 'dragon_ship', type: 'unit', age: 3, building: 'dock', row: 6, col: 1, special: true, variant: 'unique', prereqs: ['fireship'], train_cost: { wood: 75, gold: 45 }, imgPath: 'img/Unit/178.png' },
  { id: 'dromon', type: 'unit', age: 3, building: 'dock', row: 7, col: 1, special: true, variant: 'regional', prereqs: [], train_cost: { wood: 175, gold: 150 }, imgPath: 'img/Unit/406.png' },
  { id: 'lou_chuan', type: 'unit', age: 3, building: 'dock', row: 7, col: 1, special: true, variant: 'regional', prereqs: [], train_cost: { wood: 250, gold: 225 }, imgPath: 'img/Unit/431.png' },
  { id: 'catapult_gall', type: 'unit', age: 3, building: 'dock', row: 7, col: 1, special: true, variant: 'regional', prereqs: [], train_cost: { wood: 200, gold: 150 }, imgPath: 'img/Unit/591.png' },
  { id: 'turtle_ship', type: 'unit', age: 2, building: 'dock', row: 4, col: 6, special: true, variant: 'unique', prereqs: [], train_cost: { wood: 180, gold: 180 }, imgPath: 'img/Unit/116.png' },
  { id: 'longboat', type: 'unit', age: 2, building: 'dock', row: 4, col: 6, special: true, variant: 'unique', prereqs: [], train_cost: { wood: 75, gold: 40 }, imgPath: 'img/Unit/40.png' },
  { id: 'caravel_d', type: 'unit', age: 2, building: 'dock', row: 4, col: 6, special: true, variant: 'unique', prereqs: [], train_cost: { wood: 90, gold: 40 }, imgPath: 'img/Unit/198.png' },
  { id: 'thirisadai', type: 'unit', age: 3, building: 'dock', row: 7, col: 1, special: true, variant: 'unique', prereqs: [], train_cost: { wood: 300, gold: 250 }, imgPath: 'img/Unit/387.png' },


  // ── UNIVERSITY ──────────────────────────────────────────────
  { id: 'masonry', type: 'tech', age: 2, building: 'university', row: 5, col: 0, prereqs: [], research_cost: { food: 150, wood: 175 }, research_time: 75, imgPath: 'img/Tech/13.png' },
  { id: 'architecture', type: 'tech', age: 3, building: 'university', row: 6, col: 0, prereqs: ['masonry'], research_cost: { food: 300, wood: 200 }, research_time: 100, imgPath: 'img/Tech/14.png' },
  { id: 'ballistics', type: 'tech', age: 2, building: 'university', row: 5, col: 1, prereqs: [], research_cost: { wood: 300, gold: 175 }, research_time: 60, imgPath: 'img/Tech/25.png' },
  { id: 'chemistry', type: 'tech', age: 3, building: 'university', row: 6, col: 1, prereqs: ['ballistics'], research_cost: { food: 300, gold: 200 }, research_time: 75, imgPath: 'img/Tech/12.png' },
  { id: 'murderhole', type: 'tech', age: 2, building: 'university', row: 5, col: 2, prereqs: [], research_cost: { food: 200, stone: 100 }, research_time: 60, imgPath: 'img/Tech/61.png' },
  { id: 'siegeengineers', type: 'tech', age: 3, building: 'university', row: 6, col: 2, prereqs: ['murderhole'], research_cost: { food: 500, wood: 600 }, research_time: 75, imgPath: 'img/Tech/101.png' },
  { id: 'treadmillcrane', type: 'tech', age: 2, building: 'university', row: 5, col: 3, prereqs: [], research_cost: { wood: 200, stone: 50 }, research_time: 60, imgPath: 'img/Tech/60.png' },
  { id: 'heatedshot', type: 'tech', age: 2, building: 'university', row: 5, col: 4, prereqs: [], research_cost: { food: 350, gold: 100 }, research_time: 40, imgPath: 'img/Tech/104.png' },
  { id: 'careening', type: 'tech', age: 2, building: 'university', row: 5, col: 5, prereqs: [], research_cost: { food: 100, gold: 200 }, research_time: 60, imgPath: 'img/Tech/98.png' },
  { id: 'drydock', type: 'tech', age: 3, building: 'university', row: 6, col: 5, prereqs: ['careening'], research_cost: { food: 200, gold: 400 }, research_time: 60, imgPath: 'img/Tech/99.png' },
  { id: 'clinker_construction', type: 'tech', age: 2, building: 'university', row: 5, col: 6, prereqs: [], research_cost: { food: 150, wood: 100 }, research_time: 50, imgPath: 'img/Tech/142.png' },
  { id: 'carvel_hull', type: 'tech', age: 3, building: 'university', row: 6, col: 6, prereqs: ['clinker_construction'], research_cost: { food: 150, wood: 100 }, research_time: 50, imgPath: 'img/Tech/141.png' },
  { id: 'siphons', type: 'tech', age: 2, building: 'university', row: 5, col: 7, prereqs: [], research_cost: { food: 100, gold: 175 }, research_time: 45, imgPath: 'img/Tech/40.png' },
  { id: 'incendiaries', type: 'tech', age: 3, building: 'university', row: 6, col: 7, prereqs: ['siphons'], research_cost: { food: 100, gold: 175 }, research_time: 50, imgPath: 'img/Tech/143.png' },
  { id: 'arrowslits', type: 'tech', age: 3, building: 'university', row: 6, col: 4, prereqs: [], research_cost: { food: 250, wood: 250 }, research_time: 50, imgPath: 'img/Tech/119.png' },
  { id: 'shipwright', type: 'tech', age: 3, building: 'university', row: 6, col: 8, prereqs: [], research_cost: { food: 1000, gold: 300 }, research_time: 60, imgPath: 'img/Tech/97.png' },


  // ── MONASTERY ───────────────────────────────────────────
  { id: 'monk', type: 'unit', age: 2, building: 'monastery', row: 5, col: 0, prereqs: [], train_cost: { gold: 100 }, imgPath: 'img/Unit/33.png' },
  { id: 'redemption', type: 'tech', age: 2, building: 'monastery', row: 5, col: 1, prereqs: [], research_cost: { gold: 475 }, research_time: 50, imgPath: 'img/Tech/92.png' },
  { id: 'atonement', type: 'tech', age: 2, building: 'monastery', row: 5, col: 2, prereqs: [], research_cost: { gold: 325 }, research_time: 50, imgPath: 'img/Tech/93.png' },
  { id: 'heresy', type: 'tech', age: 2, building: 'monastery', row: 5, col: 3, prereqs: [], research_cost: { gold: 1000 }, research_time: 50, imgPath: 'img/Tech/108.png' },
  { id: 'sanctity', type: 'tech', age: 2, building: 'monastery', row: 5, col: 4, prereqs: [], research_cost: { gold: 175 }, research_time: 50, imgPath: 'img/Tech/83.png' },
  { id: 'fervor', type: 'tech', age: 2, building: 'monastery', row: 5, col: 5, prereqs: [], research_cost: { gold: 140 }, research_time: 50, imgPath: 'img/Tech/73.png' },
  { id: 'herbalmedicine', type: 'tech', age: 2, building: 'monastery', row: 5, col: 6, prereqs: [], research_cost: { gold: 200 }, research_time: 60, imgPath: 'img/Tech/114.png' },
  { id: 'devotion', type: 'tech', age: 2, building: 'monastery', row: 5, col: 7, prereqs: [], research_cost: { food: 100, gold: 200 }, research_time: 40, imgPath: 'img/Tech/46.png' },
  { id: 'illumination', type: 'tech', age: 3, building: 'monastery', row: 6, col: 1, prereqs: ['redemption'], research_cost: { gold: 120 }, research_time: 40, imgPath: 'img/Tech/84.png' },
  { id: 'blockprinting', type: 'tech', age: 3, building: 'monastery', row: 6, col: 2, prereqs: ['atonement'], research_cost: { gold: 200 }, research_time: 55, imgPath: 'img/Tech/82.png' },
  { id: 'theocracy', type: 'tech', age: 3, building: 'monastery', row: 6, col: 4, prereqs: ['sanctity'], research_cost: { gold: 200 }, research_time: 60, imgPath: 'img/Tech/109.png' },
  { id: 'faith', type: 'tech', age: 3, building: 'monastery', row: 6, col: 5, prereqs: ['fervor'], research_cost: { food: 550, gold: 750 }, research_time: 60, imgPath: 'img/Tech/11.png' },

  // ── Monastery special / unique ───────────────────────────
  { id: 'warrior_priest', type: 'unit', age: 2, building: 'monastery', row: 5, col: 7, special: true, variant: 'unique', prereqs: [], train_cost: { food: 40, gold: 50 }, imgPath: 'img/Unit/409.png' },
  { id: 'missionary', type: 'unit', age: 2, building: 'monastery', row: 5, col: 7, special: true, variant: 'unique', prereqs: [], train_cost: { gold: 100 }, imgPath: 'img/Unit/107.png' },


  // ── CASTLE ──────────────────────────────────────────────
  { id: 'trebuchet', type: 'unit', age: 3, building: 'castle', row: 6, col: 3, prereqs: [], train_cost: { wood: 200, gold: 200 }, imgPath: 'img/Unit/29.png' },
  { id: 'petard', type: 'unit', age: 2, building: 'castle', row: 5, col: 3, prereqs: [], train_cost: { food: 65, gold: 35 }, imgPath: 'img/Unit/113.png' },
  { id: 'uniqueunit', type: 'unique', age: 2, building: 'castle', row: 5, col: 2, prereqs: [], train_cost: { food: 0, gold: 0 }, imgPath: 'img/Unit/45.png' },
  { id: 'eliteunique', type: 'unique', age: 3, building: 'castle', row: 6, col: 2, prereqs: ['uniqueunit'], research_cost: { food: 0, gold: 0 }, train_cost: { food: 0, gold: 0 }, imgPath: 'img/Unit/46.png' },
  { id: 'uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 0, gold: 0 }, imgPath: 'img/Tech/33.png'},
  { id: 'uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 0, gold: 0 }, imgPath: 'img/Tech/107.png'},

  // ── Unique Techs by Civilization (Update 169123 costs from halfon) ────────
  // Castle Age (uniquetech1) — 53 civilizations
  { id: 'armenians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 350, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Cilician Fleet
  { id: 'aztecs_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Atlatl
  { id: 'bengalis_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Paiks
  { id: 'berbers_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 400, stone: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Kasbah
  { id: 'bohemians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 350, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Wagenburg Tactics
  { id: 'britons_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Yeomen
  { id: 'bulgarians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 200, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Stirrups
  { id: 'burgundians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Burgundian Vineyards
  { id: 'burmese_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Manipur Cavalry
  { id: 'byzantines_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 250, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Greek Fire
  { id: 'celts_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 250, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Stronghold
  { id: 'chinese_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 400, stone: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Great Wall
  { id: 'cumans_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 200, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Steppe Husbandry
  { id: 'dravidians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 250, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Medical Corps
  { id: 'ethiopians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 250, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Royal Heirs
  { id: 'franks_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Bearded Axe
  { id: 'georgians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 350, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Svan Towers
  { id: 'goths_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 450, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Anarchy
  { id: 'gurjaras_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Kshatriyas
  { id: 'hindustanis_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Grand Trunk Road
  { id: 'huns_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 250, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Marauders
  { id: 'incas_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Andean Sling
  { id: 'italians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 350, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Silk Road
  { id: 'japanese_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 350, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Yasama
  { id: 'jurchens_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 400, stone: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Fortified Bastions
  { id: 'khitans_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Lamellar Armor
  { id: 'khmer_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Tusk Swords
  { id: 'koreans_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 400, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Eupseong
  { id: 'lithuanians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 200, gold: 150 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Hill Forts
  { id: 'magyars_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Corvinian Army
  { id: 'malay_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 350, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Thalassocracy
  { id: 'malians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 250, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Tigui
  { id: 'mapuche_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Malon
  { id: 'mayans_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 350, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Hul'che Javelineers
  { id: 'mongols_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Nomads
  { id: 'muisca_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Herbalism
  { id: 'persians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 350, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Kamandaran
  { id: 'poles_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Szlachta Privileges
  { id: 'portuguese_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 250, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Circumnavigation
  { id: 'romans_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Ballistas
  { id: 'saracens_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 300, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Bimaristan
  { id: 'shu_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Coiled Serpent Array
  { id: 'sicilians_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // First Crusade
  { id: 'slavs_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 400, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Detinets
  { id: 'spanish_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Inquisition
  { id: 'tatars_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { wood: 350, stone: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Silk Armor
  { id: 'teutons_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 300 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Ironclad
  { id: 'tupi_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Caciques
  { id: 'turks_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 350, gold: 150 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Sipahi
  { id: 'vietnamese_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 350 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Chatras
  { id: 'vikings_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 600, gold: 450 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Chieftains
  { id: 'wei_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 300, gold: 200 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Tuntian
  { id: 'wu_uniquetech1', type: 'unique', age: 2, building: 'castle', row: 5, col: 5, prereqs: [], research_cost: { food: 400, gold: 250 }, research_time: 40, imgPath: 'img/Tech/33.png' }, // Red Cliffs Tactics

  // Imperial Age (uniquetech2) — 53 civilizations
  { id: 'armenians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 800, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Fereters
  { id: 'aztecs_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 450, gold: 750 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Garland Wars
  { id: 'bengalis_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 800, gold: 700 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Mahayana
  { id: 'berbers_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Maghrebi Camels
  { id: 'bohemians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Hussite Reforms
  { id: 'britons_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 800, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Warwolf
  { id: 'bulgarians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 550, gold: 450 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Bagains
  { id: 'burgundians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Flemish Revolution
  { id: 'burmese_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Howdah
  { id: 'byzantines_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 800, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Logistica
  { id: 'celts_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 750, gold: 450 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Furor Celtica
  { id: 'chinese_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 1100, gold: 900 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Rocketry
  { id: 'cumans_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Cuman Mercenaries
  { id: 'dravidians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 550 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Wootz Steel
  { id: 'ethiopians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Torsion Engines
  { id: 'franks_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Chivalry
  { id: 'georgians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 750, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Aznauri Cavalry
  { id: 'goths_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 400, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Perfusion
  { id: 'gurjaras_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 650, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Frontier Guards
  { id: 'hindustanis_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Shatagni
  { id: 'huns_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 300, food: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Atheism
  { id: 'incas_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 550, gold: 450 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Fabric Shields
  { id: 'italians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 550 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Pirotechnia
  { id: 'japanese_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 550, gold: 300 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Kataparuto
  { id: 'jurchens_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Thunderclap Bombs
  { id: 'khitans_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 800, gold: 700 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Ordo Cavalry
  { id: 'khmer_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 750, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Double Crossbow
  { id: 'koreans_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 700, gold: 400 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Shinkichon
  { id: 'lithuanians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 400, gold: 300 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Tower Shields
  { id: 'magyars_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 750, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Recurve Bow
  { id: 'malay_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Forced Levy
  { id: 'malians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Farimba
  { id: 'mapuche_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 500, gold: 450 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Butalmapu
  { id: 'mayans_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 850, gold: 700 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Holcans
  { id: 'mongols_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 500, gold: 450 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Drill
  { id: 'muisca_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 450, gold: 350 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Huaracas
  { id: 'persians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 600, gold: 300 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Citadels
  { id: 'poles_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 750, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Lechitic Legacy
  { id: 'portuguese_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Arquebus
  { id: 'romans_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 800, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Comitatenses
  { id: 'saracens_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 650, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Counterweights
  { id: 'shu_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 850, gold: 700 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Bolt Magazine
  { id: 'sicilians_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 750, gold: 550 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Hauberk
  { id: 'slavs_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Druzhina
  { id: 'spanish_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 400, gold: 250 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Supremacy
  { id: 'tatars_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { wood: 600, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Timurid Siegecraft
  { id: 'teutons_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, stone: 400 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Crenellations
  { id: 'tupi_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 650, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Curare
  { id: 'turks_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 600, gold: 650 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Artillery
  { id: 'vietnamese_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 750, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Paper Money
  { id: 'vikings_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 650, gold: 500 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Bogsveigar
  { id: 'wei_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 700, gold: 600 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Ming Guang Armor
  { id: 'wu_uniquetech2', type: 'unique', age: 3, building: 'castle', row: 6, col: 5, prereqs: [], research_cost: { food: 800, gold: 700 }, research_time: 60, imgPath: 'img/Tech/107.png' }, // Sitting Tiger

  { id: 'hoardings', type: 'tech', age: 3, building: 'castle', row: 6, col: 6, prereqs: [], research_cost: { food: 400, wood: 400 }, research_time: 75, imgPath: 'img/Tech/103.png' },
  { id: 'conscription', type: 'tech', age: 3, building: 'castle', row: 6, col: 7, prereqs: [], research_cost: { food: 150, gold: 150 }, research_time: 60, imgPath: 'img/Tech/91.png' },
  { id: 'sappers', type: 'tech', age: 3, building: 'castle', row: 7, col: 6, prereqs: [], research_cost: { food: 400, wood: 200 }, research_time: 75, imgPath: 'img/Tech/5.png' },
  { id: 'spy', type: 'tech', age: 3, building: 'castle', row: 7, col: 7, prereqs: [], research_cost: { gold: 200 }, research_time: 40, imgPath: 'img/Tech/76.png' },

  // ── Castle special / unique ──────────────────────────────
  { id: 'kipchak_c', type: 'unit', age: 3, building: 'castle', row: 6, col: 6, special: true, variant: 'unique', prereqs: [], train_cost: { food: 40, gold: 35 }, imgPath: 'img/Unit/252.png' },
  { id: 'krepost', type: 'unit', age: 2, building: 'castle', row: 4, col: 7, special: true, variant: 'unique', prereqs: [], build_cost: { stone: 350 }, build_time: 150, stats: { hp: 2600, armor: [8, 11], los: 10 }, imgPath: 'img/Building/96.png' },
  { id: 'donjon', type: 'unit', age: 1, building: 'barracks', row: 2, col: 5, special: true, variant: 'unique', prereqs: [], build_cost: { wood: 50, stone: 175 }, build_time: 83, stats: { hp: 625, armor: [0, 6], los: 10 }, imgPath: 'img/Building/101.png' },


  // ── MARKET ──────────────────────────────────────────────
  { id: 'tradecart', type: 'unit', age: 1, building: 'market', row: 3, col: 0, prereqs: [], train_cost: { wood: 100, gold: 50 }, imgPath: 'img/Unit/34.png' },
  { id: 'caravan', type: 'tech', age: 2, building: 'market', row: 5, col: 0, prereqs: [], research_cost: { food: 200, gold: 200 }, research_time: 60, imgPath: 'img/Tech/47.png' },
  { id: 'coinage', type: 'tech', age: 2, building: 'market', row: 4, col: 0, prereqs: [], research_cost: { food: 200, gold: 100 }, research_time: 60, imgPath: 'img/Tech/7.png' },
  { id: 'banking', type: 'tech', age: 3, building: 'market', row: 6, col: 0, prereqs: ['coinage'], research_cost: { food: 300, gold: 200 }, research_time: 75, imgPath: 'img/Tech/3.png' },
  { id: 'guilds', type: 'tech', age: 3, building: 'market', row: 7, col: 0, prereqs: [], research_cost: { food: 300, gold: 200 }, research_time: 60, imgPath: 'img/Tech/58.png' },
  { id: 'feitoria', type: 'unit', age: 3, building: 'market', row: 6, col: 3, special: true, variant: 'unique', prereqs: [], build_cost: { stone: 300, gold: 350 }, build_time: 120, stats: { hp: 2700, armor: [3, 10] }, imgPath: 'img/Building/84.png' },
  { id: 'caravanserai', type: 'unit', age: 3, building: 'market', row: 6, col: 4, special: true, variant: 'regional', prereqs: [], build_cost: { wood: 175, stone: 50 }, build_time: 60, stats: { hp: 2700, armor: [3, 10] }, imgPath: 'img/Building/103.png' },

  { id: 'villager', type: 'unit', age: 0, building: 'tc', row: 1, col: 0, prereqs: [], train_cost: { food: 50 }, imgPath: 'img/Unit/15.png' },
  { id: 'loom', type: 'tech', age: 0, building: 'tc', row: 1, col: 2, prereqs: [], research_cost: { gold: 50 }, research_time: 25, imgPath: 'img/Tech/6.png' },
  { id: 'wheelbarrow', type: 'tech', age: 1, building: 'tc', row: 2, col: 0, prereqs: [], research_cost: { food: 175, wood: 50 }, research_time: 75, imgPath: 'img/Tech/79.png' },
  { id: 'townwatch', type: 'tech', age: 1, building: 'tc', row: 2, col: 2, prereqs: [], research_cost: { food: 75 }, research_time: 25, imgPath: 'img/Tech/69.png' },
  { id: 'handcart', type: 'tech', age: 2, building: 'tc', row: 4, col: 0, prereqs: ['wheelbarrow'], research_cost: { food: 300, wood: 200 }, research_time: 75, imgPath: 'img/Tech/42.png' },
  { id: 'townpatrol', type: 'tech', age: 2, building: 'tc', row: 4, col: 2, prereqs: ['townwatch'], research_cost: { food: 300, gold: 100 }, research_time: 40, imgPath: 'img/Tech/89.png' },



  // ── Age Advancement Techs ────────────────────────────────
  { id: 'feudalage', type: 'tech', age: 0, building: 'tc', row: 1, col: 1, prereqs: [], research_cost: { food: 500 }, research_time: 130, imgPath: 'img/Tech/30.png' },
  { id: 'castleage', type: 'tech', age: 1, building: 'tc', row: 2, col: 1, prereqs: ['feudalage'], research_cost: { food: 800, gold: 200 }, research_time: 160, imgPath: 'img/Tech/31.png' },
  { id: 'imperialage', type: 'tech', age: 2, building: 'tc', row: 4, col: 1, prereqs: ['castleage'], research_cost: { food: 1000, gold: 800 }, research_time: 190, imgPath: 'img/Tech/32.png' },


  // ── MILL ────────────────────────────────────────────────
  { id: 'horsecollar', type: 'tech', age: 1, building: 'mill', row: 2, col: 0, prereqs: [], research_cost: { food: 75, wood: 75 }, research_time: 25, imgPath: 'img/Tech/2.png' },
  { id: 'heavyplow', type: 'tech', age: 2, building: 'mill', row: 4, col: 0, prereqs: ['horsecollar'], research_cost: { food: 125, wood: 125 }, research_time: 40, imgPath: 'img/Tech/1.png' },
  { id: 'croprotation', type: 'tech', age: 3, building: 'mill', row: 6, col: 0, prereqs: ['heavyplow'], research_cost: { food: 250, wood: 250 }, research_time: 70, imgPath: 'img/Tech/0.png' },

  { id: 'domestication', type: 'tech', age: 1, building: 'mill', row: 2, col: 1, special: true, variant: 'regional', prereqs: [], research_cost: { food: 50, wood: 100 }, research_time: 25, imgPath: 'img/Tech/160.png' },
  { id: 'pastoralism',   type: 'tech', age: 2, building: 'mill', row: 4, col: 1, special: true, variant: 'regional', prereqs: ['domestication'], research_cost: { food: 100, wood: 150 }, research_time: 40, imgPath: 'img/Tech/161.png' },
  { id: 'transhumance',  type: 'tech', age: 3, building: 'mill', row: 6, col: 1, special: true, variant: 'regional', prereqs: ['pastoralism'], research_cost: { food: 175, wood: 325 }, research_time: 70, imgPath: 'img/Tech/162.png' },

  // ── LUMBER CAMP ─────────────────────────────────────────
  { id: 'doublebitaxe', type: 'tech', age: 1, building: 'lumber', row: 2, col: 0, prereqs: [], research_cost: { food: 100, wood: 50 }, research_time: 25, imgPath: 'img/Tech/70.png' },
  { id: 'bowsaw', type: 'tech', age: 2, building: 'lumber', row: 4, col: 0, prereqs: ['doublebitaxe'], research_cost: { food: 150, wood: 100 }, research_time: 50, imgPath: 'img/Tech/71.png' },
  { id: 'twomansaw', type: 'tech', age: 3, building: 'lumber', row: 6, col: 0, prereqs: ['bowsaw'], research_cost: { food: 300, wood: 200 }, research_time: 100, imgPath: 'img/Tech/81.png' },

  // ── MINING CAMP ─────────────────────────────────────────
  { id: 'goldmining', type: 'tech', age: 1, building: 'mining', row: 2, col: 0, prereqs: [], research_cost: { food: 100, wood: 75 }, research_time: 30, imgPath: 'img/Tech/15.png' },
  { id: 'goldshaft', type: 'tech', age: 2, building: 'mining', row: 4, col: 0, prereqs: ['goldmining'], research_cost: { food: 175, wood: 75 }, research_time: 75, imgPath: 'img/Tech/62.png' },
  { id: 'stonemining', type: 'tech', age: 1, building: 'mining', row: 2, col: 1, prereqs: [], research_cost: { food: 100, wood: 75 }, research_time: 30, imgPath: 'img/Tech/87.png' },
  { id: 'stoneshaft', type: 'tech', age: 2, building: 'mining', row: 4, col: 1, prereqs: ['stonemining'], research_cost: { food: 175, wood: 75 }, research_time: 75, imgPath: 'img/Tech/88.png' },

  // ── TAHSILI (Asentamiento) ────────────────────────────────
  { id: 'horsecollar_t',  type: 'tech', age: 1, building: 'tahsili', row: 2, col: 3, variant: 'regional', prereqs: [], research_cost: { food: 75, wood: 75 }, imgPath: 'img/Tech/2.png' },
  { id: 'heavyplow_t',    type: 'tech', age: 2, building: 'tahsili', row: 4, col: 3,  variant: 'regional',prereqs: ['horsecollar_t'], research_cost: { food: 125, wood: 125 }, imgPath: 'img/Tech/1.png' },
  { id: 'croprotation_t', type: 'tech', age: 3, building: 'tahsili', row: 6, col: 3,  variant: 'regional',prereqs: ['heavyplow_t'], research_cost: { food: 250, wood: 250 }, imgPath: 'img/Tech/0.png' },
  { id: 'doublebitaxe_t', type: 'tech', age: 1, building: 'tahsili', row: 2, col: 0, variant: 'regional', prereqs: [], research_cost: { food: 100, wood: 50 }, imgPath: 'img/Tech/70.png' },
  { id: 'bowsaw_t',       type: 'tech', age: 2, building: 'tahsili', row: 4, col: 0, variant: 'regional', prereqs: ['doublebitaxe_t'], research_cost: { food: 150, wood: 100 }, imgPath: 'img/Tech/71.png' },
  { id: 'twomansaw_t',   type: 'tech', age: 3, building: 'tahsili', row: 6, col: 0, variant: 'regional', prereqs: ['bowsaw_t'], research_cost: { food: 300, wood: 200 }, imgPath: 'img/Tech/81.png' },
  { id: 'goldmining_t',  type: 'tech', age: 1, building: 'tahsili', row: 2, col: 1,  variant: 'regional',prereqs: [], research_cost: { food: 100, wood: 75 }, imgPath: 'img/Tech/15.png' },
  { id: 'goldshaft_t',   type: 'tech', age: 2, building: 'tahsili', row: 4, col: 1,  variant: 'regional',prereqs: ['goldmining_t'], research_cost: { food: 200, wood: 100 }, imgPath: 'img/Tech/62.png' },
  { id: 'stonemining_t', type: 'tech', age: 1, building: 'tahsili', row: 2, col: 2,  variant: 'regional',prereqs: [], research_cost: { food: 100, wood: 75 }, imgPath: 'img/Tech/87.png' },
  { id: 'stoneshaft_t',  type: 'tech', age: 2, building: 'tahsili', row: 4, col: 2,  variant: 'regional',prereqs: ['stonemining_t'], research_cost: { food: 200, wood: 100 }, imgPath: 'img/Tech/88.png' },

  // ── MULECART (Mula de Carga) ──────────────────────────────
  { id: 'doublebitaxe_m', type: 'tech', age: 1, building: 'mulecart', row: 2, col: 0, variant: 'regional', prereqs: [], research_cost: { food: 100, wood: 50 }, imgPath: 'img/Tech/70.png' },
  { id: 'bowsaw_m',       type: 'tech', age: 2, building: 'mulecart', row: 4, col: 0, variant: 'regional', prereqs: ['doublebitaxe_m'], research_cost: { food: 150, wood: 100 }, imgPath: 'img/Tech/71.png' },
  { id: 'twomansaw_m',   type: 'tech', age: 3, building: 'mulecart', row: 6, col: 0, variant: 'regional', prereqs: ['bowsaw_m'], research_cost: { food: 300, wood: 200 }, imgPath: 'img/Tech/81.png' },
  { id: 'goldmining_m',  type: 'tech', age: 1, building: 'mulecart', row: 2, col: 1, variant: 'regional', prereqs: [], research_cost: { food: 100, wood: 75 }, imgPath: 'img/Tech/15.png' },
  { id: 'goldshaft_m',   type: 'tech', age: 2, building: 'mulecart', row: 4, col: 1, variant: 'regional', prereqs: ['goldmining_m'], research_cost: { food: 200, wood: 100 }, imgPath: 'img/Tech/62.png' },
  { id: 'stonemining_m', type: 'tech', age: 1, building: 'mulecart', row: 2, col: 2, variant: 'regional', prereqs: [], research_cost: { food: 100, wood: 75 }, imgPath: 'img/Tech/87.png' },
  { id: 'stoneshaft_m',  type: 'tech', age: 2, building: 'mulecart', row: 4, col: 2,  variant: 'regional',prereqs: ['stonemining_m'], research_cost: { food: 200, wood: 100 }, imgPath: 'img/Tech/88.png' },

  // ══════════════════════════════════════════════════════════
  // BUILDINGS (unified — formerly buildings.js)
  // ══════════════════════════════════════════════════════════
  // ── Militares ─────────────────────────────────────────────
  { type: 'building', id: 'archery',    name: 'Galería de Tiro',   icon: '🏹', age: 1, row: 2, prereqs: ['barracks'], build_cost: { wood: 175 }, build_time: 50, stats: { hp: 1500, armor: [1, 8] }, imgPath: 'img/Building/0.png' },
  { type: 'building', id: 'barracks',   name: 'Cuartel',           icon: '⚔️', age: 0, row: 0, prereqs: [],           build_cost: { wood: 175 }, build_time: 50, stats: { hp: 1200, armor: [0, 7] }, imgPath: 'img/Building/2.png' },
  { type: 'building', id: 'stable',     name: 'Establo',           icon: '🐴', age: 1, row: 2, prereqs: ['barracks'], build_cost: { wood: 175 }, build_time: 50, stats: { hp: 1500, armor: [1, 8] }, imgPath: 'img/Building/23.png' },
  { type: 'building', id: 'blacksmith', name: 'Herrería',          icon: '🔨', age: 1, row: 2, prereqs: [],           build_cost: { wood: 150 }, build_time: 40, stats: { hp: 1800, armor: [1, 8] }, imgPath: 'img/Building/4.png' },
  { type: 'building', id: 'siege',      name: 'Taller de Asedio',  icon: '⚒️', age: 2, row: 4, prereqs: ['blacksmith'], build_cost: { wood: 200 }, build_time: 40, stats: { hp: 1800, armor: [2, 9] }, imgPath: 'img/Building/22.png' },
  { type: 'building', id: 'dock',       name: 'Muelle',            icon: '⚓', age: 0, row: 0, prereqs: [],           build_cost: { wood: 150 }, build_time: 35, stats: { hp: 1800, armor: [0, 7] }, imgPath: 'img/Building/13.png' },
  { type: 'building', id: 'harbor',     name: 'Puerto',            icon: '⚓', age: 2, row: 0, prereqs: [],           build_cost: { wood: 150 }, build_time: 35, stats: { hp: 2000, armor: [3, 10], attack: 3, range: 7 }, replaces: ['dock'], imgPath: 'img/Building/56.png' },
  { type: 'building', id: 'university', name: 'Universidad',       icon: '🎓', age: 2, row: 4, prereqs: [],           build_cost: { wood: 200 }, build_time: 60, stats: { hp: 2100, armor: [2, 9] }, imgPath: 'img/Building/33.png' },
  // ── Torres (columna vertical compartida) ──────────────────
  { type: 'building',  id: 'outpost',      name: 'Puesto Avanz.',   icon: '🗼', age: 0, row: 0, col: 0, prereqs: [],             build_cost: { wood: 25,  stone: 5   }, build_time: 15, stats: { hp:  500, armor: [0, 0]               }, imgPath: 'img/Building/38.png' },
  { type: 'defencive', id: 'watchtower',   name: 'Torre Vigía',     icon: '🏗️', age: 1, row: 2, col: 0, prereqs: [],             build_cost: { wood: 35, stone: 125  }, build_time: 80, stats: { hp: 850,  armor: [1, 7], attack:   5, range: 8, los: 10, bonuses: [{ vs: 'camel_units', value: 1 }, { vs: 'ships', value: 6 }, { vs: 'fishing_ships', value: 7 }] }, imgPath: 'img/Building/25.png' },
  { type: 'defencive', id: 'guardtower',   name: 'Torre Guardia',   icon: '🏗️', age: 2, row: 4, col: 0, prereqs: ['watchtower'], build_cost: { wood: 35,  stone: 125 }, build_time: 80, stats: { hp: 1500, armor: [2, 8], attack:   7, range: 8, los: 10, bonuses: [{ vs: 'camel_units', value: 1 }, { vs: 'ships', value: 8 }, { vs: 'fishing_ships', value: 9 }] }, imgPath: 'img/Building/27.png' },
  { type: 'defencive', id: 'keep',         name: 'Torreón',         icon: '🏗️', age: 3, row: 6, col: 0, prereqs: ['guardtower'], build_cost: { wood: 35,  stone: 125 }, build_time: 80, stats: { hp: 2250, armor: [3, 9], attack:   8, range: 8, los: 10, bonuses: [{ vs: 'camel_units', value: 1 }, { vs: 'ships', value: 9 }, { vs: 'fishing_ships', value: 10 }] }, imgPath: 'img/Building/26.png' },
  { type: 'defencive', id: 'bombardtower', name: 'Torre Bombarda',  icon: '💣', age: 3, row: 7, col: 0, prereqs: [],             build_cost: { stone: 125, gold: 100 }, build_time: 80, stats: { hp: 2220, armor: [3, 9], attack: 120, range: 12, los: 10 }, imgPath: 'img/Building/42.png' },
  // ── Murallas (columna vertical compartida) ────────────────
  { type: 'building',  id: 'palisadewall',  name: 'Empalizada',      icon: '🪵', age: 0, row: 0, col: 1, prereqs: [], build_cost: { wood: 2   }, build_time: 6,  stats: { hp:  150, armor: [ 2,  2] }, imgPath: 'img/Building/30.png' },
  { type: 'defencive', id: 'palisadegate',  name: 'Puerta Empaliz.', icon: '🚪', age: 0, row: 1, col: 1, prereqs: [], build_cost: { wood: 20  }, build_time: 30, stats: { hp:  240, armor: [ 2,  2] }, imgPath: 'img/Building/44.png' },
  { type: 'defencive', id: 'stonewall',     name: 'Muro de Piedra',  icon: '🧱', age: 1, row: 2, col: 1, prereqs: [], build_cost: { stone: 5  }, build_time: 10, stats: { hp: 1080, armor: [ 8, 10] }, imgPath: 'img/Building/31.png' },
  { type: 'defencive', id: 'gate',          name: 'Puerta',          icon: '🚪', age: 1, row: 3, col: 1, prereqs: [], build_cost: { stone: 30 }, build_time: 70, stats: { hp: 1650, armor: [ 6,  6] }, imgPath: 'img/Building/36.png' },
  { type: 'defencive', id: 'fortifiedwall', name: 'Muro Fortificado',icon: '🧱', age: 2, row: 4, col: 1, prereqs: [], build_cost: { stone: 5  }, build_time: 10, stats: { hp: 3000, armor: [12, 12] }, imgPath: 'img/Building/32.png' },
  // ── Castillo / Maravilla / Monasterio ─────────────────────
  { type: 'building', id: 'castle',           name: 'Castillo',      icon: '🏯', age: 2, row: 4, prereqs: [], build_cost: { stone: 650 }, build_time: 200, stats: { hp: 4800, armor: [8, 11], attack: 11, range: 8 }, imgPath: 'img/Building/7.png' },
  { type: 'building', id: 'wonder',           name: 'Maravilla',     icon: '🏰', age: 3, row: 6, prereqs: [], build_cost: { wood: 1000, stone: 1000, gold: 1000 }, build_time: 3500, stats: { hp: 4800, armor: [3, 10] }, imgPath: 'img/Building/34.png' },
  { type: 'building', id: 'monastery',        name: 'Monasterio',    icon: '⛪', age: 2, row: 4, prereqs: [], build_cost: { wood: 175 }, build_time: 40, stats: { hp: 2100, armor: [2, 9] }, imgPath: 'img/Building/10.png' },
  { type: 'building', id: 'fortified_church', name: 'Iglesia Fort.', variant: 'regional', icon: '⛪', age: 2, row: 4, prereqs: [], build_cost: { wood: 200 }, build_time: 40, stats: { hp: 2400, armor: [5, 11], attack: 5, range: 4, los: 10, bonuses: [{ vs: 'ships', value: 5 }, { vs: 'camel_units', value: 1 }] }, replaces: ['monastery'], imgPath: 'img/Building/88.png' },
  // ── Economía ──────────────────────────────────────────────
  { type: 'building', id: 'tc',         name: 'Centro Urbano',   icon: '🏰', age: 0, row: 0, prereqs: [], build_cost: { wood: 275, stone: 100 }, build_time: 150, stats: { hp: 2400, armor: [3, 5], attack: 5, range: 6 }, imgPath: 'img/Building/28.png' },
  { type: 'building', id: 'tc_castle',  name: 'C.U. adicional',  icon: '🏰', age: 2, row: 4, prereqs: [], build_cost: { wood: 275, stone: 100 }, build_time: 150, stats: { hp: 2400, armor: [3, 5], attack: 5, range: 6 }, imgPath: 'img/Building/28.png' },
  { type: 'building', id: 'house',      name: 'Casa',            icon: '',   age: 0, row: 0, prereqs: [], build_cost: { wood: 25  }, build_time: 25, stats: { hp:  550, armor: [0, 7] }, imgPath: 'img/Building/11.png' },
  { type: 'building', id: 'mining',     name: 'Camp. Minero',    icon: '⛏️', age: 0, row: 0, prereqs: [], build_cost: { wood: 100 }, build_time: 35, stats: { hp:  600, armor: [0, 7] }, imgPath: 'img/Building/39.png' },
  { type: 'building', id: 'lumber',     name: 'Camp. Maderero',  icon: '🪵', age: 0, row: 0, prereqs: [], build_cost: { wood: 100 }, build_time: 35, stats: { hp:  600, armor: [0, 7] }, imgPath: 'img/Building/40.png' },
  { type: 'building', id: 'tahsili',    name: 'Asentamiento',    icon: '🏠', variant: 'regional', age: 0, row: 0, prereqs: [], build_cost: { wood: 125 }, build_time: 40, stats: { hp:  600, armor: [0, 7] }, replaces: ['lumber', 'mining', 'mill', 'mulecart'], imgPath: 'img/Building/98.png' },
  { type: 'building', id: 'mulecart',   name: 'Mula de Carga',   icon: '🫏', variant: 'regional', age: 0, row: 0, prereqs: [], build_cost: { wood: 100 }, build_time: 25, stats: { hp:  300, armor: [1, 2] }, replaces: ['lumber', 'mining', 'tahsili'], imgPath: 'img/Building/89.png' },
  { type: 'building', id: 'market',     name: 'Mercado',         icon: '💰', age: 1, row: 2, prereqs: ['mill'], build_cost: { wood: 175 }, build_time: 60, stats: { hp: 1800, armor: [1, 8] }, imgPath: 'img/Building/16.png' },
  { type: 'building', id: 'mill',       name: 'Molino',          icon: '🌾', age: 0, row: 0, prereqs: [], build_cost: { wood: 100 }, build_time: 35, stats: { hp:  600, armor: [0, 7] }, imgPath: 'img/Building/19.png' },
  { type: 'building', id: 'farm',       name: 'Granja',          icon: '🌾', age: 0, row: 0, prereqs: [], build_cost: { wood: 60  }, build_time: 15, stats: { hp:  480, armor: [0, 0] }, imgPath: 'img/Building/35.png' },
  { type: 'building', id: 'folwark',    name: 'Folwark',         icon: '🌾', age: 0, row: 0, prereqs: [], build_cost: { wood: 100 }, build_time: 40, stats: { hp: 1000, armor: [0, 7] }, replaces: ['mill'], imgPath: 'img/Building/86.png' },
  { type: 'building', id: 'pasture',    name: 'Pasto',           icon: '🐄', variant: 'regional', age: 0, row: 0, prereqs: [], build_cost: { wood: 110 }, build_time: 22, stats: { hp: 560, armor: [0, 0] }, imgPath: 'img/Building/87.png' },
  { type: 'building', id: 'fishtrap',   name: 'Trampa Peces',    icon: '🐟', age: 0, row: 0, prereqs: [], build_cost: { wood: 100 }, build_time: 40, stats: { hp: 250, armor: [0, 0] }, imgPath: 'img/Building/41.png' },
];