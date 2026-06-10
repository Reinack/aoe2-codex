// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

let currentCiv = 'armenians';
let viewMode = 'classic';

window.addEventListener('load', () => {
  updateUniqueForCiv();
  populateCivSelect();
  buildCivInfo();
  render();
  populateExtraPanel();
});

// Bind language selector
document.getElementById('lang-select').addEventListener('change', e => {
  currentLang = e.target.value;
  render();
  populateCivSelect();
  buildCivInfo();
  populateExtraPanel();
});


// ═══════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════

const svgEl = document.getElementById('svg-tree');
const svgD3 = d3.select(svgEl);

// ── Pattern definition for parchment texture ────────────────
const defs = svgD3.append('defs');
defs.append('pattern')
  .attr('id', 'paper-pattern')
  .attr('patternUnits', 'userSpaceOnUse')
  .attr('width', 256)
  .attr('height', 256)
  .append('image')
  .attr('href', 'img/Backgrounds/bg_aoe2_hd_paper.jpg')
  .attr('width', 256)
  .attr('height', 256);

const root = svgD3.append('g').attr('id', 'root');

let lockedTY = 10;

const zoom = d3.zoom()
  .scaleExtent([0.15, 4])
  .filter(event => event.type !== 'wheel' || event.ctrlKey)
  .on('zoom', e => {
    const t = e.transform;
    root.attr('transform', `translate(${t.x},${lockedTY}) scale(${t.k})`);
  });
svgD3.call(zoom);

// Rueda del ratón → desplazamiento horizontal (Ctrl+rueda → zoom)
svgD3.on('wheel', event => {
  if (event.ctrlKey) return;
  event.preventDefault();
  const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY;
  const t = d3.zoomTransform(svgEl);
  svgD3.call(zoom.transform,
    d3.zoomIdentity.translate(t.x - delta * 0.8, lockedTY).scale(t.k));
}, { passive: false });

function getCiv() { return CIVS[currentCiv]; }
const ALWAYS_AVAILABLE = new Set(['feudalage', 'castleage', 'imperialage', 'wonder', 'uniquetech1', 'uniquetech2', 'farm', 'fishtrap', 'tc_castle']);
function isMissing(id) { return !ALWAYS_AVAILABLE.has(id) && !getCiv().available.includes(id); }

// ── Helper: locale data for a civ ────────────────────────────────────────────
function civLocale(civId) {
  return LOCALE[currentLang]?.civs?.[civId ?? currentCiv] || {};
}

let displayNodes = NODES.filter(n => n.type !== 'building').map(n => ({ ...n }));

