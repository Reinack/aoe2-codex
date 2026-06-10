// ═══════════════════════════════════════════════════════════
// UI HANDLERS
// ═══════════════════════════════════════════════════════════

// ── Global variables ──────────────────────────────────────
let currentLang = 'es';
let LOCALE = window.LOCALE || {};

// ═══════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════

const tipEl    = document.getElementById('tooltip');
const ttName   = document.getElementById('tt-name');
const ttAge    = document.getElementById('tt-age');
const ttCost   = document.getElementById('tt-cost');
const ttEffect = document.getElementById('tt-effect');
const ttPrereq = document.getElementById('tt-prereq');
const ttMissing= document.getElementById('tt-missing');

function costStr(c) {
  if (!c) return '—';
  const p = [];
  if (c.food)  p.push(`<img src="img/food.png" class="res-icon" alt="Comida"> ${c.food}`);
  if (c.wood)  p.push(`<img src="img/wood.png" class="res-icon" alt="Madera"> ${c.wood}`);
  if (c.gold)  p.push(`<img src="img/gold.png" class="res-icon" alt="Oro"> ${c.gold}`);
  if (c.stone) p.push(`<img src="img/stone.png" class="res-icon" alt="Piedra"> ${c.stone}`);
  return p.join('  ') || (currentLang === 'es' ? 'Gratis' : 'Free');
}

function showTip(ev, n) {
  ttName.textContent   = tData(n, 'name', n.type === 'unit' ? 'units' : 'techs');
  ttAge.textContent    = n.type === 'building' ? t('building') : `${t(n.age, 'ages')} · ${t(n.type)}`;
  // Costes
  const costs = [];
  if (n.build_cost)    costs.push(`<strong>${t('build_cost')}:</strong> ${costStr(n.build_cost)}`);
  if (n.research_cost) costs.push(`<strong>${t('research_cost')}:</strong> ${costStr(n.research_cost)}`);
  if (n.train_cost)    costs.push(`<strong>${t('train_cost')}:</strong> ${costStr(n.train_cost)}`);
  if (n.cost)          costs.push(`<strong>${t('cost')}:</strong> ${costStr(n.cost)}`);

  ttCost.innerHTML = costs.join('<br>') || '—';
  ttEffect.textContent = tData(n, 'effect');
  const prereqNames    = (n.prereqs || []).map(pid => {
    const p = displayNodes.find(x => x.id === pid) || BUILDINGS.find(b => b.id === pid);
    if (!p) return pid;
    if (p.id in LOCALE[currentLang].buildings) return t(p.id, 'buildings');
    return tData(p, 'name', p.type === 'unit' ? 'units' : 'techs');
  });
  ttPrereq.textContent = prereqNames.length ? `${t('prereq')}: ${prereqNames.join(', ')}` : '';
  ttMissing.textContent = isMissing(n.id) ? `⚠ ${t('missing')}` : '';
  
  // ── Stats ──────────────────
  let stats = UNIT_STATS[n.id] || REGIONAL_UNIT_STATS[n.id] || UNIQUE_UNIT_STATS[n.id];

  // Lookup for unique units (stats keyed by Spanish name)
  if (n.id === 'uniqueunit' || n.id === 'eliteunique') {
    const civ = getCiv();
    if (civ.uniqueUnits && civ.uniqueUnits.length > 0) {
      const lcUU = LOCALE['es']?.civs?.[currentCiv]?.uniqueUnits?.[0] || {};
      const lookupKey = n.id === 'uniqueunit'
        ? (lcUU.name || '')
        : (lcUU.upgradeName || (lcUU.name ? lcUU.name + ' Elite' : ''));
      stats = UNIQUE_UNIT_STATS[lookupKey];
    }
  }

  const statsContainer = document.getElementById('tt-stats-container') || createStatsContainer();
  
  if (stats && (n.type === 'unit' || n.type === 'unique')) {
    statsContainer.style.display = 'block';
    statsContainer.innerHTML = `
      <div class="tt-stats-grid">
        <div class="tt-stat-item">${statIcon('hp')} <span class="stat-val">${stats.hp}</span></div>
        <div class="tt-stat-item">${statIcon('attack')} <span class="stat-val">${stats.attack}</span></div>
        <div class="tt-stat-item">${statIcon('armor')} <span class="stat-val">${stats.armor[0]}</span></div>
        <div class="tt-stat-item">${statIcon('parmor')} <span class="stat-val">${stats.armor[1]}</span></div>
        ${stats.range ? `<div class="tt-stat-item">${statIcon('range')} <span class="stat-val">${stats.range}</span></div>` : ''}
        <div class="tt-stat-item">${statIcon('speed')} <span class="stat-val">${stats.speed}</span></div>
        ${stats.rof ? `<div class="tt-stat-item">${statIcon('rof')} <span class="stat-val">${stats.rof}s</span></div>` : ''}
      </div>
    `;
  } else {
    statsContainer.style.display = 'none';
  }

  tipEl.style.display  = 'block';
  moveTip(ev);
}

