// ═══════════════════════════════════════════════════════════
// TECH SIMULATOR
// ═══════════════════════════════════════════════════════════

let simUnit        = null;
let simActiveTechs = new Set();
let simMaxAge      = 3;
let simExpanded    = false;
let simBaseStats   = null;   // raw unit stats (before any bonuses)
let simCivStats    = null;   // stats after civ stat_modifier bonuses
let simTeamStats   = null;   // stats after applying allied civs' team bonuses
let simBaseCost    = null;   // raw unit train cost (before any bonuses)
let simCivCost     = null;   // train cost after civ cost_modifier bonuses
let simTeamCivs    = [];     // ally civ IDs selected by the user (max 7)

// Nombres que son a la vez id de nodo y clase de UNIT_CLASSES:
// 'archer' en `affects` es la unidad Arquero (no toda la clase de tiradores) y
// 'siege' es la clase de armas de asedio (no el edificio Taller de Asedio).
const ID_ONLY_TARGETS = new Set(['archer']);
const CLASS_ONLY_TARGETS = new Set(['siege']);

// Clases de la unidad única de castillo de una civ. Se busca por nombre normalizado
// (sin tildes ni mayúsculas) en español, en inglés y con el nombre del árbol del juego.
const normUnitName = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const byNormName = map => Object.fromEntries(Object.entries(map).map(([k, v]) => [normUnitName(k), v]));
const UU_CLASSES_BY_NAME = byNormName(UNIQUE_UNIT_CLASSES);
const UU_EXCLUDES_BY_NAME = byNormName(UNIQUE_UNIT_EXCLUDES);
function uniqueUnitLookup(table, civId) {
  const names = [
    LOCALE.es?.civs?.[civId]?.uniqueUnits?.[0]?.name,
    LOCALE.en?.civs?.[civId]?.uniqueUnits?.[0]?.name,
    CIV_TREES[civId]?.u?.uniqueunit?.n?.en,
    CIV_TREES[civId]?.u?.uniqueunit?.n?.es,
  ];
  for (const n of names) {
    const hit = table[normUnitName(n)];
    if (hit) return hit;
  }
  return [];
}
const uniqueUnitClasses = (civId = currentCiv) => uniqueUnitLookup(UU_CLASSES_BY_NAME, civId);
// Techs de su clase que la UU de castillo no recibe (según la línea "Upgrades" del juego)
const uniqueUnitExcludes = (civId = currentCiv) => uniqueUnitLookup(UU_EXCLUDES_BY_NAME, civId);

// Clases (UNIT_CLASSES + clases de la UU de castillo) a las que pertenece una unidad
function unitClassesOf(unitId) {
  const classes = Object.entries(UNIT_CLASSES).filter(([, ids]) => ids.includes(unitId)).map(([cls]) => cls);
  if (unitId === 'uniqueunit' || unitId === 'eliteunique') classes.push(...uniqueUnitClasses());
  return classes;
}

// Clases base: una unidad pertenece a alguna; los edificios, a ninguna
const UNIT_BASE_CLASSES = ['infantry', 'archer', 'foot_archer', 'mounted', 'mounted_archer', 'cavalry', 'siege', 'navy',
                           'civilians', 'religious', 'skirmishers', 'misc_units', 'gunpowder_soldier'];

// ¿Un destino de `affects` / clave de `unit_mods` incluye a esta unidad?
function techTargetHits(target, unitId, unitClasses) {
  if (target === 'all_units') return unitClasses.some(c => UNIT_BASE_CLASSES.includes(c));
  if (target === unitId) return !CLASS_ONLY_TARGETS.has(target);
  if (ID_ONLY_TARGETS.has(target)) return false;
  return unitClasses.includes(target);
}

function getApplicableTechs(unitId) {
  const unitClasses = unitClassesOf(unitId);
  const uuExcludes = (unitId === 'uniqueunit' || unitId === 'eliteunique') ? uniqueUnitExcludes() : [];
  const applicable = [];
  for (const [techId, entry] of Object.entries(TECHS)) {
    // Civ-specific unique techs (e.g. 'britons_uniquetech1') are not nodes in the tree.
    // They're available only if they belong to the current civ.
    const civMatch = techId.match(/^(.+)_uniquetech[12]$/);
    if (civMatch) {
      if (civMatch[1] !== currentCiv) continue;
    } else if (isMissing(techId) || techId.endsWith('_tech')) continue;  // *_tech: mejoras de edificio (Torre de Guardia…)

    // También se ofrecen las techs sin efecto numérico (Redención, Wootz Steel…):
    // el simulador las lista con su texto en "Otros efectos".
    if (entry.excludes?.includes(unitId) || uuExcludes.includes(techId)) continue;
    if ((entry.affects || []).some(target => techTargetHits(target, unitId, unitClasses))) applicable.push(techId);
  }
  return applicable;
}

