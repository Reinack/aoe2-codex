// ═══════════════════════════════════════════════════════════
// CIV SELECTOR
// ═══════════════════════════════════════════════════════════

const civSelect = document.getElementById('civ-select');
const civInfo = document.getElementById('civ-info');
const langSelect = document.getElementById('lang-select');

// Desplegables de papiro (el <select> nativo sigue siendo la fuente de verdad)
const civIcon = civ => `img/Civs/${civ}.png`;
enhanceSelect(civSelect, { icon: civIcon });
enhanceSelect(langSelect);
enhanceSelect(document.getElementById('sp-sim-team-select'), { icon: civIcon });

// ── Populate civ <select> from locale ────────────────────────────────────────
function populateCivSelect() {
  const saved = civSelect.value;
  civSelect.innerHTML = '';
  const civName = key => LOCALE[currentLang]?.civs?.[key]?.name || key;
  Object.keys(CIVS)
    .sort((a, b) => civName(a).localeCompare(civName(b), currentLang))
    .forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = civName(key);
      civSelect.appendChild(opt);
    });
  civSelect.value = saved || civSelect.options[0].value;
}

// ── Ficha de la civ (barra lateral) ──────────────────────────────────────────
function iconTile(src, cls) {
  return `<span class="civ-icon ${cls}">${src ? `<img src="${src}" alt="">` : ''}</span>`;
}

// Id de una UU secundaria (Cuartel, Establo, Muelle…): se busca por nombre entre
// las unidades únicas del árbol de la civ que no son el slot del Castillo.
function secondaryUnit(civId, name) {
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[^a-z ]/g, '');
  const stems = norm(name).split(' ').filter(w => w.length > 3).map(w => w.slice(0, 5));
  let best = null, bestScore = 0;
  CIV_TREES[civId].b.forEach(b => (b.g || []).forEach(row => row.forEach(cell => {
    if (!cell || cell[2] !== 'QU' || CIV_SLOT_IDS.has(cell[0]) || cell[0].startsWith('elite_')) return;
    const words = [LOCALE[currentLang]?.nodes?.[cell[0]]?.name, UP_NODES[cell[0]]?.n?.es, UP_NODES[cell[0]]?.n?.en]
      .flatMap(n => norm(n).split(' '));
    const score = stems.filter(st => words.some(w => w.startsWith(st))).length;
    if (score > bestScore) { bestScore = score; best = cell[0]; }
  })));
  return best;
}

function buildCivInfo(civId) {
  const lc = LOCALE[currentLang]?.civs?.[civId] || {};
  const slots = CIV_TREES[civId]?.u || {};

  let html = '';
  if (lc.name) html += `<div class="civ-name">${lc.name}</div>`;
  if (lc.type) html += `<div class="civ-type">${lc.type}</div>`;

  if (lc.bonuses?.length) {
    html += `<ul class="bonus-list">${lc.bonuses.map((b, i) => b ? `<li class="bonus-item" data-link="line:${i}">${b}</li>` : '').join('')}</ul>`;
  }

  if (lc.uniqueUnits?.length) {
    html += `<div class="civ-section-title">${t(lc.uniqueUnits.length > 1 ? 'unique_units' : 'unique_unit')}</div>`;
    lc.uniqueUnits.forEach((u, i) => {
      const sec = i === 0 ? null : secondaryUnit(civId, u.name);
      const icon = i === 0 ? slots.uniqueunit?.pic : UP_NODES[sec]?.pic;
      const link = i === 0 ? 'uniqueunit' : sec;
      html += `<div class="civ-unique"${link ? ` data-link="node:${link}"` : ''}>${iconTile(icon, 'is-unit')}<div class="civ-unique-text">
        <div class="civ-unique-name">${u.name}</div>
        ${u.subtitle ? `<div class="civ-unique-sub">${u.subtitle}</div>` : ''}
      </div></div>`;
    });
  }

  if (lc.uniqueTechs?.length) {
    html += `<div class="civ-section-title">${t('unique_techs')}</div>`;
    lc.uniqueTechs.forEach((tech, i) => {
      html += `<div class="civ-unique" data-link="node:uniquetech${i + 1}">${iconTile(slots[`uniquetech${i + 1}`]?.pic, 'is-tech')}<div class="civ-unique-text">
        <div class="civ-unique-name">${tech.name}</div>
        <div class="civ-unique-desc">${tech.effect}</div>
      </div></div>`;
    });
  }

  if (lc.teamBonus) {
    html += `<div class="civ-section-title">${t('team_bonus')}</div>`;
    html += `<div class="team-bonus-box" data-link="team">${lc.teamBonus}</div>`;
  }

  return html;
}