function createStatsContainer() {
  const div = document.createElement('div');
  div.id = 'tt-stats-container';
  div.className = 'tt-stats-container';
  tipEl.appendChild(div);
  return div;
}

function hideTip()  { tipEl.style.display = 'none'; }
function moveTip(ev) {
  const x = ev.clientX + 16, y = ev.clientY - 10;
  tipEl.style.left = `${Math.min(x, window.innerWidth  - 340)}px`;
  tipEl.style.top  = `${Math.min(y, window.innerHeight - 220)}px`;
}

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
      const key  = n.id === 'uniqueunit'
        ? (lcUU.name || '')
        : (lcUU.upgradeName || (lcUU.name ? lcUU.name + ' Elite' : ''));
      stats = UNIQUE_UNIT_STATS[key];
    }
  } else {
    stats = UNIT_STATS[n.id] || REGIONAL_UNIT_STATS[n.id] || UNIQUE_UNIT_STATS[n.id] || n.stats;
  }
  return stats;
}

const STAT_ICONS = {
  hp:            'img/Icon/hp.webp',
  attack:        'img/Icon/attack.webp',
  armor:         'img/Icon/armor.webp',
  parmor:        'img/Icon/pierce_armor.webp',
  range:         'img/Icon/range.webp',
  speed:         'img/Icon/speed.webp',
  rof:           'img/Icon/reload.webp',
  pierce_attack: 'img/Icon/pierce_attack.webp',
  garrison:      'img/Icon/garrison.webp',
  los:           'img/Icon/los.webp',
};

function statIcon(key) {
  const src = STAT_ICONS[key];
  if (src) return `<img src="${src}" class="stat-img-icon" alt="${key}">`;
  return key;
}

function statRow(icon, label, val, sub) {
  return `<div class="sp-stat-row">
    <span class="sp-stat-icon">${icon}</span>
    <span class="sp-stat-label">${label}</span>
    <span class="sp-stat-val">${val}</span>
    ${sub ? `<span class="sp-stat-sub">${sub}</span>` : ''}
  </div>`;
}