function updateUniqueForCiv() {
  const civ = getCiv();
  const lc = civLocale(currentCiv);
  const uu = displayNodes.find(n => n.id === 'uniqueunit');
  const eu = displayNodes.find(n => n.id === 'eliteunique');
  const ut1 = displayNodes.find(n => n.id === 'uniquetech1');
  const ut2 = displayNodes.find(n => n.id === 'uniquetech2');

  if (civ.uniqueUnits && civ.uniqueUnits.length > 0) {
    const mainUU = civ.uniqueUnits[0];
    const lcUU = lc.uniqueUnits?.[0] || {};
    const civName = lc.name || currentCiv;
    if (uu) {
      uu.name = lcUU.name || 'Unique Unit';
      uu.cost = mainUU.cost || { food: 60, gold: 30 };
      uu.effect = currentLang === 'es'
        ? `Unidad única de ${civName}.${lcUU.subtitle ? ' (' + lcUU.subtitle + ')' : ''}`
        : `Unique unit of ${civName}.${lcUU.subtitle ? ' (' + lcUU.subtitle + ')' : ''}`;
      uu.imgPath = mainUU.imgPic !== undefined ? `img/Unit/${mainUU.imgPic}.png` : null;
    }
    if (eu) {
      eu.name = lcUU.upgradeName || `${lcUU.name || 'Unique Unit'} Elite`;
      eu.cost = mainUU.elite_cost || { food: 300, gold: 500 };
      eu.effect = currentLang === 'es'
        ? `Versión elite de ${lcUU.name || 'Unidad Única'}.`
        : `Elite version of ${lcUU.name || 'Unique Unit'}.`;
      eu.imgPath = mainUU.eliteImgPic !== undefined ? `img/Unit/${mainUU.eliteImgPic}.png`
        : mainUU.imgPic !== undefined ? `img/Unit/${mainUU.imgPic}.png` : null;
    }
  }

  // Unique tech 1 (Castle Age)
  if (civ.uniqueTechs && civ.uniqueTechs.length > 0) {
    const ut1Tech = civ.uniqueTechs[0];
    const lcUT1 = lc.uniqueTechs?.[0] || {};
    if (ut1) {
      ut1.name = lcUT1.name || 'Unique Tech';
      ut1.research_cost = ut1Tech.research_cost || { food: 300, gold: 300 };
      ut1.cost = ut1.research_cost;
      ut1.effect = lcUT1.effect || '';
      ut1.imgPath = ut1Tech.imgPic !== undefined ? `img/Tech/${ut1Tech.imgPic}.png` : 'img/Tech/33.png';
      IMG_MAP['uniquetech1'] = ut1.imgPath;
    }
  }

  // Unique tech 2 (Imperial Age)
  if (civ.uniqueTechs && civ.uniqueTechs.length > 1) {
    const ut2Tech = civ.uniqueTechs[1];
    const lcUT2 = lc.uniqueTechs?.[1] || {};
    if (ut2) {
      ut2.name = lcUT2.name || 'Unique Tech';
      ut2.research_cost = ut2Tech.research_cost || { wood: 800, gold: 500 };
      ut2.cost = ut2.research_cost;
      ut2.effect = lcUT2.effect || '';
      ut2.imgPath = ut2Tech.imgPic !== undefined ? `img/Tech/${ut2Tech.imgPic}.png` : 'img/Tech/107.png';
      IMG_MAP['uniquetech2'] = ut2.imgPath;
    }
  }
  // Sincronizar unidades únicas también
  const uuNode = displayNodes.find(n => n.id === 'uniqueunit');
  const euNode = displayNodes.find(n => n.id === 'eliteunique');
  if (uuNode?.imgPath) IMG_MAP['uniqueunit'] = uuNode.imgPath;
  if (euNode?.imgPath) IMG_MAP['eliteunique'] = euNode.imgPath;
}

