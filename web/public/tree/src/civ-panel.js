// ═══════════════════════════════════════════════════════════
// CIV SELECTOR
// ═══════════════════════════════════════════════════════════

const civSelect = document.getElementById('civ-select');
const civInfo = document.getElementById('civ-info');
const langSelect = document.getElementById('lang-select');

// ── Populate civ <select> from locale ────────────────────────────────────────
function populateCivSelect() {
  const saved = civSelect.value;
  civSelect.innerHTML = '';
  Object.keys(CIVS).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = LOCALE[currentLang]?.civs?.[key]?.name || key;
    civSelect.appendChild(opt);
  });
  civSelect.value = saved || Object.keys(CIVS)[0];
}

// ── Build civ info HTML from locale ──────────────────────────────────────────
function buildCivInfo(civId) {
  const c = CIVS[civId] || CIVS[currentCiv];
  const lc = LOCALE[currentLang]?.civs?.[civId] || {};

  let html = '';
  if (lc.name) html += `<div class="civ-name">${lc.name}</div>`;
  if (lc.type) html += `<div class="civ-type">${lc.type}</div>`;

  // Bonuses from locale
  if (lc.bonuses && lc.bonuses.length) {
    html += `<ul class="bonus-list">`;
    lc.bonuses.forEach(b => { if (b) html += `<li class="bonus-item">${b}</li>`; });
    html += `</ul>`;
  }

  // Unique Units from locale
  if (lc.uniqueUnits && lc.uniqueUnits.length > 0) {
    html += `<div class="civ-section-title">${currentLang === 'es' ? 'Unidad única:' : 'Unique Unit:'}</div>`;
    lc.uniqueUnits.forEach(u => {
      html += `<div class="unique-item">${u.name}${u.subtitle ? ` <span class="unique-subtitle">(${u.subtitle})</span>` : ''}</div>`;
    });
  }

  // Unique Techs from locale
  if (lc.uniqueTechs && lc.uniqueTechs.length > 0) {
    html += `<div class="civ-section-title">${currentLang === 'es' ? 'Tecnologías únicas:' : 'Unique Technologies:'}</div>`;
    lc.uniqueTechs.forEach(tech => {
      html += `<div class="unique-item"><b>${tech.name}</b>: ${tech.effect}</div>`;
    });
  }

  // Team Bonus from locale
  if (lc.teamBonus) {
    html += `<div class="civ-section-title">${currentLang === 'es' ? 'Bono de equipo:' : 'Team Bonus:'}</div>`;
    html += `<div class="team-bonus-box">${lc.teamBonus}</div>`;
  }

  return html;
}

langSelect.value = currentLang;
updateUIStrings();
populateCivSelect();

langSelect.addEventListener('change', () => {
  setLanguage(langSelect.value);
  populateCivSelect();
  civInfo.innerHTML = buildCivInfo(currentCiv);
});

civSelect.addEventListener('change', () => {
  currentCiv = civSelect.value;

  // Reset ally team when main civ changes
  simTeamCivs  = [];
  simTeamStats = null;

  // Update civ shield
  const shield = document.getElementById('civ-shield');
  if (shield) {
    shield.src = `img/Civs/${currentCiv}.png`;
    shield.style.display = 'block';
  }

  civInfo.innerHTML = buildCivInfo(currentCiv);
  render();
  if (viewMode === 'extra') populateExtraPanel();
});

// ═══════════════════════════════════════════════════════════
// ZOOM CONTROLS
// ═══════════════════════════════════════════════════════════

function fitView() {
  const activeBuildings = NODES.filter(n => n.type === 'building').map(b => ({ ...b }));
  const nodes = displayNodes.length ? displayNodes : NODES.filter(n => n.type !== 'building').map(n => ({ ...n }));
  const { totalH, totalW } = computeLayout(nodes, activeBuildings);
  const W = svgEl.clientWidth, H = svgEl.clientHeight;
  // Escalar para que todas las edades quepan verticalmente
  const scale = (H - 20) / totalH;
  lockedTY = 10;
  // Centrar horizontalmente
  const tx = (W - totalW * scale) / 2;
  svgD3.call(zoom.transform, d3.zoomIdentity.translate(tx, lockedTY).scale(scale));
}