// ═══════════════════════════════════════════════════════════
// BARRA LATERAL ↔ ÁRBOL (hover y selección)
// ═══════════════════════════════════════════════════════════
// Cada ítem de la ficha lleva data-link:
//   node:<id>  → UU / tecnología única: hover = ruta + tooltip; click = seleccionar
//   line:<n>   → texto de bonus n: hover = resalta lo afectado; click = fijarlo
//   team       → bono de equipo (igual que line)

// Rol del aldeano → nodos donde se nota el bonus
const VILLAGER_ROLE_NODES = {
  farmer: ['farm', 'mill'], shepherd: ['mill'], forager: ['mill'], hunter: ['mill'],
  lumberjack: ['lumber'], miner: ['mining'], gold_miner: ['mining'], stone_miner: ['mining'],
  fisher: ['fishingship', 'fishtrap'], fisherman: ['fishingship', 'fishtrap'], builder: [],
};
const SCOPE_CLASS_ALIAS = { cavalry_archer: 'mounted_archer' };

// Ids de nodo afectados por un bonus estructurado de civ
function bonusTargetIds(b) {
  if (!b) return [];
  if (Array.isArray(b.techs)) return b.techs;
  const scope = b.scope;
  if (Array.isArray(scope)) return scope;
  if (!scope) return [];
  if (b.type === 'tech_cost_modifier') {
    return displayNodes.filter(n => n.research_cost && techCostScopeMatches(scope, n)).map(n => n.id);
  }
  const ids = VILLAGER_ROLE_NODES[scope] ? ['villager', ...VILLAGER_ROLE_NODES[scope]]
    : CIV_BONUS_SCOPE_MAP[scope]?.() || UNIT_CLASSES[scope] || SCOPE_TO_IDS[scope] || [scope];
  // La UU del Castillo entra si su clase coincide con el alcance del bonus
  return uniqueUnitClasses().includes(SCOPE_CLASS_ALIAS[scope] || scope) ? [...ids, 'uniqueunit', 'eliteunique'] : ids;
}

function nodeKeysFor(ids) {
  const set = new Set(ids);
  return displayNodes.filter(n => set.has(n.id) && n.available).map(n => n.key);
}

function linkKeys(link) {
  const civ = getCiv();
  if (link === 'team') return nodeKeysFor(bonusTargetIds(civ.teamBonus));
  if (link.startsWith('line:')) {
    const line = Number(link.slice(5));
    return nodeKeysFor((civ.bonuses || []).flatMap((b, i) =>
      (b.line !== undefined ? b.line : i) === line ? bonusTargetIds(b) : []));
  }
  const id = link.slice(5);
  const found = displayNodes.filter(n => n.id === id);
  const pick = found.find(n => n.key.startsWith('castle:')) || found[0];
  return pick ? [pick.key] : [];
}

let pinnedEl = null;