function render() {
  root.selectAll('*').remove();
  const civ = getCiv();

  // Clone and apply overrides
  let activeBuildings = NODES.filter(n => n.type === 'building').map(b => ({ ...b }));
  let activeNodes = NODES.filter(n => n.type !== 'building').map(n => ({ ...n }));

  // Handle regional replacement buildings (e.g. tahsili, mulecart):
  // - If a civ has one available, remove the buildings it replaces from the layout
  // - If a civ doesn't have it, remove the replacement building itself (don't show grey column)
  const replacedIds = new Set();
  activeBuildings.forEach(b => {
    if (b.replaces && !isMissing(b.id)) b.replaces.forEach(id => replacedIds.add(id));
  });
  const buildingRemap = {};
  activeBuildings.forEach(b => {
    if (b.replaces && !isMissing(b.id)) {
      b.replaces.forEach(id => { buildingRemap[id] = b.id; });
    }
  });
  activeBuildings = activeBuildings.filter(b => {
    if (replacedIds.has(b.id)) return false;
    if (b.replaces && isMissing(b.id)) return false;
    return true;
  });
  activeNodes.forEach(n => {
    if (buildingRemap[n.building]) n.building = buildingRemap[n.building];
  });

  if (civ.overrides) {
    Object.entries(civ.overrides).forEach(([id, ov]) => {
      // Check if it's a building
      const bld = activeBuildings.find(b => b.id === id);
      if (bld) {
        if (ov.age !== undefined) {
          const subRow = (bld.row ?? bld.age * 2) % 2;
          bld.age = ov.age;
          if (ov.row === undefined) bld.row = ov.age * 2 + subRow;
        }
        if (ov.row !== undefined) bld.row = ov.row;
      }
      // Check if it's a node
      const node = activeNodes.find(n => n.id === id);
      if (node) {
        if (ov.age !== undefined) {
          const subRow = node.row % 2;
          node.age = ov.age;
          if (ov.row === undefined) {
            node.row = ov.age * 2 + subRow;
          }
        }
        if (ov.row !== undefined) node.row = ov.row;
        if (ov.col !== undefined) node.col = ov.col;
      }
    });
  }

  displayNodes = activeNodes
    .filter(n => {
      // Exclude civ-specific unique tech nodes (e.g. 'armenians_uniquetech1') — they exist
      // only for the tech simulator. The generic 'uniquetech1'/'uniquetech2' slots are used
      // for display and are updated per-civ by updateUniqueForCiv().
      if (/^.+_uniquetech[12]$/.test(n.id)) return false;
      if (n.special && isMissing(n.id)) return false;
      return true;
    });

  updateUniqueForCiv();

  const { bldX, bldPos, pos, ageYStart, ageHArray, totalH, totalW } = computeLayout(displayNodes, activeBuildings);

  // ── Actualizar límites de Zoom (Bloquear límites horizontales) ─────────
  const svgWidth = svgEl.clientWidth || 800;
  const svgHeight = svgEl.clientHeight || 600;
  zoom.extent([[0, 0], [svgWidth, svgHeight]]);
  // Constreñir el desplazamiento al contenido exacto
  zoom.translateExtent([[0, 0], [totalW, totalH]]);

  // ── Fondo de papel único para todo el árbol ─────────────────
  root.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', totalW)
    .attr('height', totalH)
    .attr('fill', 'url(#paper-pattern)');

  // ── Sombras para las edades ────────────────────────────────
  for (let i = 0; i < 4; i++) {
    const y = ageYStart[i];
    const ah = ageHArray[i];

    root.append('rect')
      .attr('class', `age-stripe-${i}`)
      .attr('x', 0)
      .attr('y', y)
      .attr('width', totalW)
      .attr('height', ah);
  }

  // ── Age headers (Left sidebar inside svg) ────────────────
  const ageImageFiles = ['base_dark_age.png', 'base_feudal_age.png', 'base_castle_age.png', 'base_imperial_age.png'];
  AGES.forEach((_, i) => {
    const g = root.append('g')
      .attr('class', 'age-label-group')
      .attr('transform', `translate(20, ${ageYStart[i] + ageHArray[i] / 2 - 25})`);

    g.append('image')
      .attr('href', `img/Ages/${ageImageFiles[i]}`)
      .attr('width', 50)
      .attr('height', 50)
      .attr('x', 0)
      .attr('y', 0);

    g.append('text')
      .attr('class', 'age-label')
      .attr('x', 60)
      .attr('y', 25)
      .text(t(i, 'ages'));
  });

  // ── Edges ────────────────────────────────────────────────
  // 1. Building to Building Prereqs
  BUILDINGS.forEach(b => {
    if (isMissing(b.id)) return;
    const prereqs = civ.noBuildingPrereqs ? [] : (b.prereqs || []);
    prereqs.forEach(pid => {
      if (isMissing(pid)) return;
      const fp = bldPos[pid];
      const tp = bldPos[b.id];
      if (!fp || !tp) return;

      const x1 = fp.x + NW / 2, y1 = fp.y + NH;
      const x2 = tp.x + NW / 2, y2 = tp.y;
      const my = (y1 + y2) / 2;

      root.append('path')
        .attr('class', 'edge-building')
        .attr('d', `M${x1},${y1} L${x1},${my} L${x2},${my} L${x2},${y2}`)
        .attr('stroke', '#8b5a2b')
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr('opacity', 0.6);
    });
  });

  // 2. Node to Prereq Edges
  displayNodes.forEach(n => {
    n.prereqs.forEach(pid => {
      const fp = pos[pid] || bldPos[pid]; // Could be a building
      const tp = pos[n.id];
      if (!fp || !tp) return;
      const miss = isMissing(n.id) || isMissing(pid);

      const x1 = fp.x + NW / 2, y1 = fp.y + (pos[pid] ? NH : NH);
      const x2 = tp.x + NW / 2, y2 = tp.y;
      const my = (y1 + y2) / 2;

      root.append('path')
        .attr('class', 'edge')
        .attr('d', `M${x1},${y1} L${x1},${my} L${x2},${my} L${x2},${y2}`)
        .attr('stroke', miss ? 'rgba(0,0,0,0.1)' : '#fff')
        .attr('opacity', miss ? 0.3 : 1);
    });

    // Connect to building if no prereqs — only when node is in the same age as its building
    if (n.prereqs.length === 0 && bldPos[n.building]) {
      const bld = activeBuildings.find(b => b.id === n.building);
      const bldAge = bld ? (bld.age ?? 0) : 0;
      if (n.age !== bldAge) return; // Skip false cross-age connections

      const fp = bldPos[n.building];
      const tp = pos[n.id];
      const miss = isMissing(n.id);

      const x1 = fp.x + NW / 2, y1 = fp.y + NH;
      const x2 = tp.x + NW / 2, y2 = tp.y;
      const my = (y1 + y2) / 2;

      root.append('path')
        .attr('class', 'edge')
        .attr('d', `M${x1},${y1} L${x1},${my} L${x2},${my} L${x2},${y2}`)
        .attr('stroke', miss ? 'rgba(0,0,0,0.1)' : '#fff')
        .attr('opacity', miss ? 0.3 : 1);
    }
  });

  // ── Helper to draw node ──────────────────────────────────
  function drawNode(g, id, label, iconText, typeClass, miss, evData) {
    const isStatNode = ['unit', 'upgrade', 'unique', 'building', 'tech', 'defencive'].includes(evData.type);
    g.attr('class', `node ${typeClass} ${miss ? 'unavailable' : ''}`)
      .on('mouseover', ev => showTip(ev, evData))
      .on('mousemove', ev => moveTip(ev))
      .on('mouseout', hideTip)
      .on('click', ev => {
        ev.stopPropagation();
        if (isStatNode) showStatsPanel(ev, evData);
      })
      .style('cursor', isStatNode ? 'pointer' : 'default');

    // Main icon background
    g.append('rect')
      .attr('class', 'node-icon-bg')
      .attr('width', NW).attr('height', NH - 20)
      .attr('x', 0).attr('y', 0);

    // Text background bar
    g.append('rect')
      .attr('class', 'node-text-bg')
      .attr('width', NW).attr('height', 20)
      .attr('x', 0).attr('y', NH - 20);

    // Node outline
    g.append('rect')
      .attr('width', NW).attr('height', NH)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.5)');

    const imgSrc = evData.imgPath || IMG_MAP[id];
    if (imgSrc) {
      g.append('image')
        .attr('href', imgSrc)
        .attr('x', 0).attr('y', 0)
        .attr('width', NW).attr('height', NH - 20)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    } else {
      g.append('text')
        .attr('class', 'node-icon')
        .attr('x', NW / 2).attr('y', (NH - 20) / 2)
        .text(iconText);
    }

    const txt = g.append('text')
      .attr('x', NW / 2).attr('y', NH - 10)
      .text(label);

    // Adjust text if too long
    if (label.length > 10) {
      txt.attr('font-size', '8px');
    }
  }

  // ── Buildings as Root Nodes ──────────────────────────────
  activeBuildings.forEach(b => {
    const p = bldPos[b.id];
    if (!p) return;
    const g = root.append('g').attr('transform', `translate(${p.x},${p.y})`);

    const bName = t(b.id, 'buildings');
    const miss = isMissing(b.id);
    // Buildings are usually always available, we just pass an empty node for tip
    const bNode = {
      ...b,
      name: bName,
      type: 'building',
      effect: b.effect || (currentLang === 'es' ? 'Produce unidades o tecnologías.' : 'Produces units or technologies.'),
      prereqs: b.prereqs || []
    };
    drawNode(g, b.id, bName, b.icon, 'n-building', miss, bNode);
  });

  // ── Nodes ────────────────────────────────────────────────
  displayNodes.forEach(n => {
    const p = pos[n.id];
    if (!p) return;
    const miss = isMissing(n.id);
    const label = n.name || (n.type === 'defencive' ? n.name : tData(n, 'name', n.type === 'unit' ? 'units' : 'techs'));
    const iconStr = n.type === 'unit' ? '⚔️' : n.type === 'tech' ? '🧪' : n.type === 'upgrade' ? '⭐' : n.type === 'defencive' ? '🏰' : '🌟';

    // Clases de variante: castle slots usan type:'unique'; especiales usan n.variant
    const variant = n.type === 'unique' ? '' :
      n.variant === 'unique' ? ' n-civ-unique' :
        n.variant === 'regional' ? ' n-regional' : '';

    const g = root.append('g').attr('transform', `translate(${p.x},${p.y})`);
    drawNode(g, n.id, label, iconStr, `n-${n.type}${variant}`, miss, n);
  });
}