document.getElementById('btn-zoom-in').addEventListener('click', () => svgD3.transition().duration(250).call(zoom.scaleBy, 1.4));
document.getElementById('btn-zoom-out').addEventListener('click', () => svgD3.transition().duration(250).call(zoom.scaleBy, 0.7));
document.getElementById('btn-fit').addEventListener('click', fitView);

// ═══════════════════════════════════════════════════════════
// EXTRA PANEL — Unidades Relevantes
// ═══════════════════════════════════════════════════════════

// Keyword patterns (ES) → IDs de nodos afectados por bonus
const BONUS_UNIT_KEYWORDS = [
  {
    re: /milicia.línea|línea.milicia|infant[eé]r[ií]a con espada/i,
    ids: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion']
  },
  {
    re: /lancero|piquero|alabardero/i,
    ids: ['spearman', 'pikeman', 'halberdier']
  },
  {
    re: /infant[eé]r[ií]a(?! con)/i,
    ids: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion', 'spearman', 'pikeman', 'halberdier']
  },
  {
    re: /caballería ligera|húsar|husar/i,
    ids: ['lightcav', 'hussar']
  },
  {
    re: /caballero|paladín/i,
    ids: ['knight', 'cavalier', 'paladin']
  },
  {
    re: /caball[eé]r[ií]a(?! ligera)/i,
    ids: ['scout', 'lightcav', 'hussar', 'knight', 'cavalier', 'paladin']
  },
  {
    re: /camello/i,
    ids: ['camel', 'heavycamel']
  },
  {
    re: /elefante de asedio/i,
    ids: ['armored_elephant', 'siege_elephant']
  },
  {
    re: /elefante.*batalla|elefante.*combate/i,
    ids: ['battleeleph', 'eliteeleph']
  },
  {
    re: /arquero.*elefante|elefante.*arquero/i,
    ids: ['elephant_archer', 'elite_elephant_archer']
  },
  {
    re: /arquero.*caballo|cav.*arquero/i,
    ids: ['cavarcher', 'hcavarcher']
  },
  {
    re: /escaramuzador/i,
    ids: ['skirmisher', 'eliteskirm']
  },
  {
    re: /arquero.*pie|arquero(?!.*caballo)/i,
    ids: ['archer', 'crossbow', 'arbalester']
  },
  {
    re: /ariete/i,
    ids: ['batteringram', 'cappedram', 'siegeram']
  },
  {
    re: /mangonela|onagro/i,
    ids: ['mangonel', 'onager', 'siegeonager']
  },
  {
    re: /escorpión/i,
    ids: ['scorpion', 'heavyscorpion']
  },
  {
    re: /trebuchet/i,
    ids: ['trebuchet']
  },
  {
    re: /taller de asedio|unidades de asedio/i,
    ids: ['batteringram', 'cappedram', 'siegeram', 'mangonel', 'onager', 'siegeonager', 'scorpion', 'heavyscorpion', 'bombcannon']
  },
  {
    re: /brulote|barco.*fuego/i,
    ids: ['firegalley', 'fastfireship']
  },
  {
    re: /barco.*demolición|demolición/i,
    ids: ['demoship', 'heavydemo']
  },
  {
    re: /galera|galeras/i,
    ids: ['galley', 'wargalley', 'galleon']
  },
  {
    re: /barco|nav[ií]o|navíos/i,
    ids: ['galley', 'wargalley', 'galleon', 'firegalley', 'fastfireship', 'demoship', 'heavydemo', 'cannongalleon']
  },
  {
    re: /monje/i,
    ids: ['monk']
  },
  {
    re: /aldeano/i,
    ids: ['villager']
  },
  {
    re: /unidades militares/i,
    ids: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion',
      'spearman', 'pikeman', 'halberdier',
      'archer', 'crossbow', 'arbalester', 'skirmisher', 'eliteskirm',
      'scout', 'lightcav', 'hussar', 'knight', 'cavalier', 'paladin',
      'cavarcher', 'hcavarcher', 'monk']
  },
];

const AGE_NAMES = ['Oscura', 'Feudal', 'Castillos', 'Imperial'];

function getNodeDisplayName(id) {
  const n = NODES.find(x => x.id === id);
  if (!n) return id;
  return tData(n, 'name') || id;
}