// mod efectivo de una tech para una unidad: `mod` + los `unit_mods` que la incluyen
function techModFor(tid, unitId) {
  const entry = TECHS[tid];
  if (!entry) return null;
  if (!entry.unit_mods) return entry.mod || {};
  const unitClasses = unitClassesOf(unitId);
  let mod = { ...(entry.mod || {}) };
  for (const [target, m] of Object.entries(entry.unit_mods)) {
    if (techTargetHits(target, unitId, unitClasses)) mod = { ...mod, ...m };
  }
  return mod;
}

// Claves de mod que el simulador aplica como número (stats o coste)
const NUMERIC_MOD_KEYS = new Set([
  'hp', 'hp_pct', 'attack', 'attack_pct', 'armor_melee', 'armor_pierce', 'range', 'los', 'speed_pct', 'rof_pct',
  'blast_radius', 'attack_speed_pct', 'production_speed_pct', 'watchtower_attack', 'guardtower_attack', 'keep_attack',
  'vs_bonuses', 'cost_pct', 'trade_cost_pct', 'food_cost_pct', 'wood_cost_pct', 'gold_cost_pct', 'stone_cost_pct',
  'replace_gold_with_food', 'replace_gold_with_wood',
]);

// Nombre y texto de efecto de una tech (genérica o única de la civ)
function techInfo(tid) {
  const ut = tid.match(/^(.+)_uniquetech([12])$/);
  if (ut) {
    const lc = LOCALE[currentLang]?.civs?.[ut[1]]?.uniqueTechs?.[ut[2] - 1] || {};
    return { name: lc.name || nodeName(`uniquetech${ut[2]}`), effect: lc.effect || '' };
  }
  return { name: nodeName(tid), effect: LOCALE[currentLang]?.nodes?.[tid]?.effect || '' };
}

// Techs activas cuyo efecto (todo o parte) no se refleja en los números del panel
function nonNumericTechs(activeTechs, unitId, base) {
  const out = [];
  for (const tid of activeTechs) {
    const mod = techModFor(tid, unitId) || {};
    const hasOther = Object.entries(mod).some(([k, v]) => !NUMERIC_MOD_KEYS.has(k) && v !== 0 && v !== false && v != null);
    let changesNumbers = false;
    if (!hasOther && base) {
      const one = new Set([tid]);
      const s = applyTechs(base, one, unitId);
      changesNumbers = ['hp', 'attack', 'range', 'speed', 'rof', 'los', 'train', 'blast_radius'].some(k => s[k] !== base[k])
        || (s.armor?.[0] ?? 0) !== (base.armor?.[0] ?? 0) || (s.armor?.[1] ?? 0) !== (base.armor?.[1] ?? 0)
        || JSON.stringify(s.bonuses || []) !== JSON.stringify(base.bonuses || [])
        || !!applyTechsToCost(simBaseCost, one, unitId);
    }
    if (hasOther || !changesNumbers) out.push(techInfo(tid));
  }
  return out;
}

// Applies active tech cost modifiers to a cost object.
// Returns a modified copy if anything changed, otherwise null.
// Returns the effectiveness multiplier for a tech (e.g. Armenians ×1.4 for _m techs).
function getTechEffectiveness(tid) {
  const civ = getCiv();
  if (!civ?.bonuses) return 1;
  for (const b of civ.bonuses) {
    if (b.type !== 'tech_effectiveness') continue;
    if (b.scope === 'mule_cart_tech' && tid.endsWith('_m')) return b.value ?? 1;
    if (b.scope === 'bloodlines_caravan' && (tid === 'bloodlines' || tid === 'caravan')) return b.value ?? 1;
  }
  return 1;
}