// ═══════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════

const tipEl = document.getElementById('tooltip');
const ttName = document.getElementById('tt-name');
const ttAge = document.getElementById('tt-age');
const ttCost = document.getElementById('tt-cost');
const ttEffect = document.getElementById('tt-effect');
const ttPrereq = document.getElementById('tt-prereq');
const ttMissing = document.getElementById('tt-missing');

// Renders a cost object as HTML resource icons.
// If baseCost is supplied and a resource value differs, the modified value is shown in green.
function costStr(c, baseCost = null) {
  if (!c) return '—';
  const p = [];
  const RES = [
    { key: 'food',  src: 'img/food.png',  alt: 'Food'  },
    { key: 'wood',  src: 'img/wood.png',  alt: 'Wood'  },
    { key: 'gold',  src: 'img/gold.png',  alt: 'Gold'  },
    { key: 'stone', src: 'img/stone.png', alt: 'Stone' },
  ];
  for (const { key, src, alt } of RES) {
    const val  = c[key];
    const base = baseCost?.[key];
    if (!val && !base) continue;
    const icon = `<img src="${src}" class="res-icon" alt="${alt}">`;
    const reduced = base != null && base !== val;
    p.push(`${icon} ${reduced ? `<span class="sp-cost-new">${val}</span>` : (val ?? 0)}`);
  }
  return p.join('  ') || (currentLang === 'es' ? 'Gratis' : 'Free');
}