// Recalcula qué ítems de la ficha apuntan a nodos del árbol actual
function refreshSidebarLinks() {
  pinnedEl = null;
  civInfo.querySelectorAll('[data-link]').forEach(el => {
    el._keys = linkKeys(el.dataset.link);
    const linked = el._keys.length > 0;
    const isNode = el.dataset.link.startsWith('node:');
    el.classList.toggle('is-linked', linked);
    el.classList.remove('pinned', 'selected', 'tree-hover');
    if (linked) {
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      if (!isNode) {
        el.dataset.count = el._keys.length;
        el.title = t('bonus_hint');
      }
    } else {
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
      el.removeAttribute('title');
    }
  });
  sidebarReflectSelection(selectedKey);
}

function setNodesClass(keys, cls, on) { keys.forEach(k => nodeEls.get(k)?.classed(cls, on)); }

// Punto de anclaje para tooltip/panel: a la derecha de la barra lateral, a la altura del ítem
function sidebarAnchor(el) {
  const r = el.getBoundingClientRect();
  return { clientX: document.getElementById('sidebar').getBoundingClientRect().right - 10, clientY: r.top };
}

function previewLink(el, on) {
  const keys = el._keys || [];
  if (el.dataset.link.startsWith('node:')) {
    highlightPath(keys[0], on);
    if (on) showTip(sidebarAnchor(el), displayNodes.find(d => d.key === keys[0]));
    else hideTip();
  } else {
    root.classed('path-active', on);
    setNodesClass(keys, 'hl', on);
  }
}

function pinLink(el) {
  if (pinnedEl) {
    pinnedEl.classList.remove('pinned');
    setNodesClass(pinnedEl._keys, 'pinned', false);
  }
  pinnedEl = el;
  root.classed('pin-active', !!el);
  if (el) {
    el.classList.add('pinned');
    setNodesClass(el._keys, 'pinned', true);
  }
}

function activateLink(el, ev) {
  if (el.dataset.link.startsWith('node:')) {
    ev.stopPropagation();  // el click no debe cerrar el panel que se abre acá
    previewLink(el, false);
    const n = displayNodes.find(d => d.key === el._keys[0]);
    setSelectedNode(n.key);
    showStatsPanel(sidebarAnchor(el), n);
  } else {
    pinLink(pinnedEl === el ? null : el);
    if (!pinnedEl) return;
  }
  panToKeys(el._keys);
}

// Árbol → ficha: al pasar por un nodo se marcan los ítems que lo incluyen
function sidebarReflectHover(key, on) {
  civInfo.querySelectorAll('[data-link].is-linked').forEach(el => {
    if (el._keys.includes(key)) el.classList.toggle('tree-hover', on);
  });
}

function sidebarReflectSelection(key) {
  civInfo.querySelectorAll('[data-link^="node:"]').forEach(el => {
    el.classList.toggle('selected', !!key && el._keys?.[0] === key);
  });
}