// Returns a copy of mod with all numeric stat/pct values scaled by factor.
function scaleMod(mod, factor) {
  if (factor === 1) return mod;
  const scaled = { ...mod };
  const PCT_KEYS = ['hp_pct', 'attack_pct', 'speed_pct', 'rof_pct', 'attack_speed_pct',
                    'production_speed_pct', 'gather_speed_pct', 'cost_pct', 'gold_cost_pct',
                    'wood_cost_pct', 'food_cost_pct'];
  const FLAT_KEYS = ['hp', 'attack', 'armor_melee', 'armor_pierce', 'range', 'los',
                     'blast_radius', 'carry_capacity'];
  for (const k of PCT_KEYS)  { if (scaled[k] != null) scaled[k] = scaled[k] * factor; }
  for (const k of FLAT_KEYS) { if (scaled[k] != null) scaled[k] = Math.round(scaled[k] * factor); }
  return scaled;
}

function applyTechsToCost(rawCost, activeTechs, unitId = simUnit?.id ?? '') {
  if (!rawCost || activeTechs.size === 0) return null;

  const c = { ...rawCost };
  let modified = false;

  for (const tid of activeTechs) {
    const rawMod = techModFor(tid, unitId);
    if (!rawMod) continue;
    const mod = scaleMod(rawMod, getTechEffectiveness(tid));

    // ── All-resource percentage reduction (cost_pct, trade_cost_pct) ─────────
    const allPct = mod.cost_pct ?? mod.trade_cost_pct;
    if (allPct != null) {
      const mult = 1 + allPct / 100;
      for (const r of ['food', 'wood', 'gold', 'stone']) {
        if (c[r] != null) { c[r] = Math.max(0, Math.round(c[r] * mult)); modified = true; }
      }
    }

    // ── Per-resource percentage reductions ────────────────────────────────────
    if (mod.food_cost_pct  != null && c.food  != null) {
      c.food  = Math.max(0, Math.round(c.food  * (1 + mod.food_cost_pct  / 100))); modified = true;
    }
    if (mod.wood_cost_pct  != null && c.wood  != null) {
      c.wood  = Math.max(0, Math.round(c.wood  * (1 + mod.wood_cost_pct  / 100))); modified = true;
    }
    if (mod.gold_cost_pct  != null && c.gold  != null) {
      c.gold  = Math.max(0, Math.round(c.gold  * (1 + mod.gold_cost_pct  / 100))); modified = true;
    }
    if (mod.stone_cost_pct != null && c.stone != null) {
      c.stone = Math.max(0, Math.round(c.stone * (1 + mod.stone_cost_pct / 100))); modified = true;
    }

    // ── Gold → Food (Magyar Corvinian Army, Malay Forced Levy, Bohemians Hussite Reforms) ─
    if (mod.replace_gold_with_food && c.gold) {
      c.food = (c.food || 0) + c.gold;
      c.gold = 0;
      modified = true;
    }

    // ── Gold → Wood (Persian Kamandaran — gold replaced by approx. equivalent wood) ────────
    if (mod.replace_gold_with_wood && c.gold) {
      c.wood = (c.wood || 0) + c.gold;
      c.gold = 0;
      modified = true;
    }
  }

  return modified ? c : null;
}