function showStatsPanel(ev, n) {
  // Icon and name
  const iconEl = document.getElementById('sp-icon');
  const imgSrc = n.imgPath || IMG_MAP[n.id];
  if (imgSrc) {
    iconEl.src = imgSrc;
    iconEl.style.display = 'block';
  } else {
    iconEl.style.display = 'none';
  }
  document.getElementById('sp-name').textContent = tData(n, 'name', n.type === 'unit' ? 'units' : 'techs');
  document.getElementById('sp-sub').textContent = n.variant ? t(n.variant) : '';

  // Cost and effect
  const costLines = [];
  if (n.build_cost)    costLines.push(`<strong>${t('build_cost')}:</strong> ${costStr(n.build_cost)}`);
  if (n.research_cost) costLines.push(`<strong>${t('research_cost')}:</strong> ${costStr(n.research_cost)}`);
  if (n.train_cost)    costLines.push(`<strong>${t('train_cost')}:</strong> ${costStr(n.train_cost)}`);
  if (n.cost)          costLines.push(`<strong>${t('cost')}:</strong> ${costStr(n.cost)}`);

  document.getElementById('sp-cost').innerHTML = costLines.join('<br>');
  document.getElementById('sp-effect').innerHTML = `<strong>${t('effect')}:</strong> ${tData(n, 'effect')}`;

  // Stats grid
  const stats = getStatsForNode(n);
  const gridEl = document.getElementById('sp-stats-grid');
  const noStatsEl = document.getElementById('sp-no-stats');

  if (!stats) {
    gridEl.innerHTML = '';
    noStatsEl.textContent = 'No hay estadísticas de combate disponibles';
  } else {
    noStatsEl.textContent = '';
    const grid = [];
    grid.push(statRow(statIcon('hp'), 'Salud', stats.hp || '—'));
    if (stats.attack !== undefined) grid.push(statRow(statIcon('attack'), 'Ataque', stats.attack));
    grid.push(statRow(statIcon('armor'), 'Armadura mele', (stats.armor) ? stats.armor[0] : '—'));
    grid.push(statRow(statIcon('parmor'), 'Armadura perfo.', (stats.armor) ? stats.armor[1] : '—'));
    if (stats.range)  grid.push(statRow(statIcon('range'), 'Alcance', stats.range));
    if (stats.speed)  grid.push(statRow(statIcon('speed'), 'Velocidad', stats.speed));
    if (stats.rof)    grid.push(statRow(statIcon('rof'), 'Cadencia', `${stats.rof}s`));
    if (stats.los)    grid.push(statRow(statIcon('los'), 'Visión', stats.los));
    if (stats.train)  grid.push(statRow(statIcon('rof'), n.type === 'unit' ? 'Entrenamiento' : 'Tiempo', `${stats.train}s`));
    gridEl.innerHTML = grid.join('');
  }

  statsPanel.style.display = 'block';
}

// ═══════════════════════════════════════════════════════════
// CIV SELECTOR
// ═══════════════════════════════════════════════════════════

// ── Populate civ <select> from locale ───────────────────────────────────────
function populateCivSelect() {
  const select = document.getElementById('civ-select');
  select.innerHTML = '';
  const civList = Object.keys(CIVS).sort((a,b) => {
    const na = LOCALE[currentLang]?.civs?.[a]?.name || a;
    const nb = LOCALE[currentLang]?.civs?.[b]?.name || b;
    return na.localeCompare(nb);
  });
  civList.forEach(civId => {
    const opt = document.createElement('option');
    opt.value = civId;
    opt.textContent = LOCALE[currentLang]?.civs?.[civId]?.name || civId;
    if (civId === currentCiv) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', e => {
    currentCiv = e.target.value;
    updateUniqueForCiv();
    render();
    buildCivInfo();
  });
}