civInfo.addEventListener('mouseover', ev => {
  const el = ev.target.closest('[data-link].is-linked');
  if (el && !el.contains(ev.relatedTarget)) previewLink(el, true);
});
civInfo.addEventListener('mouseout', ev => {
  const el = ev.target.closest('[data-link].is-linked');
  if (el && !el.contains(ev.relatedTarget)) previewLink(el, false);
});
civInfo.addEventListener('focusin', ev => {
  if (ev.target.matches('[data-link].is-linked')) previewLink(ev.target, true);
});
civInfo.addEventListener('focusout', ev => {
  if (ev.target.matches('[data-link].is-linked')) previewLink(ev.target, false);
});
civInfo.addEventListener('click', ev => {
  const el = ev.target.closest('[data-link].is-linked');
  if (el) activateLink(el, ev);
});
civInfo.addEventListener('keydown', ev => {
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[data-link].is-linked')) {
    ev.preventDefault();
    activateLink(ev.target, ev);
  }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') pinLink(null); });
svgEl.addEventListener('click', () => pinLink(null));  // click en el fondo del árbol: soltar el bonus fijado

langSelect.value = currentLang;
updateUIStrings();
populateCivSelect();

langSelect.addEventListener('change', () => {
  closeStatsPanel();
  setLanguage(langSelect.value);
  populateCivSelect();
  civInfo.innerHTML = buildCivInfo(currentCiv);
  refreshSidebarLinks();
  updateToggleLabel();
  populateExtraPanel();
});

civSelect.addEventListener('change', () => {
  currentCiv = civSelect.value;
  const fsBtn = document.getElementById('open-fullscreen');
  if (fsBtn) fsBtn.href = '/tree/?civ=' + encodeURIComponent(currentCiv);

  // Reset ally team when main civ changes
  simTeamCivs  = [];
  simTeamStats = null;

  // Update civ shield
  const shield = document.getElementById('civ-shield');
  if (shield) {
    shield.src = `img/Civs/${currentCiv}.png`;
    shield.style.display = 'block';
  }

  closeStatsPanel();
  civInfo.innerHTML = buildCivInfo(currentCiv);
  render();
  populateExtraPanel();
});

// ═══════════════════════════════════════════════════════════
// ZOOM CONTROLS
// ═══════════════════════════════════════════════════════════

function fitView() {
  if (!currentLayout) return;
  const { totalH, totalW } = currentLayout;
  const W = svgEl.clientWidth, H = svgEl.clientHeight;
  // Escalar para que todas las edades quepan verticalmente, con fondo visible arriba y abajo
  const M = 16;
  const scale = (H - 2 * M) / totalH;
  lockedTY = M;
  // Centrar si entra entero; si no, arrancar desde la izquierda (edades + Cuartel)
  const tx = totalW * scale < W ? (W - totalW * scale) / 2 : SHEET_MARGIN * scale;
  svgD3.call(zoom.transform, d3.zoomIdentity.translate(tx, lockedTY).scale(scale));
}

document.getElementById('btn-zoom-in').addEventListener('click', () => svgD3.transition().duration(250).call(zoom.scaleBy, 1.4));
document.getElementById('btn-zoom-out').addEventListener('click', () => svgD3.transition().duration(250).call(zoom.scaleBy, 0.7));
document.getElementById('btn-fit').addEventListener('click', fitView);

// ═══════════════════════════════════════════════════════════
// EXTRA PANEL — Unidades Relevantes
// ═══════════════════════════════════════════════════════════

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
    'hulk', 'war_hulk', 'carrack', 'demoraft', 'demoship', 'heavydemo', 'cannongalleon',
    'longship', 'elite_longship', 'catapult_gall'],
  // The Viking Sagas (parche 185872)
  infantry_mounted: ['militia', 'manatarms', 'longsword', 'twohanded', 'champion',
    'spearman', 'pikeman', 'halberdier', 'scout', 'lightcav', 'hussar',
    'knight', 'cavalier', 'paladin', 'mounted_crossbow', 'heavy_mounted_crossbow'],
  varangian_guard: ['varangian_guard', 'elite_varangian_guard'],
  varangian_longship: ['varangian_guard', 'elite_varangian_guard', 'longship', 'elite_longship'],
  longship_catapult_galleon: ['longship', 'elite_longship', 'catapult_gall'],
  tower_castle: ['watchtower', 'guardtower', 'keep', 'bombardtower', 'castle'],
  // Training-building scopes — used by building_work_speed bonuses
  tc:   ['villager'],
  dock: ['galley', 'wargalley', 'galleon', 'firegalley', 'fireship', 'fastfireship',
    'hulk', 'war_hulk', 'carrack', 'demoraft', 'demoship', 'heavydemo', 'cannongalleon'],
};