function applyTechs(base, activeTechs, unitId = '') {
  const s = {
    hp:           base.hp,
    attack:       base.attack,          // keep undefined for buildings with no attack
    armor:        base.armor ? [...base.armor] : [0, 0],
    range:        base.range,
    speed:        base.speed,
    rof:          base.rof,
    blast_radius: base.blast_radius,    // kept undefined for non-siege units
    los:          base.los,
    train:        base.train,           // training time (seconds); reduced by production_speed_pct
    bonuses:      base.bonuses ? base.bonuses.map(b => ({ ...b })) : undefined,
  };
  for (const tid of activeTechs) {
    const rawMod = techModFor(tid, unitId);
    if (!rawMod) continue;
    const mod = scaleMod(rawMod, getTechEffectiveness(tid));

    // ── Standard stat deltas ────────────────────────────────────────────────
    if (mod.hp)           s.hp       = (s.hp ?? 0) + mod.hp;
    if (mod.hp_pct)       s.hp       = Math.round((s.hp ?? 0) * (1 + mod.hp_pct / 100));
    if (mod.attack_pct)   s.attack   = Math.round((s.attack ?? 0) * (1 + mod.attack_pct / 100));
    if (mod.armor_melee)  s.armor[0] += mod.armor_melee;
    if (mod.armor_pierce) s.armor[1] += mod.armor_pierce;
    if (mod.range  && s.range  !== undefined) s.range  += mod.range;
    if (mod.los    && s.los    !== undefined) s.los    += mod.los;
    if (mod.speed_pct && s.speed !== undefined)
      s.speed = +(s.speed * (1 + mod.speed_pct / 100)).toFixed(2);
    if (mod.rof_pct && s.rof !== undefined)
      s.rof = +(s.rof * (1 + mod.rof_pct / 100)).toFixed(2);
    if (mod.blast_radius != null && s.blast_radius !== undefined)
      s.blast_radius = +(s.blast_radius + mod.blast_radius).toFixed(2);

    // attack_speed_pct: e.g. 20 means attacks 20 % faster → ROF × (1 / 1.20)
    if (mod.attack_speed_pct && s.rof !== undefined)
      s.rof = +(s.rof / (1 + mod.attack_speed_pct / 100)).toFixed(2);

    // production_speed_pct: building works faster → train time / (1 + pct/100)
    if (mod.production_speed_pct && s.train != null)
      s.train = Math.round(s.train / (1 + mod.production_speed_pct / 100));

    // ── Attack: flat (general + tower-specific) ──────────────────────────────
    // General flat attack (archers, siege, navy, etc.)
    if (mod.attack && !mod.watchtower_attack) {
      s.attack = (s.attack ?? 0) + mod.attack;
    }
    // Tower-specific attack from Arrowslits (different bonus per tower tier)
    if (mod.watchtower_attack && unitId === 'watchtower')
      s.attack = (s.attack ?? 0) + mod.watchtower_attack;
    if (mod.guardtower_attack && unitId === 'guardtower')
      s.attack = (s.attack ?? 0) + mod.guardtower_attack;
    if (mod.keep_attack && (unitId === 'keep' || unitId === 'donjon' || unitId === 'krepost'))
      s.attack = (s.attack ?? 0) + mod.keep_attack;

    // ── Attack bonuses vs specific targets (e.g. Sappers for Villagers) ──────
    // Initialise bonuses array if the unit has none so new vs_bonuses can be added
    if (mod.vs_bonuses) {
      if (!s.bonuses) s.bonuses = [];
      for (const vb of mod.vs_bonuses) {
        const existing = s.bonuses.find(b => b.vs === vb.vs);
        if (existing) existing.value += vb.add;
        else s.bonuses.push({ vs: vb.vs, value: vb.add });
      }
    }
  }
  return s;
}

// Applies the teamBonus of each allied civ in simTeamCivs to the given stats.
// Returns modified stats object if anything changed, otherwise null.
function computeTeamBonusStats(stats, unitId, unitAge, trainingBuilding = null) {
  if (simTeamCivs.length === 0 || !stats) return null;
  const m = {
    hp:     stats.hp,
    attack: stats.attack,
    armor:  stats.armor ? [...stats.armor] : [0, 0],
    range:  stats.range,
    speed:  stats.speed,
    rof:    stats.rof,
    blast_radius: stats.blast_radius,
    los:    stats.los,
    train:  stats.train,
    bonuses: stats.bonuses ? stats.bonuses.map(x => ({ ...x })) : undefined,
  };
  let anyChanged = false;
  for (const civId of simTeamCivs) {
    const civ = CIVS[civId];
    if (!civ?.teamBonus) continue;
    const tb = civ.teamBonus;
    if (tb.min_age !== undefined && unitAge < tb.min_age) continue;
    // En building_work_speed el alcance es el edificio que entrena la unidad
    const hits = tb.type === 'building_work_speed'
      ? tb.scope === trainingBuilding
      : bonusScopeIncludes(tb.scope, unitId);
    if (!hits) continue;
    const value = tb.value;
    const apply = (cur, v) => tb.op === 'multiply' ? cur * v : cur + v;
    if (tb.type === 'stat_modifier') {
      if (tb.stat === 'hp'            && m.hp     !== undefined) { m.hp     = Math.round(apply(m.hp ?? 0, value)); anyChanged = true; }
      if (tb.stat === 'attack'        && m.attack !== undefined) { m.attack = Math.round(apply(m.attack ?? 0, value)); anyChanged = true; }
      if (tb.stat === 'armor')        { m.armor = m.armor.map(a => Math.round(apply(a, value))); anyChanged = true; }
      if (tb.stat === 'armor_melee')  { m.armor[0] = Math.round(apply(m.armor[0], value)); anyChanged = true; }
      if (tb.stat === 'armor_pierce') { m.armor[1] = Math.round(apply(m.armor[1], value)); anyChanged = true; }
      if (tb.stat === 'range' && m.range !== undefined) { m.range = +(apply(m.range, value)).toFixed(1); anyChanged = true; }
      if (tb.stat === 'speed' && m.speed !== undefined) { m.speed = +(apply(m.speed, value)).toFixed(2); anyChanged = true; }
      if (tb.stat === 'rof'   && m.rof   !== undefined) { m.rof   = +(apply(m.rof,   value)).toFixed(2); anyChanged = true; }
      if (tb.stat === 'los' && m.los !== undefined) { m.los = Math.round(apply(m.los, value)); anyChanged = true; }
    } else if (tb.type === 'creation_speed' && m.train != null) {
      m.train = Math.round(m.train * value); anyChanged = true;
    } else if (tb.type === 'building_work_speed' && m.train != null && tb.scope === trainingBuilding) {
      m.train = Math.round(m.train / value); anyChanged = true;
    }
  }
  return anyChanged ? m : null;
}