// ── Build civ info HTML from locale ──────────────────────────────────────────
function buildCivInfo(civId) {
  const civ = CIVS[civId ?? currentCiv];
  const lc  = civLocale(civId ?? currentCiv);
  const infoEl = document.getElementById('civ-info');
  infoEl.innerHTML = '';

  // Unique units
  if (civ.uniqueUnits && civ.uniqueUnits.length > 0) {
    const uuDiv = document.createElement('div');
    uuDiv.className = 'civ-section';
    uuDiv.innerHTML = `<h4>${t('unique_units')}</h4>`;
    civ.uniqueUnits.forEach((uu, idx) => {
      const lcUU = lc.uniqueUnits?.[idx] || {};
      const div = document.createElement('div');
      div.className = 'civ-unit';
      div.innerHTML = `
        <div class="civ-unit-name">${lcUU.name || uu.name}</div>
        <div class="civ-unit-desc">${lcUU.description || ''}</div>
      `;
      uuDiv.appendChild(div);
    });
    infoEl.appendChild(uuDiv);
  }

  // Unique techs
  if (civ.uniqueTechs && civ.uniqueTechs.length > 0) {
    const utDiv = document.createElement('div');
    utDiv.className = 'civ-section';
    utDiv.innerHTML = `<h4>${t('unique_techs')}</h4>`;
    civ.uniqueTechs.forEach((ut, idx) => {
      const lcUT = lc.uniqueTechs?.[idx] || {};
      const div = document.createElement('div');
      div.className = 'civ-tech';
      div.innerHTML = `
        <div class="civ-tech-name">${lcUT.name || ut.name}</div>
        <div class="civ-tech-desc">${lcUT.effect || ut.effect}</div>
      `;
      utDiv.appendChild(div);
    });
    infoEl.appendChild(utDiv);
  }

  // Team bonus
  if (lc.team_bonus) {
    const tbDiv = document.createElement('div');
    tbDiv.className = 'civ-section';
    tbDiv.innerHTML = `<h4>${t('team_bonus')}</h4><p>${lc.team_bonus}</p>`;
    infoEl.appendChild(tbDiv);
  }

  // Civilization bonus
  if (lc.civilization_bonus) {
    const cbDiv = document.createElement('div');
    cbDiv.className = 'civ-section';
    cbDiv.innerHTML = `<h4>${t('civilization_bonus')}</h4><p>${lc.civilization_bonus}</p>`;
    infoEl.appendChild(cbDiv);
  }
}

// ═══════════════════════════════════════════════════════════
// ZOOM CONTROLS
// ═══════════════════════════════════════════════════════════

function fitView() {
  const svgEl = document.getElementById('svg-tree');
  const svgWidth = svgEl.clientWidth || 800;
  const svgHeight = svgEl.clientHeight || 600;
  const t = d3.zoomIdentity.translate(0, 10).scale(0.5); // Default fit
  d3.select(svgEl).call(d3.zoom().transform, t);
}

// Bind zoom controls
document.getElementById('btn-zoom-in').addEventListener('click', () => {
  const svgEl = document.getElementById('svg-tree');
  const t = d3.zoomTransform(svgEl);
  d3.select(svgEl).call(d3.zoom().scaleBy, 1.2, [svgEl.clientWidth / 2, svgEl.clientHeight / 2]);
});
document.getElementById('btn-zoom-out').addEventListener('click', () => {
  const svgEl = document.getElementById('svg-tree');
  const t = d3.zoomTransform(svgEl);
  d3.select(svgEl).call(d3.zoom().scaleBy, 0.8, [svgEl.clientWidth / 2, svgEl.clientHeight / 2]);
});
document.getElementById('btn-fit').addEventListener('click', fitView);

// ═══════════════════════════════════════════════════════════
// EXTRA PANEL — Unidades Relevantes
// ═══════════════════════════════════════════════════════════