function showTip(ev, n) {
  ttName.textContent = tData(n, 'name', n.type === 'unit' ? 'units' : 'techs');
  ttAge.textContent = (n.type === 'building' || n.type === 'defencive') ? t('building') : `${t(n.age, 'ages')} · ${t(n.type)}`;

  let costHtml = '';
  if (n.build_cost)    costHtml += `<div><strong>${t('build_cost')}:</strong> ${costStr(n.build_cost)}</div>`;
  if (n.research_cost) costHtml += `<div><strong>${t('research_cost')}:</strong> ${costStr(n.research_cost)}</div>`;
  if (n.train_cost)    costHtml += `<div><strong>${t('train_cost')}:</strong> ${costStr(n.train_cost)}</div>`;

  // Fallback para nodos que aún usen la clave genérica 'cost'
  if (!costHtml && n.cost) {
    const label = (n.type === 'building' || n.type === 'defencive') ? t('build_cost') : (n.type === 'unit' ? t('train_cost') : t('research_cost'));
    costHtml = `<div><strong>${label}:</strong> ${costStr(n.cost)}</div>`;
  }

  ttCost.innerHTML = costHtml || '—';
  ttEffect.textContent = tData(n, 'effect');
  const prereqNames = (n.prereqs || []).map(pid => {
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
        <div class="tt-stat-item"><span class="stat-icon">❤️</span> <span class="stat-val">${stats.hp}</span></div>
        <div class="tt-stat-item"><span class="stat-icon">⚔️</span> <span class="stat-val">${stats.attack}</span></div>
        <div class="tt-stat-item"><span class="stat-icon">🛡️</span> <span class="stat-val">${stats.armor[0]}/${stats.armor[1]}</span></div>
        ${stats.range ? `<div class="tt-stat-item"><span class="stat-icon">🏹</span> <span class="stat-val">${stats.range}</span></div>` : ''}
        <div class="tt-stat-item"><span class="stat-icon">🏃</span> <span class="stat-val">${stats.speed}</span></div>
        ${stats.rof ? `<div class="tt-stat-item"><span class="stat-icon">⏱️</span> <span class="stat-val">${stats.rof}s</span></div>` : ''}
      </div>
    `;
  } else {
    statsContainer.style.display = 'none';
  }

  tipEl.style.display = 'block';
  moveTip(ev);
}

function createStatsContainer() {
  const div = document.createElement('div');
  div.id = 'tt-stats-container';
  div.className = 'tt-stats-container';
  tipEl.appendChild(div);
  return div;
}

function hideTip() { tipEl.style.display = 'none'; }
function moveTip(ev) {
  const x = ev.clientX + 16, y = ev.clientY - 10;
  tipEl.style.left = `${Math.min(x, window.innerWidth - 340)}px`;
  tipEl.style.top = `${Math.min(y, window.innerHeight - 220)}px`;
}