// Maps structured bonus scope values to arrays of unit node IDs
const SCOPE_TO_IDS = {
  // ── Economy (no tree nodes → empty, keeps getBonusAffectedUnits clean)
  villager: ['villager'],
  farmer: [], shepherd: [], forager: [],
  lumberjack: [], miner: [], hunter: [],
  fishing_ship: ['fishingship'],
  trade_unit: ['tradecart', 'tradecog'],
  relic: [],
  // ── Military
  military_unit: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion',
    'spearman', 'pikeman', 'halberdier', 'scout', 'lightcav', 'hussar',
    'knight', 'cavalier', 'paladin', 'archer', 'crossbow', 'arbalester',
    'skirmisher', 'eliteskirm', 'cavarcher', 'hcavarcher', 'monk'],
  infantry: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion',
    'spearman', 'pikeman', 'halberdier'],
  sword_infantry: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion'],
  spear_infantry: ['spearman', 'pikeman', 'halberdier'],
  archer: ['archer', 'crossbow', 'arbalester'],
  foot_archer: ['archer', 'crossbow', 'arbalester', 'skirmisher', 'eliteskirm'],
  skirmisher: ['skirmisher', 'eliteskirm'],
  cavalry: ['scout', 'lightcav', 'hussar', 'knight', 'cavalier', 'paladin'],
  cavalry_archer: ['cavarcher', 'hcavarcher'],
  light_cavalry: ['lightcav', 'hussar'],
  knight: ['knight', 'cavalier', 'paladin'],
  camel: ['camelrider', 'heavycamel'],
  gunpowder: ['handcannon', 'bombcannon'],
  monk: ['monk'],
  siege: ['mangonel', 'onager', 'siegeonager', 'scorpion', 'heavyscorpion',
    'batteringram', 'cappedram', 'siegeram', 'trebuchet', 'bombcannon'],
  ship: ['galley', 'wargalley', 'galleon', 'firegalley', 'fireship', 'fastfireship',
    'hulk', 'war_hulk', 'carrack', 'demoraft', 'demoship', 'heavydemo', 'cannongalleon'],
  // Training-building scopes — used by building_work_speed bonuses
  tc:   ['villager'],
  dock: ['galley', 'wargalley', 'galleon', 'firegalley', 'fireship', 'fastfireship',
    'hulk', 'war_hulk', 'carrack', 'demoraft', 'demoship', 'heavydemo', 'cannongalleon'],
};

function getBonusAffectedUnits(civ) {
  if (!Array.isArray(civ.bonuses)) return [];

  // Bonus note text lives in locale (indexed by position, same order as civ.bonuses)
  const lcBonuses = LOCALE[currentLang]?.civs?.[currentCiv]?.bonuses || [];

  const result = [];
  const seen = new Set();

  civ.bonuses.forEach((bonus, idx) => {
    if (typeof bonus !== 'object' || !bonus.scope) return;

    const note = lcBonuses[idx] || '';

    // scope can be a string key, an array of ids, or a free string
    let ids = [];
    if (Array.isArray(bonus.scope)) {
      ids = bonus.scope;
    } else {
      ids = SCOPE_TO_IDS[bonus.scope] || [];
      // fallback: treat scope as a single node ID
      if (!ids.length && bonus.scope) ids = [bonus.scope];
    }

    ids.forEach(id => {
      if (!seen.has(id) && !isMissing(id)) {
        seen.add(id);
        result.push({ id, name: getNodeDisplayName(id), bonus: note });
      }
    });
  });

  return result;
}

function makeEuIcon(id, typeClass) {
  const div = document.createElement('div');
  div.className = `eu-icon ${typeClass}`;
  const src = IMG_MAP[id];
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    div.appendChild(img);
  } else {
    div.textContent = typeClass.includes('tech') ? '🔬' : '⌚';
  }
  return div;
}

function makeAgeBadge(age) {
  const span = document.createElement('span');
  span.className = `eu-age-badge age-b-${age}`;
  span.textContent = AGE_NAMES[age] ?? '';
  return span;
}

function makeCard(iconEl, fields) {
  // fields: [{cls, text}]
  const card = document.createElement('div');
  card.className = 'eu-card';
  card.appendChild(iconEl);
  const info = document.createElement('div');
  info.className = 'eu-info';
  fields.forEach(f => {
    if (f.el) { info.appendChild(f.el); return; }
    if (!f.text) return;
    const d = document.createElement('div');
    d.className = f.cls;
    d.textContent = f.text;
    info.appendChild(d);
  });
  card.appendChild(info);
  return card;
}