function getBonusAffectedUnits(civ) {
  if (!Array.isArray(civ.bonuses)) return [];

  const lcBonuses = LOCALE[currentLang]?.civs?.[currentCiv]?.bonuses || [];

  const result = [];
  const seen = new Set();

  civ.bonuses.forEach((bonus, idx) => {
    if (typeof bonus !== 'object' || !bonus.scope) return;

    // El texto de cada bonus se vincula por "line" cuando el orden no coincide con el locale
    const note = lcBonuses[bonus.line !== undefined ? bonus.line : idx] || '';

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
        result.push({ id, name: nodeName(id), bonus: note });
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
  span.textContent = t(age, 'ages_short');
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
    if (!f.text && !f.html) return;
    const d = document.createElement('div');
    d.className = f.cls;
    if (f.html) d.innerHTML = f.html;
    else d.textContent = f.text;
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
    const sec = makeSection(t('unique_units'));
    const lcUUs = civLocale(currentCiv).uniqueUnits || [];

    civ.uniqueUnits.forEach((u, i) => {
      const lcU = lcUUs[i] || {};
      const badge = makeAgeBadge(u.age ?? 2);
      const fallbackSub = t('unique_unit');
      sec.appendChild(makeCard(makeEuIcon('uniqueunit', 'type-unique'), [
        { cls: 'eu-name', text: lcU.name || '' },
        { cls: 'eu-sub', text: lcU.subtitle || fallbackSub },
        { el: badge },
      ]));
      // Elite
      if (lcU.upgradeName) {
        sec.appendChild(makeCard(makeEuIcon('eliteunique', 'type-elite'), [
          { cls: 'eu-name', text: lcU.upgradeName },
          { cls: 'eu-sub', text: t('elite_version') },
        ]));
      }
    });

    container.appendChild(sec);
  }

  // ── 2. Tecnologías Únicas ────────────────────────────────
  if (civ.uniqueTechs && civ.uniqueTechs.length > 0) {
    const sec = makeSection(t('unique_techs'));
    const lcTechs = civLocale(currentCiv).uniqueTechs || [];

    civ.uniqueTechs.forEach((tech, i) => {
      const lcT = lcTechs[i] || {};
      const badge = makeAgeBadge(tech.age ?? (i === 0 ? 2 : 3));
      const treeCost = getCivTree().u[`uniquetech${i + 1}`]?.rc;
      sec.appendChild(makeCard(makeEuIcon(`uniquetech${i + 1}`, 'type-utech'), [
        { cls: 'eu-name', text: lcT.name || '' },
        { el: badge },
        { cls: 'eu-cost', html: costStr(treeCost || tech.research_cost) },
        { cls: 'eu-effect', text: lcT.effect || '' },
      ]));
    });

    container.appendChild(sec);
  }

  // ── 3. Afectadas por Bonus ───────────────────────────────
  const bonusUnits = getBonusAffectedUnits(civ);
  if (bonusUnits.length > 0) {
    const sec = makeSection(t('bonus_affected'));

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
    empty.textContent = t('no_data');
    container.appendChild(empty);
  }
}

function updateToggleLabel() {
  const btn = document.getElementById('btn-toggle-view');
  const isExtra = viewMode === 'extra';
  btn.classList.toggle('active', isExtra);
  btn.dataset.i18n = isExtra ? 'ui.classic_tree' : 'ui.relevant_units';
  btn.textContent = t(isExtra ? 'classic_tree' : 'relevant_units');
}

function toggleView() {
  viewMode = viewMode === 'classic' ? 'extra' : 'classic';
  const isExtra = viewMode === 'extra';

  document.body.classList.toggle('mode-extra', isExtra);

  updateToggleLabel();

  if (isExtra) populateExtraPanel();

  // Re-fit una vez terminada la transición CSS
  setTimeout(fitView, 340);
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

// Pre-selección desde URL param (?civ=franks) — funciona tanto en standalone como en iframe
const _urlCiv = new URLSearchParams(location.search).get('civ')?.toLowerCase();
if (_urlCiv && typeof CIVS !== 'undefined' && CIVS[_urlCiv]) {
  civSelect.value = _urlCiv;
}

// Trigger initial info render
civSelect.dispatchEvent(new Event('change'));
// Las etiquetas de edad se miden con Cinzel: si la fuente llegó tarde, redibujar una vez
if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(render);

setTimeout(fitView, 50);
window.addEventListener('resize', fitView);