// Keyword patterns (ES) → IDs de nodos afectados por bonus
const RELEVANT_PATTERNS = {
  'caballería': ['knight', 'cavalier', 'paladin', 'scout', 'lightcav', 'hussar', 'camel', 'heavycamel', 'battleeleph', 'eliteeleph', 'steppe_lancer', 'elite_steppe_lancer', 'winged_hussar', 'savar', 'xolotl_warrior', 'heavy_hei_guang', 'shrivamsha', 'elite_shrivamsha', 'camel_scout', 'imp_camel', 'cavarcher', 'hcavarcher', 'elephant_archer', 'elite_elephant_archer', 'imp_skirmisher', 'bolas_rider', 'xianbei_raider'],
  'infantería': ['militia', 'manatarms', 'longsword', 'twohanded', 'champion', 'spearman', 'pikeman', 'halberdier', 'legionary', 'flemish_militia', 'jian_swordsman', 'temple_guard', 'ibirapema', 'condottiero', 'huskarl_b'],
  'arqueros': ['archer', 'crossbow', 'arbalester', 'skirmisher', 'eliteskirm', 'handcannon', 'cavarcher', 'hcavarcher', 'elephant_archer', 'elite_elephant_archer', 'grenadier', 'imp_skirmisher', 'bolas_rider', 'xianbei_raider', 'slinger', 'genitour'],
  'asedio': ['batteringram', 'cappedram', 'siegeram', 'mangonel', 'onager', 'siegeonager', 'scorpion', 'heavyscorpion', 'bombcannon', 'houfnice', 'traction_treb', 'mounted_treb', 'rocket_cart', 'heavy_rocket_cart', 'flaming_camel', 'armored_elephant', 'siege_elephant', 'war_chariot_s'],
  'monjes': ['monk', 'redemption', 'atonement', 'heresy', 'sanctity', 'fervor', 'herbalmedicine', 'illumination', 'blockprinting', 'theocracy', 'faith', 'warrior_priest', 'missionary'],
  'marina': ['fishingship', 'transportship', 'tradecog', 'galley', 'wargalley', 'galleon', 'firegalley', 'fireship', 'fastfireship', 'hulk', 'war_hulk', 'carrack', 'demoraft', 'demoship', 'heavydemo', 'cannongalleon', 'elitecannon', 'drydock', 'shipwright', 'fishing_lines', 'gillnets', 'medium_warships', 'heavy_warships', 'dragon_ship', 'dromon', 'lou_chuan', 'catapult_gall', 'turtle_ship', 'longboat', 'caravel_d', 'thirisadai'],
  'defensa': ['outpost', 'watchtower', 'guardtower_b', 'keep_b', 'bombardtower_b', 'palisadewall', 'palisadegate', 'stonewall', 'gate', 'fortifiedwall_b', 'castle', 'krepost', 'donjon', 'hoardings', 'conscription', 'sappers'],
  'economía': ['villager', 'loom', 'wheelbarrow', 'townwatch', 'handcart', 'townpatrol', 'horsecollar', 'heavyplow', 'croprotation', 'folwark', 'mule_cart', 'doublebitaxe', 'bowsaw', 'twomansaw', 'goldmining', 'goldshaft', 'stonemining', 'stoneshaft', 'tahsili', 'doublebitaxe_t', 'bowsaw_t', 'twomansaw_t', 'goldmining_t', 'goldshaft_t', 'stonemining_t', 'stoneshaft_t', 'mill', 'lumber', 'mining', 'market', 'tradecart', 'coinage', 'banking', 'guilds', 'feitoria', 'caravanserai'],
  'tecnología': ['forging', 'ironcasting', 'blastfurnace', 'scalemailarmor', 'chainmailarmor', 'platemailarmor', 'paddedarcharmor', 'leatherarcharmor', 'ringarcherarmor', 'scalebarding', 'chainbarding', 'platebarding', 'fletching', 'bodkinarrow', 'bracer', 'bloodlines', 'husbandry', 'masonry', 'architecture', 'ballistics', 'chemistry', 'murderhole', 'siegeengineers', 'treadmillcrane', 'heatedshot', 'careening', 'clinker_construction', 'carvel_hull', 'siphons', 'incendiaries', 'thumbring', 'parthian'],
};

// Maps structured bonus scope values to arrays of unit node IDs
function getBonusAffectedUnits(civ) {
  const affected = new Set();
  if (civ.bonuses) {
    civ.bonuses.forEach(bonus => {
      if (bonus.scope) {
        bonus.scope.forEach(scope => {
          if (RELEVANT_PATTERNS[scope]) {
            RELEVANT_PATTERNS[scope].forEach(id => affected.add(id));
          }
        });
      }
    });
  }
  return Array.from(affected);
}

function makeEuIcon(id, typeClass) {
  const imgSrc = IMG_MAP[id];
  if (imgSrc) {
    return `<img src="${imgSrc}" class="eu-icon ${typeClass}" alt="${id}">`;
  } else {
    return `<div class="eu-icon ${typeClass}">${id}</div>`;
  }
}