// Recomputes simCivStats / simCivCost / simTeamStats based on the simulator's currently selected age.
// Called on unit open and whenever the age selector or team composition changes.
function recomputeSimCivBonuses() {
  if (!simUnit || !simBaseStats) return;
  simCivStats  = computeCivModifiedStats(simBaseStats, simUnit.id, simMaxAge, simUnit.building ?? null);
  simCivCost   = simBaseCost
    ? computeModifiedCost(simBaseCost, simUnit.id, simMaxAge, 'cost_modifier')
    : null;
  const baseForTeam = simCivStats || simBaseStats;
  simTeamStats = computeTeamBonusStats(baseForTeam, simUnit.id, simMaxAge, simUnit.building ?? null);
}

// Tipos de nodo cuyo panel incluye el simulador
function isSimulableType(n) {
  return n.type === 'unit' || n.type === 'upgrade'
    || n.id === 'uniqueunit' || n.id === 'eliteunique'
    || n.type === 'building' || n.type === 'defencive';
}

// ¿El panel de este nodo va a mostrar el simulador? (mismo criterio que initSim)
function canSimulate(n) {
  return isSimulableType(n) && !!getStatsForNode(n) && getApplicableTechs(n.id).length > 0;
}

function initSim(unitNode) {
  if (simUnit?.id !== unitNode.id) simMaxAge = 3;
  simUnit = unitNode;

  const simEl = document.getElementById('sp-tech-sim');
  if (!simBaseStats || getApplicableTechs(unitNode.id).length === 0) {
    simEl.style.display = 'none';
    return;
  }
  recomputeSimCivBonuses();
  simEl.style.display = 'block';
  updateSimToggleLabel();
  renderSimBody();
}

function updateSimToggleLabel() {
  document.getElementById('sp-sim-toggle-label').textContent = t('simulate');
  document.getElementById('sp-sim-toggle').classList.toggle('open', simExpanded);
}

