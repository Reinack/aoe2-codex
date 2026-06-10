// ═══════════════════════════════════════════════════════════
// STATS PANEL (click)
// ═══════════════════════════════════════════════════════════

const statsPanel = document.getElementById('stats-panel');

// Cierra al hacer click fuera del panel
document.addEventListener('click', e => {
  if (statsPanel.style.display !== 'none' && !statsPanel.contains(e.target)) {
    closeStatsPanel();
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeStatsPanel(); });

function closeStatsPanel() { statsPanel.style.display = 'none'; }

function getStatsForNode(n) {
  // Castle slots → look up in UNIQUE_UNIT_STATS by Spanish name (stats are keyed in Spanish)
  if (n.id === 'uniqueunit' || n.id === 'eliteunique') {
    const civ = getCiv();
    if (civ.uniqueUnits && civ.uniqueUnits.length > 0) {
      const lcUU = LOCALE['es']?.civs?.[currentCiv]?.uniqueUnits?.[0] || {};
      const key = n.id === 'uniqueunit'
        ? (lcUU.name || '')
        : (lcUU.upgradeName || (lcUU.name ? lcUU.name + ' Elite' : ''));
      return UNIQUE_UNIT_STATS[key] || null;
    }
  }
  // Direct lookup by node ID — generic → regional → unique
  return UNIT_STATS[n.id] || REGIONAL_UNIT_STATS[n.id] || UNIQUE_UNIT_STATS[n.id] || n.stats || null;
}

const STAT_ICONS = {
  hp:            'img/Icon/hp.webp',
  attack:        'img/Icon/attack.webp',
  armor:         'img/Icon/armor.webp',
  parmor:        'img/Icon/pierce_armor.webp',
  range:         'img/Icon/range.webp',
  speed:         'img/Icon/speed.webp',
  rof:           'img/Icon/reload.webp',
  train:         'img/Icon/reload.webp',  // train time uses same clock icon as ROF
  pierce_attack: 'img/Icon/pierce_attack.webp',
  garrison:      'img/Icon/garrison.webp',
  los:           'img/Icon/los.webp',
  blast_r:       'img/Icon/range.webp',
};

// All building node IDs that can appear in the tech tree or stats panel
const ALL_BUILDING_IDS = [
  // Production
  'barracks', 'archery', 'stable', 'siege', 'dock', 'harbor',
  'university', 'monastery', 'fortified_church', 'castle', 'krepost', 'donjon', 'blacksmith',
  // Economic
  'tc', 'market', 'mill', 'lumber', 'mining', 'house', 'folwark', 'tahsili', 'mulecart', 'pasture',
  'feitoria', 'caravanserai',
  // Defense
  'outpost', 'watchtower', 'guardtower', 'keep', 'bombardtower',
  'palisadewall', 'palisadegate', 'stonewall', 'gate', 'fortifiedwall',
  // Other
  'wonder',
];

// Maps civ bonus scope names → unit ID lists for stat modifier lookup
const CIV_BONUS_SCOPE_MAP = {
  // ── Military units ──────────────────────────────────────────────────────────
  infantry:        () => UNIT_CLASSES['infantry']       || [],
  cavalry:         () => UNIT_CLASSES['cavalry']        || [],
  cavalry_archer:  () => UNIT_CLASSES['mounted_archer'] || [],
  foot_archer:     () => UNIT_CLASSES['foot_archer']    || [],
  foot_archer_no_skirm: () => (UNIT_CLASSES['foot_archer'] || []).filter(id => !['skirmisher','eliteskirm','imp_skirmisher'].includes(id)),
  ship:            () => UNIT_CLASSES['navy']           || [],
  gunpowder:       () => UNIT_CLASSES['gunpowder']      || [],
  siege:           () => UNIT_CLASSES['siege']          || [],
  light_cavalry:   () => ['scout','lightcav','hussar','winged_hussar'],
  steppe_lancer:   () => ['steppe_lancer','elite_steppe_lancer'],
  monk:            () => UNIT_CLASSES['religious']      || [],
  unique_unit:     () => ['uniqueunit','eliteunique'],
  camel:           () => ['camel','heavycamel','imp_camel'],
  eagle:           () => ['eaglescout','eaglewarrior','eliteeagle'],
  trade:           () => ['tradecart','tradecog'],
  elephant:        () => ['battleeleph','eliteeleph','elephant_archer','elite_elephant_archer'],
  battle_elephant: () => ['battleeleph','eliteeleph'],
  // "Barracks and Stable Units" — infantry + non-camel cavalry
  barracks_stable: () => [...(UNIT_CLASSES['infantry'] || []), ...(UNIT_CLASSES['cavalry'] || [])],
  // All military units — used for creation_speed bonuses (Aztecs, Gurjaras)
  military_unit: () => [
    ...(UNIT_CLASSES['infantry']       || []),
    ...(UNIT_CLASSES['foot_archer']    || []),
    ...(UNIT_CLASSES['mounted_archer'] || []),
    ...(UNIT_CLASSES['cavalry']        || []),
    ...(UNIT_CLASSES['siege']          || []),
    ...(UNIT_CLASSES['religious']      || []),
    ...(UNIT_CLASSES['navy']           || []),
    ...(UNIT_CLASSES['gunpowder']      || []),
    'uniqueunit', 'eliteunique',
  ],
  // Skirmisher-line only (Khitans creation_speed bonus)
  skirmisher: () => ['skirmisher', 'eliteskirm', 'imp_skirmisher'],
  // ── Civilian units ──────────────────────────────────────────────────────────
  villager:        () => ['villager'],
  // Villager sub-roles all map to the villager node (work-speed bonuses)
  farmer:          () => ['villager'],
  lumberjack:      () => ['villager'],
  shepherd:        () => ['villager'],
  hunter:          () => ['villager'],
  forager:         () => ['villager'],
  fisher:          () => ['villager'],
  stone_miner:     () => ['villager'],
  gold_miner:      () => ['villager'],
  miner:           () => ['villager'],
  builder:         () => ['villager'],
  // ── Ships (specific sub-groups) ─────────────────────────────────────────────
  galley:          () => ['galley','wargalley','galleon'],
  transport_ship:  () => ['transportship'],
  fire_ship:       () => ['firegalley','fireship','fastfireship','dromon'],
  traction_treb:   () => ['traction_treb'],
  lou_chuan:       () => ['lou_chuan'],
  scorpion:        () => ['scorpion','heavyscorpion'],
  // ── Specific infantry / unique units ────────────────────────────────────────
  condottiero:     () => ['condottiero'],
  jian_swordsman:  () => ['jian_swordsman'],
  // ── Combined groups ──────────────────────────────────────────────────────────
  camel_elephant:  () => ['camel','heavycamel','imp_camel','battleeleph','eliteeleph','elephant_archer','elite_elephant_archer'],
  // ── Buildings ───────────────────────────────────────────────────────────────
  building:        () => ALL_BUILDING_IDS,
  mulecart:        () => ['mulecart'],
  tc:              () => ['tc'],
  tc_tower:        () => ['tc', ...(UNIT_CLASSES['towers'] || [])],
  tc_dock:         () => ['tc', 'dock', 'harbor'],
  tower:           () => UNIT_CLASSES['towers']      || [],
  castle:          () => UNIT_CLASSES['castles']     || [],
  dock:            () => ['dock', 'harbor'],
  // Units + buildings (e.g. Georgian elevation damage reduction)
  unit_building:   () => [
    ...(UNIT_CLASSES['infantry'] || []), ...(UNIT_CLASSES['cavalry'] || []),
    ...(UNIT_CLASSES['foot_archer'] || []), ...(UNIT_CLASSES['mounted_archer'] || []),
    ...(UNIT_CLASSES['navy'] || []), ...(UNIT_CLASSES['siege'] || []),
    ...(UNIT_CLASSES['religious'] || []), 'villager',
    ...ALL_BUILDING_IDS,
  ],
};

// Returns stats after applying current civ's stat_modifier / creation_speed / building_work_speed bonuses,
// or null if none apply.
// unitAge: the node's age (0=Dark, 1=Feudal, 2=Castle, 3=Imperial); bonuses with min_age are skipped if younger.
// trainingBuilding: the building that trains this unit (e.g. 'barracks', 'archery'); used for building_work_speed.
function computeCivModifiedStats(stats, unitId, unitAge = 0, trainingBuilding = null) {
  const civ = getCiv();
  if (!civ || !civ.bonuses) return null;

  // Helper: does this bonus's scope include the given unitId?
  const scopeMatches = (b) => {
    if (b.min_age !== undefined && unitAge < b.min_age) return false;
    const getter = CIV_BONUS_SCOPE_MAP[b.scope];
    if (getter) return getter().includes(unitId);
    return UNIT_CLASSES[b.scope]?.includes(unitId) ?? false;
  };

  // Team bonus always applies to the civ's own units too (not just teammates)
  const allBonuses = civ.teamBonus ? [...civ.bonuses, civ.teamBonus] : civ.bonuses;

  const statMods     = allBonuses.filter(b => b.type === 'stat_modifier'  && scopeMatches(b));
  const creationMods = allBonuses.filter(b => b.type === 'creation_speed' && scopeMatches(b));
  // building_work_speed for training: scope must match the unit's training building
  const bldgSpeedMods = (trainingBuilding && stats.train != null)
    ? allBonuses.filter(b => b.type === 'building_work_speed' && b.scope === trainingBuilding
        && (b.min_age === undefined || unitAge >= b.min_age))
    : [];

  if (statMods.length === 0 && creationMods.length === 0 && bldgSpeedMods.length === 0) return null;

  const m = {
    hp:     stats.hp,
    attack: stats.attack,
    armor:  [...(stats.armor || [0, 0])],
    range:  stats.range,
    speed:  stats.speed,
    rof:    stats.rof,
    los:    stats.los,
    train:  stats.train,
  };

  // ── stat_modifier bonuses ──────────────────────────────────────────────────
  for (const mod of statMods) {
    const { stat, op } = mod;
    const value = mod.value_by_age
      ? (mod.value_by_age[Math.min(unitAge, mod.value_by_age.length - 1)] ?? mod.value_by_age[mod.value_by_age.length - 1])
      : mod.value;

    // Skip neutral values: multiply by 1 = no change, add 0 = no change
    if (op === 'multiply' ? value === 1 : value === 0) continue;

    const apply = (cur, v) => op === 'multiply' ? cur * v : cur + v;
    if (stat === 'hp')           { m.hp       = Math.round(apply(m.hp       ?? 0, value)); }
    if (stat === 'attack')       { m.attack   = Math.round(apply(m.attack   ?? 0, value)); }
    if (stat === 'armor')        { m.armor    = m.armor.map(a => Math.round(apply(a, value))); }
    if (stat === 'armor_melee')  { m.armor[0] = Math.round(apply(m.armor[0], value)); }
    if (stat === 'armor_pierce') { m.armor[1] = Math.round(apply(m.armor[1], value)); }
    if (stat === 'range' && m.range  !== undefined) { m.range = +(apply(m.range, value)).toFixed(1); }
    if (stat === 'speed' && m.speed  !== undefined) { m.speed = +(apply(m.speed, value)).toFixed(2); }
    if (stat === 'rof'   && m.rof    !== undefined) { m.rof   = +(apply(m.rof,   value)).toFixed(2); }
    if (stat === 'los')          { m.los = Math.round(apply(m.los ?? 0, value)); }
  }

  // ── creation_speed bonuses → reduce train time ─────────────────────────────
  // value < 1 means faster (e.g. 0.85 = 15 % faster)
  for (const mod of creationMods) {
    if (m.train == null) continue;
    const value = mod.value_by_age
      ? (mod.value_by_age[Math.min(unitAge, mod.value_by_age.length - 1)] ?? mod.value_by_age[mod.value_by_age.length - 1])
      : mod.value;
    if (value === 1) continue;
    m.train = Math.round(m.train * value);
  }

  // ── building_work_speed bonuses → divide train time by speed multiplier ─────
  // value > 1 means the building works faster (e.g. 1.33 = 33 % faster → train / 1.33)
  for (const mod of bldgSpeedMods) {
    if (m.train == null) continue;
    const value = mod.value_by_age
      ? (mod.value_by_age[Math.min(unitAge, mod.value_by_age.length - 1)] ?? mod.value_by_age[mod.value_by_age.length - 1])
      : mod.value;
    if (value == null || value === 1) continue;
    m.train = Math.round(m.train / value);
  }

  return m;
}

// Returns a modified cost object for a unit/building based on civ bonuses, or null if unchanged.
// bonusType: 'cost_modifier' for unit train costs, 'building_cost_modifier' for build costs.
function computeModifiedCost(rawCost, unitId, unitAge = 0, bonusType = 'cost_modifier') {
  if (!rawCost) return null;
  const civ = getCiv();
  if (!civ || !civ.bonuses) return null;

  const allBonuses = civ.teamBonus ? [...civ.bonuses, civ.teamBonus] : civ.bonuses;
  const mods = allBonuses.filter(b => {
    if (b.type !== bonusType) return false;
    if (b.min_age !== undefined && unitAge < b.min_age) return false;
    const getter = CIV_BONUS_SCOPE_MAP[b.scope];
    if (getter) return getter().includes(unitId);
    return UNIT_CLASSES[b.scope]?.includes(unitId) ?? false;
  });

  if (mods.length === 0) return null;

  const modCost = { ...rawCost };
  for (const mod of mods) {
    const value = mod.value_by_age
      ? (mod.value_by_age[Math.min(unitAge, mod.value_by_age.length - 1)] ?? mod.value_by_age[mod.value_by_age.length - 1])
      : mod.value;
    for (const res of ['food', 'wood', 'gold', 'stone']) {
      if (modCost[res] == null) continue;
      if (mod.resource === 'all' || mod.resource === res) {
        if (mod.op === 'multiply') {
          modCost[res] = Math.round(modCost[res] * value);
        } else if (mod.op === 'add') {
          modCost[res] = Math.max(0, modCost[res] + value);
        }
      }
    }
  }

  // Return null if nothing actually changed
  const changed = ['food', 'wood', 'gold', 'stone'].some(r =>
    (rawCost[r] ?? 0) !== (modCost[r] ?? 0)
  );
  return changed ? modCost : null;
}

function statIcon(key) {
  const src = STAT_ICONS[key];
  if (src) return `<img src="${src}" class="stat-img-icon" alt="${key}">`;
  return key;
}

// modVal: civ/tech-modified value; rofMode: lower-is-better (flip delta color)
function statRow(icon, label, val, modVal, rofMode = false) {
  const hasBonus = modVal !== undefined && modVal !== null && modVal !== val;
  const diff = hasBonus ? +(modVal - val).toFixed(2) : 0;
  const isPos = rofMode ? diff < 0 : diff > 0;
  const sign = diff > 0 ? '+' : '';
  const deltaClass = isPos ? 'pos' : 'neg';
  return `<div class="sp-stat${hasBonus ? ' sp-stat-boosted' : ''}">
    <span class="sp-stat-icon">${icon}</span>
    <span class="sp-stat-label">${label}</span>
    <span class="sp-stat-val">${hasBonus ? modVal : val}</span>
    ${hasBonus ? `<span class="sp-stat-delta ${deltaClass}">${sign}${diff}</span>` : ''}
  </div>`;
}

// Renders the stats grid. rawStats = original base (delta reference); displayStats = current (civ + techs applied).
function renderStatsGrid(rawStats, displayStats, isUnit, activeLabel) {
  const gridEl   = document.getElementById('sp-stats-grid');
  const noStats  = document.getElementById('sp-no-stats');
  const noteEl   = document.getElementById('sp-civ-bonus-note');

  if (!displayStats) {
    gridEl.style.display = 'none';
    noStats.style.display = 'block';
    noteEl.style.display = 'none';
    noStats.textContent = currentLang === 'es'
      ? 'Stats no disponibles.' : 'Stats not available.';
    return;
  }

  noStats.style.display = 'none';
  gridEl.style.display  = 'grid';

  const B = rawStats;      // baseline for deltas
  const D = displayStats;  // what to display
  const d = (bv, dv) => (dv !== undefined && dv !== null && dv !== bv) ? dv : undefined;
  // Helper: only render a stat row when the base value exists
  const maybeRow = (icon, label, bv, dv, rofMode = false) => {
    if (bv === undefined || bv === null) return '';
    return statRow(icon, label, bv, dv, rofMode);
  };

  const rows = [];
  rows.push(statRow(statIcon('hp'),    t('hp'),         B.hp         ?? '—', d(B.hp,         D.hp)));
  if (isUnit || B.attack !== undefined)
    rows.push(statRow(statIcon('attack'), t('attack'),  B.attack     ?? '—', d(B.attack,     D.attack)));
  rows.push(statRow(statIcon('armor'), t('armor_m'),    B.armor?.[0] ?? '—', d(B.armor?.[0], D.armor?.[0])));
  rows.push(statRow(statIcon('parmor'),t('armor_p'),    B.armor?.[1] ?? '—', d(B.armor?.[1], D.armor?.[1])));
  // Range / Speed / ROF / LOS: only render if the unit/building actually has the stat
  rows.push(maybeRow(statIcon('range'), t('range'),        B.range,               d(B.range,     D.range)));
  rows.push(maybeRow(statIcon('speed'), t('speed'),        B.speed,               d(B.speed,     D.speed)));
  rows.push(maybeRow(statIcon('rof'),     t('rof')||'ROF',     B.rof,           d(B.rof,           D.rof), true));
  rows.push(maybeRow(statIcon('blast_r'), t('blast_r'),        B.blast_radius,  d(B.blast_radius,  D.blast_radius)));
  rows.push(maybeRow(statIcon('los'),   t('los'),          B.los,                 d(B.los,       D.los)));
  rows.push(maybeRow(statIcon('train'), t('train')||'Train',  B.train,             d(B.train,     D.train), true));

  if (B.bonuses?.length || D.bonuses?.length) {
    const allVs = new Set([
      ...(B.bonuses || []).map(b => b.vs),
      ...(D.bonuses || []).map(b => b.vs),
    ]);
    for (const vs of allVs) {
      const base = B.bonuses?.find(b => b.vs === vs);
      const disp = D.bonuses?.find(b => b.vs === vs);
      const fmtBonus = v => v >= 0 ? `+${v}` : `${v}`;
      const bv   = base ? fmtBonus(base.value) : undefined;
      const dv   = disp && (!base || disp.value !== base.value) ? fmtBonus(disp.value) : undefined;
      rows.push(statRow(statIcon('attack'), t(vs, 'bonus_targets'), bv ?? fmtBonus(disp.value), dv));
    }
  }

  gridEl.innerHTML = rows.join('');

  if (activeLabel) {
    noteEl.textContent  = activeLabel;
    noteEl.style.display = 'block';
  } else {
    noteEl.style.display = 'none';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Build Efficiency Chart
// Formula (from AoE2 wiki): time = 3t / (n+2), where t = 1-villager build time,
// n = number of villagers.  Y axis = fraction of original time = 3/(n+2).
// ─────────────────────────────────────────────────────────────────────────────
function buildEfficiencyHtml(buildCost, nodeId) {
  // ── SVG chart ────────────────────────────────────────────────────────────────
  const W = 200, H = 100;
  const ML = 28, MR = 8, MT = 8, MB = 22;
  const CW = W - ML - MR;   // plot width
  const CH = H - MT - MB;   // plot height

  const NMAX = 10;
  const xOf = n => ML + (n - 1) / (NMAX - 1) * CW;
  const yOf = f => MT + (1 - f) * CH;  // f=1 → top of plot (100%), f=0 → bottom

  const pts = Array.from({ length: NMAX }, (_, i) => {
    const n = i + 1;
    const f = 3 / (n + 2);
    return { n, f: +f.toFixed(4), x: xOf(n), y: yOf(f) };
  });

  // Curve path
  const curvePath = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  // Dashed grid lines + Y-axis labels at 25 / 50 / 75 / 100 %
  const grids = [1.0, 0.75, 0.5, 0.25].map(f => {
    const y  = yOf(f).toFixed(1);
    const pct = Math.round(f * 100);
    return `<line x1="${ML}" y1="${y}" x2="${W - MR}" y2="${y}" stroke="#c8b898" stroke-width="0.5" stroke-dasharray="3,2"/>
            <text x="${ML - 3}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="7" fill="#7a5030">${pct}%</text>`;
  }).join('');

  // Dots with hover tooltips
  const dots = pts.map(p =>
    `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.5" fill="#c07010" stroke="#fff" stroke-width="0.8">
      <title>${p.n} ${currentLang === 'es' ? 'ald.' : 'vill.'}: ${Math.round(p.f * 100)}%</title>
    </circle>`
  ).join('');

  // X-axis tick numbers
  const xTicks = pts.map(p =>
    `<text x="${p.x.toFixed(1)}" y="${H - MB + 11}" text-anchor="middle" font-size="7" fill="#7a5030">${p.n}</text>`
  ).join('');

  const xAxisLabel = currentLang === 'es' ? 'Aldeanos' : 'Villagers';
  const chartTitle = t('build_efficiency') || 'Build time vs. workers · 3t/(n+2)';

  const svg = `<svg class="sp-efficiency-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${grids}
    <path d="${curvePath}" fill="none" stroke="#c07010" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
    <line x1="${ML}" y1="${MT}" x2="${ML}"      y2="${H - MB}" stroke="#9a7040" stroke-width="1"/>
    <line x1="${ML}" y1="${H - MB}" x2="${W - MR}" y2="${H - MB}" stroke="#9a7040" stroke-width="1"/>
    ${xTicks}
    <text x="${(ML + W - MR) / 2}" y="${H - 1}" text-anchor="middle" font-size="7" fill="#7a5030">${xAxisLabel}</text>
  </svg>`;

  // ── Repair cost ───────────────────────────────────────────────────────────────
  // Special case: TC always costs 550 wood (no stone) to repair fully (AoE2 wiki)
  let repairHtml = '';
  if (buildCost) {
    let repairCost;
    if (nodeId === 'tc') {
      repairCost = { wood: 550 };
    } else {
      repairCost = {};
      for (const res of ['food', 'wood', 'gold', 'stone']) {
        if (buildCost[res]) repairCost[res] = Math.round(buildCost[res] * 0.5);
      }
    }

    // Apply any civ repair discount (scope: "repair") from bonuses or teamBonus
    const civ = getCiv();
    const repairBonuses = [
      ...(civ?.bonuses    || []),
      ...(civ?.teamBonus ? [civ.teamBonus] : []),
    ].filter(b => b.type === 'cost_modifier' && b.scope === 'repair');

    for (const b of repairBonuses) {
      for (const res of ['food', 'wood', 'gold', 'stone']) {
        if (repairCost[res] == null) continue;
        if (b.resource === 'all' || b.resource === res) {
          if (b.op === 'multiply') repairCost[res] = Math.round(repairCost[res] * b.value);
          else if (b.op === 'add') repairCost[res] = Math.max(0, repairCost[res] + b.value);
        }
      }
    }

    const repairLabel = t('repair_cost') || 'Repair (full HP)';
    repairHtml = `<div class="sp-repair-cost"><strong>${repairLabel}:</strong> ${costStr(repairCost)}</div>`;
  }

  return `<div class="sp-efficiency-title">${chartTitle}</div>${svg}${repairHtml}`;
}

// Checks if a tech_cost_modifier bonus scope applies to a given node (by its research building).
function techCostScopeMatches(scope, n) {
  if (scope === 'all_tech') return true;
  if (scope === 'dock_university') return n.building === 'dock' || n.building === 'university';
  if (scope === 'economic_tech')   return ['mill', 'lumber', 'mining', 'market'].includes(n.building);
  if (scope === 'siege_fortification_upgrades') return n.building === 'siege';
  return n.building === scope;
}

// Returns a modified research_cost object if any tech_cost_modifier civ bonus applies, else null.
function computeModifiedResearchCost(n) {
  if (!n.research_cost) return null;
  const civ = getCiv();
  if (!civ || !civ.bonuses) return null;
  const unitAge = n.age ?? 0;
  const mods = civ.bonuses.filter(b => {
    if (b.type !== 'tech_cost_modifier') return false;
    if (b.min_age !== undefined && unitAge < b.min_age) return false;
    return techCostScopeMatches(b.scope, n);
  });
  if (mods.length === 0) return null;
  const modCost = { ...n.research_cost };
  for (const mod of mods) {
    const value = mod.value_by_age
      ? (mod.value_by_age[Math.min(unitAge, mod.value_by_age.length - 1)] ?? mod.value_by_age[mod.value_by_age.length - 1])
      : mod.value;
    for (const res of ['food', 'wood', 'gold', 'stone']) {
      if (modCost[res] == null) continue;
      if (mod.resource === 'all' || mod.resource === res) {
        if (mod.op === 'multiply') modCost[res] = Math.round(modCost[res] * value);
        else if (mod.op === 'add') modCost[res] = Math.max(0, modCost[res] + value);
      }
    }
  }
  const changed = ['food', 'wood', 'gold', 'stone'].some(r => (n.research_cost[r] ?? 0) !== (modCost[r] ?? 0));
  return changed ? modCost : null;
}

function showStatsPanel(ev, n) {
  hideTip();

  // Nombre y subtítulo
  // 'unique' nodes (uniqueunit/eliteunique/uniquetech1/uniquetech2) carry civ-specific
  // names set by updateUniqueForCiv — pass no category so tData returns the value directly.
  const nameCategory = n.type === 'tech'
    ? 'techs'
    : (n.type === 'unit' || n.type === 'upgrade')
      ? 'units'
      : null;  // 'unique' → use direct value
  const name = tData(n, 'name', nameCategory);
  document.getElementById('sp-name').textContent = name;
  document.getElementById('sp-sub').textContent =
    (n.type === 'building' || n.type === 'defencive') ? t('building') : `${t(n.age, 'ages')} · ${t(n.type)}`;

  // Icono
  const spIcon = document.getElementById('sp-icon');
  const src = n.imgPath || IMG_MAP[n.id];
  if (src) { spIcon.src = src; spIcon.style.display = 'block'; }
  else { spIcon.style.display = 'none'; }

  // Stats
  const stats = getStatsForNode(n);
  // Compute civ bonuses — pass unit's age and training building so all bonus types are applied
  const trainingBuilding = n.building ?? null;
  const civMod = stats ? computeCivModifiedStats(stats, n.id, n.age ?? 0, trainingBuilding) : null;
  // isUnit: show attack row even when base attack is 0 (units always have an attack stat)
  const isUnit = n.type === 'unit' || n.type === 'upgrade'
    || n.id === 'uniqueunit' || n.id === 'eliteunique';

  // Store for sim: clear active techs only when switching unit
  if (!simUnit || simUnit.id !== n.id) simActiveTechs.clear();
  simBaseStats = stats;
  simCivStats  = civMod;

  const civLabel = civMod
    ? (currentLang === 'es'
        ? `★ Bonuses de ${LOCALE[currentLang]?.civs?.[currentCiv]?.name || currentCiv}`
        : `★ ${LOCALE[currentLang]?.civs?.[currentCiv]?.name || currentCiv} bonuses`)
    : null;

  renderStatsGrid(stats, civMod || stats, isUnit, civLabel);

  // Coste + tiempo de producción
  const isBuilding = n.type === 'building' || n.type === 'defencive';
  const rawBuildCost  = n.build_cost  || (isBuilding ? n.cost : null);
  const rawTrainCost  = n.train_cost  || (!isBuilding && n.type !== 'tech' ? n.cost : null);
  const modBuildCost  = rawBuildCost  ? computeModifiedCost(rawBuildCost,  n.id, n.age ?? 0, 'building_cost_modifier') : null;
  const modTrainCost  = rawTrainCost  ? computeModifiedCost(rawTrainCost,  n.id, n.age ?? 0, 'cost_modifier')          : null;

  const timeIcon  = `<img src="img/Icon/reload.webp" class="res-icon" alt="time">`;
  const trainTime = civMod?.train ?? stats?.train ?? null;

  let costHtml = '';
  if (n.build_cost) {
    const btStr = n.build_time != null ? `  ${timeIcon} ${n.build_time}s` : '';
    costHtml += `<strong>${t('build_cost')}:</strong> ${costStr(modBuildCost || n.build_cost, modBuildCost ? n.build_cost : null)}${btStr} `;
  }
  if (n.train_cost) {
    const tStr = trainTime != null ? `  ${timeIcon} ${trainTime}s` : '';
    costHtml += `<strong>${t('train_cost')}:</strong> ${costStr(modTrainCost || n.train_cost, modTrainCost ? n.train_cost : null)}${tStr} `;
  }

  // Fallback (cost field used when no specific build/train/research_cost)
  if (!costHtml && n.cost) {
    const label = isBuilding ? t('build_cost') : (n.type === 'unit' || n.type === 'upgrade' ? t('train_cost') : t('research_cost'));
    const rawFallback = n.cost;
    const modFallback = isBuilding ? modBuildCost : modTrainCost;
    const isTrain = label === t('train_cost');
    const tStr = isTrain && trainTime != null ? `  ${timeIcon} ${trainTime}s` : '';
    costHtml = `<strong>${label}:</strong> ${costStr(modFallback || rawFallback, modFallback ? rawFallback : null)}${tStr} `;
  }

  document.getElementById('sp-cost').innerHTML = costHtml;

  // Research cost — shown below stats, with civ-reduced values and time
  const modResearchCost = computeModifiedResearchCost(n);
  const rcEl = document.getElementById('sp-research-cost');
  if (n.research_cost) {
    const rStr = n.research_time != null ? `  ${timeIcon} ${n.research_time}s` : '';
    rcEl.innerHTML = `<strong>${t('research_cost')}:</strong> ${costStr(modResearchCost || n.research_cost, modResearchCost ? n.research_cost : null)}${rStr}`;
    rcEl.style.display = 'block';
  } else {
    rcEl.innerHTML = '';
    rcEl.style.display = 'none';
  }

  // Store costs so the tech sim can update them when techs are toggled
  simBaseCost = rawTrainCost || null;
  simCivCost  = modTrainCost || null;

  // Build efficiency chart + repair cost (buildings / defensive structures only)
  const bldEffEl = document.getElementById('sp-build-efficiency');
  if (isBuilding) {
    bldEffEl.innerHTML = buildEfficiencyHtml(rawBuildCost, n.id);
    bldEffEl.style.display = 'block';
  } else {
    bldEffEl.style.display = 'none';
  }

  // Efecto
  const effEl = document.getElementById('sp-effect');
  const eff = tData(n, 'effect');
  if (eff) { effEl.textContent = eff; effEl.style.display = 'block'; }
  else { effEl.style.display = 'none'; }

  // Afecta a (solo para tecnologías)
  const appEl = document.getElementById('sp-applies');
  if (n.type === 'tech' || n.type === 'upgrade' || n.type === 'unique') {
    let affects = TECHS[n.id]?.affects || [];
    // Si es una tecnología única genérica, buscar la específica de la civ
    if (n.id === 'uniquetech1' || n.id === 'uniquetech2') {
      const compositeId = `${currentCiv}_${n.id}`;
      if (TECHS[compositeId]?.affects) affects = TECHS[compositeId].affects;
    }

    if (affects.length > 0) {
      // Resolver clases a unidades individuales
      let unitIds = [];
      affects.forEach(a => {
        if (UNIT_CLASSES[a]) {
          unitIds = unitIds.concat(UNIT_CLASSES[a]);
        } else {
          unitIds.push(a);
        }
      });

      // Incluir unidad única si su clase coincide con las clases afectadas
      const uuName = LOCALE['es']?.civs?.[currentCiv]?.uniqueUnits?.[0]?.name;
      if (uuName && UNIQUE_UNIT_CLASSES[uuName]) {
        const uuClasses = UNIQUE_UNIT_CLASSES[uuName];
        const hasMatch = affects.some(a => uuClasses.includes(a));
        if (hasMatch) {
          unitIds.push('uniqueunit', 'eliteunique');
        }
      }

      // Filtrar por disponibilidad y resolver placeholders únicos
      const availableUnits = [...new Set(unitIds)].filter(uid => !isMissing(uid));

      if (availableUnits.length > 0) {
        appEl.style.display = 'block';
        let html = `<div class="sp-applies-title">${currentLang === 'es' ? 'Afecta a:' : 'Applies to:'}</div>`;
        html += `<div class="sp-applies-grid">`;
        availableUnits.forEach(uid => {
          const img = IMG_MAP[uid];
          if (img) {
            html += `<div class="sp-applies-icon" title="${uid}"><img src="${img}"></div>`;
          }
        });
        html += `</div>`;
        appEl.innerHTML = html;
      } else {
        appEl.style.display = 'none';
      }
    } else {
      appEl.style.display = 'none';
    }
  } else {
    appEl.style.display = 'none';
  }

  // Posición: medir altura real del panel antes de posicionarlo
  statsPanel.style.left = '-9999px';
  statsPanel.style.top  = '-9999px';
  statsPanel.style.display = 'block';
  const PW = statsPanel.offsetWidth  || 324;
  const PH = statsPanel.offsetHeight || 300;
  let x = ev.clientX + 18;
  let y = ev.clientY - 20;
  if (x + PW > window.innerWidth)  x = ev.clientX - PW - 10;
  if (y + PH > window.innerHeight) y = window.innerHeight - PH - 10;
  if (y < 0) y = 8;
  statsPanel.style.left = `${x}px`;
  statsPanel.style.top  = `${y}px`;
  statsPanel.classList.remove('sp-animate');
  requestAnimationFrame(() => statsPanel.classList.add('sp-animate'));

  // Show simulator for units, upgrades, buildings, and defensive structures
  const isSimulable = n.type === 'unit' || n.type === 'upgrade'
    || n.id === 'uniqueunit' || n.id === 'eliteunique'
    || n.type === 'building' || n.type === 'defencive';
  if (isSimulable) initSim(n);
  else document.getElementById('sp-tech-sim').style.display = 'none';
}