function makeCostStr(cost) {
  if (!cost) return '';
  const parts = [];
  if (cost.food) parts.push(`🌾${cost.food}`);
  if (cost.wood) parts.push(`🪵${cost.wood}`);
  if (cost.gold) parts.push(`💰${cost.gold}`);
  if (cost.stone) parts.push(`🪨${cost.stone}`);
  return parts.join(' ');
}

function makeAgeBadge(age) {
  const ageNames = ['Oscura', 'Feudal', 'Castillos', 'Imperial'];
  return `<span class="eu-age-badge age-${age}">${ageNames[age]}</span>`;
}

function makeCard(iconEl, fields) {
  return `
    <div class="eu-card">
      <div class="eu-header">
        ${iconEl}
        <div class="eu-fields">${fields.join('')}</div>
      </div>
    </div>
  `;
}

function makeSection(titleText) {
  return `<div class="eu-section"><h3 class="eu-section-title">${titleText}</h3><div class="eu-cards"></div></div>`;
}

function populateExtraPanel() {
  const panel = document.getElementById('extra-content');
  panel.innerHTML = '';

  const civ = getCiv();
  const affectedUnits = getBonusAffectedUnits(civ);
  if (affectedUnits.length === 0) {
    panel.innerHTML = '<p>No hay unidades relevantes para esta civilización.</p>';
    return;
  }

  // Group by age
  const byAge = {};
  affectedUnits.forEach(id => {
    const node = displayNodes.find(n => n.id === id);
    if (node) {
      if (!byAge[node.age]) byAge[node.age] = [];
      byAge[node.age].push(node);
    }
  });

  // Sort ages
  Object.keys(byAge).sort().forEach(age => {
    const ageNum = parseInt(age);
    const section = makeSection(`${t(ageNum, 'ages')} (${byAge[age].length})`);
    panel.insertAdjacentHTML('beforeend', section);

    const cardsEl = panel.lastElementChild.querySelector('.eu-cards');
    byAge[age].forEach(node => {
      const iconEl = makeEuIcon(node.id, `n-${node.type}`);
      const fields = [
        `<div class="eu-name">${tData(node, 'name', node.type === 'unit' ? 'units' : 'techs')}</div>`,
        makeAgeBadge(node.age),
        `<div class="eu-cost">${makeCostStr(node.cost)}</div>`
      ];
      const card = makeCard(iconEl, fields);
      cardsEl.insertAdjacentHTML('beforeend', card);
    });
  });
}

// Bind toggle view
document.getElementById('btn-toggle-view').addEventListener('click', toggleView);

function toggleView() {
  const extra = document.getElementById('extra-panel');
  const btn = document.getElementById('btn-toggle-view');
  if (extra.style.display === 'none' || extra.style.display === '') {
    extra.style.display = 'block';
    btn.textContent = '⚔ Ocultar Unidades Relevantes';
  } else {
    extra.style.display = 'none';
    btn.textContent = '⚔ Unidades Relevantes';
  }
}

// Expose globals
window.costStr = costStr;
window.showTip = showTip;
window.createStatsContainer = createStatsContainer;
window.hideTip = hideTip;
window.moveTip = moveTip;
window.closeStatsPanel = closeStatsPanel;
window.getStatsForNode = getStatsForNode;
window.statRow = statRow;
window.showStatsPanel = showStatsPanel;
window.populateCivSelect = populateCivSelect;
window.buildCivInfo = buildCivInfo;
window.fitView = fitView;
window.getBonusAffectedUnits = getBonusAffectedUnits;
window.makeEuIcon = makeEuIcon;
window.makeCostStr = makeCostStr;
window.makeAgeBadge = makeAgeBadge;
window.makeCard = makeCard;
window.makeSection = makeSection;
window.populateExtraPanel = populateExtraPanel;
window.currentLang = currentLang;