function renderSimBody() {
  const body = document.getElementById('sp-sim-body');
  if (!simExpanded) { body.style.display = 'none'; return; }
  body.style.display = 'block';

  const applicable = getApplicableTechs(simUnit.id);

  const ageIcons = ['base_dark_age', 'base_feudal_age', 'base_castle_age', 'base_imperial_age'];
  document.querySelectorAll('.sim-age-btn').forEach(btn => {
    const age = parseInt(btn.dataset.age);
    btn.innerHTML = `<img src="img/Ages/${ageIcons[age]}.png" alt=""><span>${t(age, 'ages_short')}</span>`;
    btn.title = t(age, 'ages');
    btn.classList.toggle('sim-age-active', age === simMaxAge);
  });

  const filtered = applicable.filter(techId => {
    const slotKey = techId.replace(/^.+_(uniquetech[12])$/, '$1');
    const node = NODES.find(n => n.id === techId) || NODES.find(n => n.id === slotKey);
    return node ? node.age <= simMaxAge : true;
  });

  const chipsEl = document.getElementById('sp-sim-chips');
  chipsEl.innerHTML = filtered.map(techId => {
    // Civ-specific unique tech IDs (e.g. 'britons_uniquetech1') have no direct
    // IMG_MAP entry — fall back to the generic slot key ('uniquetech1'/'uniquetech2').
    const slotKey = techId.replace(/^.+_(uniquetech[12])$/, '$1');
    const img  = IMG_MAP[techId] || IMG_MAP[slotKey];
    const ut = techId.match(/^(.+)_uniquetech([12])$/);
    const name = ut
      ? (LOCALE[currentLang]?.civs?.[ut[1]]?.uniqueTechs?.[ut[2] - 1]?.name || nodeName(slotKey))
      : nodeName(techId);
    const active = simActiveTechs.has(techId);
    const effect = techInfo(techId).effect;
    const tip = (effect ? `${name} — ${effect}` : name).replace(/"/g, '&quot;');
    return `<button class="sim-tech-chip${active ? ' active' : ''}" data-tech="${techId}" title="${tip}">
      ${img ? `<img src="${img}" alt="${name}">` : `<span class="sim-chip-icon">⚗</span>`}
    </button>`;
  }).join('');

  renderTeamPicker();
  refreshSimStats();
}

// Applies active techs on top of civ/team-modified (or base) stats and updates the main grid
function refreshSimStats() {
  if (!simBaseStats) return;
  const isUnit = simUnit?.type === 'unit' || simUnit?.type === 'upgrade'
    || simUnit?.id === 'uniqueunit' || simUnit?.id === 'eliteunique'
    || simUnit?.type === 'building' || simUnit?.type === 'defencive';

  // Chain: base → civ bonuses → team bonuses → active techs
  const startFrom = simTeamStats || simCivStats || simBaseStats;
  const combined  = simActiveTechs.size > 0
    ? applyTechs(startFrom, simActiveTechs, simUnit?.id ?? '')
    : startFrom;

  const civName    = LOCALE[currentLang]?.civs?.[currentCiv]?.name || currentCiv;
  const teamCount  = simTeamCivs.length;
  const techCount  = simActiveTechs.size;

  let label = null;
  if (simCivStats || simTeamStats || techCount > 0) {
    const parts = [];
    if (simCivStats) parts.push(civName);
    if (teamCount > 0) parts.push(`${teamCount} ${t(teamCount === 1 ? 'ally' : 'allies')}`);
    if (techCount > 0) parts.push(`${techCount} ${t('techs_short')}`);
    if (parts.length > 0) label = `★ ${parts.join(' + ')}`;
  }

  renderStatsGrid(simBaseStats, combined, isUnit, label);
  refreshSimCost();
  renderSimNotes(startFrom);
}

// Techs activas con efectos que no son números (regeneración, conversión, daño de área…)
function renderSimNotes(base) {
  const el = document.getElementById('sp-sim-notes');
  if (!el) return;
  const notes = simUnit && simExpanded ? nonNumericTechs(simActiveTechs, simUnit.id, base) : [];
  el.innerHTML = notes.length
    ? `<div class="sim-notes-title">${t('other_effects')}</div><ul>${notes.map(n =>
        `<li><b>${n.name}</b>${n.effect ? `: ${n.effect}` : ''}</li>`).join('')}</ul>`
    : '';
}

// Rebuilds #sp-cost to reflect both civ bonuses and currently active sim techs.
function refreshSimCost() {
  if (!simUnit) return;
  const n = simUnit;

  // Chain: raw → civ bonus → tech bonus
  const baseCostForTechs = simCivCost || simBaseCost;
  const techCost = applyTechsToCost(baseCostForTechs, simActiveTechs, n.id);
  // Final displayed cost; raw cost is the baseline for strikethrough deltas
  const displayCost = techCost || baseCostForTechs;
  const rawCost     = simBaseCost;

  // Current sim train time (base → civ → team → techs)
  const simStartFrom = simTeamStats || simCivStats || simBaseStats;
  const simCombined  = simActiveTechs.size > 0 ? applyTechs(simStartFrom, simActiveTechs, n.id ?? '') : simStartFrom;
  const simTrainTime = simCombined?.train ?? null;

  let html = '';

  // Build cost (buildings): only civ modifier applies in the sim
  if (n.build_cost) {
    const modBC = computeModifiedCost(n.build_cost, n.id, n.age ?? 0, 'building_cost_modifier');
    html += costRow('build_cost', modBC || n.build_cost, modBC ? n.build_cost : null, n.build_time);
  }

  // Train cost: show final cost vs raw baseline, plus current train time
  if (n.train_cost && (displayCost || rawCost)) {
    html += costRow('train_cost', displayCost || rawCost, rawCost, simTrainTime);
  }

  if (html) document.getElementById('sp-cost').innerHTML = html;
}

function renderTeamPicker() {
  const chipsEl  = document.getElementById('sp-sim-team-chips');
  const countEl  = document.getElementById('sp-sim-team-count');
  const selectEl = document.getElementById('sp-sim-team-select');
  if (!chipsEl || !countEl || !selectEl) return;

  countEl.textContent = `${simTeamCivs.length}/7`;

  chipsEl.innerHTML = simTeamCivs.map(civId => {
    const name   = LOCALE[currentLang]?.civs?.[civId]?.name || civId;
    const tbText = LOCALE[currentLang]?.civs?.[civId]?.teamBonus || '';
    return `<div class="sim-team-chip" title="${tbText}">
      <img src="img/Civs/${civId}.png" class="sim-team-shield" onerror="this.style.display='none'" alt="">
      <span class="sim-team-name">${name}</span>
      <button class="sim-team-remove" data-civ="${civId}" title="${t('remove')}">✕</button>
    </div>`;
  }).join('');

  const excluded = new Set([currentCiv, ...simTeamCivs]);
  selectEl.innerHTML = `<option value="">${t('add_ally')}</option>`;
  Object.keys(CIVS)
    .filter(id => !excluded.has(id))
    .sort((a, b) => (LOCALE[currentLang]?.civs?.[a]?.name || a)
                      .localeCompare(LOCALE[currentLang]?.civs?.[b]?.name || b))
    .forEach(id => {
      const opt = document.createElement('option');
      opt.value = id;
      const name = LOCALE[currentLang]?.civs?.[id]?.name || id;
      const tb   = LOCALE[currentLang]?.civs?.[id]?.teamBonus || '';
      opt.textContent = name;
      if (tb) opt.dataset.sub = tb;  // el desplegable lo muestra como segunda línea
      selectEl.appendChild(opt);
    });
  selectEl.disabled = simTeamCivs.length >= 7;
}

document.getElementById('sp-sim-toggle').addEventListener('click', () => {
  simExpanded = !simExpanded;
  updateSimToggleLabel();
  if (simUnit) renderSimBody();
});

document.getElementById('sp-sim-ages').addEventListener('click', e => {
  const btn = e.target.closest('.sim-age-btn');
  if (!btn) return;
  simMaxAge = parseInt(btn.dataset.age);
  simActiveTechs.forEach(tid => {
    const node = NODES.find(n => n.id === tid);
    if (node && node.age > simMaxAge) simActiveTechs.delete(tid);
  });
  recomputeSimCivBonuses();
  if (simUnit) renderSimBody();
});

document.getElementById('sp-sim-chips').addEventListener('click', e => {
  const chip = e.target.closest('.sim-tech-chip');
  if (!chip) return;
  const techId = chip.dataset.tech;
  if (simActiveTechs.has(techId)) simActiveTechs.delete(techId);
  else simActiveTechs.add(techId);
  chip.classList.toggle('active', simActiveTechs.has(techId));
  refreshSimStats();
});

document.getElementById('sp-sim-team-chips').addEventListener('click', e => {
  const btn = e.target.closest('.sim-team-remove');
  if (!btn) return;
  e.stopPropagation(); // prevent document click from closing stats panel
  simTeamCivs = simTeamCivs.filter(id => id !== btn.dataset.civ);
  recomputeSimCivBonuses();
  renderTeamPicker();
  refreshSimStats();
});

document.getElementById('sp-sim-team-select').addEventListener('change', e => {
  const civId = e.target.value;
  if (!civId || simTeamCivs.includes(civId) || simTeamCivs.length >= 7) return;
  simTeamCivs.push(civId);
  e.target.value = '';
  recomputeSimCivBonuses();
  renderTeamPicker();
  refreshSimStats();
});