function makeSection(titleText) {
  const sec = document.createElement('div');
  sec.className = 'eu-section';
  const h = document.createElement('div');
  h.className = 'eu-section-title';
  h.textContent = titleText;
  sec.appendChild(h);
  return sec;
}

function populateExtraPanel() {
  const civ = getCiv();
  const container = document.getElementById('extra-content');
  if (!container) return;
  container.innerHTML = '';

  // ── 1. Unidades Únicas ──────────────────────────────────
  if (civ.uniqueUnits && civ.uniqueUnits.length > 0) {
    const sec = makeSection('⚔ Unidades Únicas');
    const lcUUs = civLocale(currentCiv).uniqueUnits || [];

    civ.uniqueUnits.forEach((u, i) => {
      const lcU = lcUUs[i] || {};
      const badge = makeAgeBadge(u.age ?? 2);
      const fallbackSub = currentLang === 'es' ? 'Unidad única' : 'Unique unit';
      sec.appendChild(makeCard(makeEuIcon('uniqueunit', 'type-unique'), [
        { cls: 'eu-name', text: lcU.name || '' },
        { cls: 'eu-sub', text: lcU.subtitle || fallbackSub },
        { el: badge },
      ]));
      // Elite
      if (lcU.upgradeName) {
        sec.appendChild(makeCard(makeEuIcon('eliteunique', 'type-elite'), [
          { cls: 'eu-name', text: lcU.upgradeName },
          { cls: 'eu-sub', text: currentLang === 'es' ? 'Versión Elite' : 'Elite Version' },
        ]));
      }
    });

    container.appendChild(sec);
  }

  // ── 2. Tecnologías Únicas ────────────────────────────────
  if (civ.uniqueTechs && civ.uniqueTechs.length > 0) {
    const sec = makeSection('🔬 Tecnologías Únicas');
    const lcTechs = civLocale(currentCiv).uniqueTechs || [];

    civ.uniqueTechs.forEach((tech, i) => {
      const lcT = lcTechs[i] || {};
      const badge = makeAgeBadge(tech.age ?? 2);
      sec.appendChild(makeCard(makeEuIcon('uniquetech1', 'type-tech'), [
        { cls: 'eu-name', text: lcT.name || '' },
        { el: badge },
        { cls: 'eu-cost', text: makeCostStr(tech.cost) },
        { cls: 'eu-effect', text: lcT.effect || '' },
      ]));
    });

    container.appendChild(sec);
  }

  // ── 3. Afectadas por Bonus ───────────────────────────────
  const bonusUnits = getBonusAffectedUnits(civ);
  if (bonusUnits.length > 0) {
    const sec = makeSection('⚡ Afectadas por Bonus');

    bonusUnits.forEach(({ id, name, bonus }) => {
      const n = NODES.find(x => x.id === id);
      const typeClass = n ? `type-${n.type}` : 'type-unit';
      sec.appendChild(makeCard(makeEuIcon(id, typeClass), [
        { cls: 'eu-name', text: name },
        { cls: 'eu-bonus', text: bonus },
      ]));
    });

    container.appendChild(sec);
  }

  // ── Estado vacío ─────────────────────────────────────────
  if (container.children.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'eu-empty';
    empty.textContent = 'Sin datos específicos para esta civilización.';
    container.appendChild(empty);
  }
}

function toggleView() {
  viewMode = viewMode === 'classic' ? 'extra' : 'classic';
  const isExtra = viewMode === 'extra';

  document.body.classList.toggle('mode-extra', isExtra);

  const btn = document.getElementById('btn-toggle-view');
  btn.classList.toggle('active', isExtra);
  btn.textContent = isExtra ? '🗺 Árbol Clásico' : '⚔ Unidades Relevantes';

  if (isExtra) populateExtraPanel();

  // Re-fit una vez terminada la transición CSS
  setTimeout(fitView, 340);
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

// Trigger initial info render
civSelect.dispatchEvent(new Event('change'));

setTimeout(fitView, 50);
window.addEventListener('resize', fitView);
