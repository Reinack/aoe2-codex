// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

// El primer render lo dispara civ-panel.js al inicializar el selector de civ.
let currentCiv = 'armenians';
let viewMode = 'classic';


// ═══════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════

const svgEl = document.getElementById('svg-tree');
const svgD3 = d3.select(svgEl);

// ── Texturas de la lámina ───────────────────────────────────
const defs = svgD3.append('defs');
defs.append('pattern')
  .attr('id', 'paper-pattern')
  .attr('patternUnits', 'userSpaceOnUse')
  .attr('width', 1060)
  .attr('height', 145)
  .append('image')
  .attr('href', 'img/Backgrounds/bg_aoe2_hd_paper.jpg')
  .attr('width', 1060)
  .attr('height', 145);

// Rayado de grabado para el margen de las edades
defs.append('pattern')
  .attr('id', 'hatch')
  .attr('patternUnits', 'userSpaceOnUse')
  .attr('width', 5).attr('height', 5)
  .attr('patternTransform', 'rotate(45)')
  .append('line')
  .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 5)
  .attr('stroke', '#3b2811').attr('stroke-width', 0.8).attr('stroke-opacity', 0.13);

// Bordes quemados: degradé de cada borde hacia el centro (offsets según el tamaño de la lámina)
function burnGradient(id, vertical) {
  const g = defs.append('linearGradient').attr('id', id)
    .attr('x1', 0).attr('y1', 0).attr('x2', vertical ? 0 : 1).attr('y2', vertical ? 1 : 0);
  ['a', 'b', 'c', 'd'].forEach(k => g.append('stop').attr('class', `burn-${k}`).attr('stop-color', '#6e4318'));
  return g;
}
const burnX = burnGradient('burn-x', false);
const burnY = burnGradient('burn-y', true);
function setBurn(g, depth, size) {
  const f = Math.min(0.45, depth / size);
  g.select('.burn-a').attr('offset', 0).attr('stop-opacity', 0.5);
  g.select('.burn-b').attr('offset', f).attr('stop-opacity', 0);
  g.select('.burn-c').attr('offset', 1 - f).attr('stop-opacity', 0);
  g.select('.burn-d').attr('offset', 1).attr('stop-opacity', 0.5);
}

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
function getCivTree(civId = currentCiv) { return CIV_TREES[civId]; }

// ── Disponibilidad por civ (derivada de la arquitectura del árbol) ───────────
const AVAILABLE_CACHE = {};
function availableIds(civId = currentCiv) {
  if (!AVAILABLE_CACHE[civId]) {
    const set = new Set();
    getCivTree(civId).b.forEach(b => {
      if (b.s) set.add(b.id);
      (b.g || []).forEach(row => row.forEach(cell => { if (cell && cell[1]) set.add(cell[0]); }));
    });
    AVAILABLE_CACHE[civId] = set;
  }
  return AVAILABLE_CACHE[civId];
}
function isMissing(id) { return !availableIds().has(id); }

// ── Helper: locale data for a civ ────────────────────────────────────────────
function civLocale(civId) {
  return LOCALE[currentLang]?.civs?.[civId ?? currentCiv] || {};
}

// Nodos cuyo contenido depende de la civ (el resto sale de NODES / UP_NODES)
const CIV_SLOT_IDS = new Set(['uniqueunit', 'eliteunique', 'uniquetech1', 'uniquetech2']);
const TYPE_FROM_CODE = {
  B: 'building', BN: 'building', RB: 'building', QB: 'building',
  U: 'unit', RU: 'unit', QU: 'unit', UU: 'upgrade',
  T: 'tech', RT: 'tech', QT: 'unique',
};
const NODE_BY_ID = Object.fromEntries(NODES.map(n => [n.id, n]));

// Combina los datos curados del visor (NODES) con los del árbol del juego
// (UP_NODES / slots de la civ): costes y tiempos del parche vigente, icono y
// stats base como respaldo para unidades sin ficha propia.
function buildNodeData(id, code, status, row, key, building) {
  const base = NODE_BY_ID[id];
  const up = (CIV_SLOT_IDS.has(id) ? getCivTree().u[id] : UP_NODES[id]) || {};
  const n = { ...(base || {}), id, key, building, code, row, age: Math.floor(row / 2), available: !!status };
  const isBuildingCode = TYPE_FROM_CODE[code] === 'building';
  if (id === 'uniqueunit' || id === 'eliteunique') n.type = 'unique';
  else if (isBuildingCode) n.type = base?.type === 'defencive' ? 'defencive' : 'building';
  else if (!base || code === 'QT') n.type = TYPE_FROM_CODE[code] || 'unit';

  if (up.tc) n.train_cost = up.tc;
  if (up.rc) n.research_cost = up.rc;
  if (up.bc) n.build_cost = up.bc;
  if (up.rt != null) n.research_time = up.rt;
  if (up.bt != null) n.build_time = up.bt;
  if (up.pic) n.imgPath = up.pic;
  if (up.s && !n.stats) n.stats = up.s;
  n.upName = up.n;
  n.variant = code[0] === 'R' ? 'regional' : code[0] === 'Q' ? 'unique' : '';
  return n;
}

let displayNodes = [];
let currentLayout = null;
let nodeEls = new Map();   // key → <g> del nodo
let edgeEls = [];          // { from, to, el }

function updateUniqueForCiv() {
  const civ = getCiv();
  const lc = civLocale(currentCiv);
  const lcUU = lc.uniqueUnits?.[0] || {};
  const civName = lc.name || currentCiv;

  displayNodes.forEach(n => {
    if (!CIV_SLOT_IDS.has(n.id)) return;
    const upName = n.upName?.[currentLang] || '';
    if (n.id === 'uniqueunit') {
      n.name = lcUU.name || upName;
      n.effect = currentLang === 'es'
        ? `Unidad única de ${civName}.${lcUU.subtitle ? ' (' + lcUU.subtitle + ')' : ''}`
        : `Unique unit of ${civName}.${lcUU.subtitle ? ' (' + lcUU.subtitle + ')' : ''}`;
    } else if (n.id === 'eliteunique') {
      n.name = lcUU.upgradeName || upName;
      n.effect = currentLang === 'es'
        ? `Versión elite de ${lcUU.name || upName}.`
        : `Elite version of ${lcUU.name || upName}.`;
    } else {
      const i = n.id === 'uniquetech1' ? 0 : 1;
      const lcUT = lc.uniqueTechs?.[i] || {};
      n.name = lcUT.name || upName;
      n.effect = lcUT.effect || '';
      if (!n.research_cost && civ.uniqueTechs?.[i]?.research_cost) n.research_cost = civ.uniqueTechs[i].research_cost;
    }
    if (n.imgPath) IMG_MAP[n.id] = n.imgPath;
  });
}

// ── Etiqueta en hasta 2-3 líneas dentro del nodo ────────────────────────────
const LABEL_FONT = "'Crimson Pro', Georgia, serif";
const labelCtx = document.createElement('canvas').getContext('2d');
const labelWidth = (text, size) => {
  labelCtx.font = `600 ${size}px ${LABEL_FONT}`;
  return labelCtx.measureText(text).width;
};

function wrapLabel(text) {
  const maxW = NS - 8;
  const wrap = (size, maxLines) => {
    const lines = [];
    let cur = '';
    for (const w of text.split(/\s+/)) {
      const next = cur ? `${cur} ${w}` : w;
      if (labelWidth(next, size) <= maxW) cur = next;
      else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines.length <= maxLines && lines.every(l => labelWidth(l, size) <= maxW) ? lines : null;
  };
  // [tamaño de fuente, líneas máximas] de más grande a más chico
  for (const [size, maxLines] of [[11.5, 1], [11, 2], [10, 2], [8.5, 3]]) {
    const lines = wrap(size, maxLines);
    if (lines) return { lines, size };
  }
  return { lines: text.split(/\s+/).slice(0, 3), size: 8.5 };
}

// Nombre visible por id: locale del visor → nombre oficial del juego
function nodeName(id) {
  const L = LOCALE[currentLang];
  return L?.buildings?.[id] || L?.nodes?.[id]?.name || UP_NODES[id]?.n?.[currentLang] || id;
}

// Los slots de la civ (UU / tecnologías únicas) traen su nombre desde updateUniqueForCiv
function nodeLabel(n) {
  return CIV_SLOT_IDS.has(n.id) ? (n.name || n.id) : nodeName(n.id);
}

// Nombre de edad en la franja izquierda: en dos líneas si no entra
function wrapAgeLabel(text) {
  labelCtx.font = "700 15px 'Cinzel', Georgia, serif";
  const maxW = LEFT_LABEL_W - 34;
  if (labelCtx.measureText(text).width <= maxW) return [text];
  const words = text.split(' ');
  let best = [text], bestW = Infinity;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
    const w = Math.max(...lines.map(l => labelCtx.measureText(l).width));
    if (w < bestW) { bestW = w; best = lines; }
  }
  return best;
}

// Nodo seleccionado (el que tiene abierto el panel de stats)
let selectedKey = null;
function setSelectedNode(key) {
  if (selectedKey) nodeEls.get(selectedKey)?.classed('selected', false);
  selectedKey = key;
  if (key) nodeEls.get(key)?.classed('selected', true);
  sidebarReflectSelection(key);
}

// Desplaza el árbol (sin cambiar el zoom) para que los nodos queden a la vista
function panToKeys(keys) {
  const xs = keys.map(k => currentLayout.pos[k]?.x).filter(x => x != null);
  if (!xs.length) return;
  const t = d3.zoomTransform(svgEl);
  const W = svgEl.clientWidth;
  const left = Math.min(...xs), right = Math.max(...xs) + NS;
  const viewL = -t.x / t.k, viewR = (W - t.x) / t.k;
  if (left >= viewL + 10 && right <= viewR - 10) return;
  const tx = (right - left) * t.k < W - 80
    ? W / 2 - ((left + right) / 2) * t.k
    : 40 - left * t.k;
  svgD3.transition().duration(450).call(zoom.transform, d3.zoomIdentity.translate(tx, lockedTY).scale(t.k));
}

// Resalta la ruta de requisitos del nodo (como el árbol del juego)
function highlightPath(key, on) {
  if (!key) return;
  sidebarReflectHover(key, on);
  const chain = new Set();
  let k = key;
  while (k && !chain.has(k)) { chain.add(k); k = currentLayout.parentOf[k]; }
  root.classed('path-active', on);
  chain.forEach(ck => nodeEls.get(ck)?.classed('hl', on));
  edgeEls.forEach(e => { if (chain.has(e.from) && chain.has(e.to)) e.el.classed('hl', on); });
}

function render() {
  root.selectAll('*').remove();
  root.classed('path-active', false).classed('pin-active', false);
  nodeEls = new Map();
  edgeEls = [];
  selectedKey = null;

  const civTree = getCivTree();
  const L = computeTreeLayout(civTree);
  currentLayout = L;

  const nodesByKey = {};
  L.buildings.forEach(b => { nodesByKey[b.key] = buildNodeData(b.id, b.t, b.s, b.r, b.key, b.id); });
  L.cells.forEach(c => { nodesByKey[c.key] = buildNodeData(c.cell[0], c.cell[2], c.cell[1], c.row, c.key, c.building); });
  displayNodes = Object.values(nodesByKey);
  updateUniqueForCiv();

  const { pos, ageYStart, ageHArray, totalH, totalW } = L;

  // ── Límites de zoom/desplazamiento (con un margen de fondo alrededor de la lámina) ──
  const svgWidth = svgEl.clientWidth || 800;
  const svgHeight = svgEl.clientHeight || 600;
  zoom.extent([[0, 0], [svgWidth, svgHeight]]);
  zoom.translateExtent([[-SHEET_MARGIN, 0], [totalW + SHEET_MARGIN, totalH]]);

  // ── Lámina de pergamino sobre el fondo oscuro ─────────────
  [[10, 0.12], [5, 0.18], [2, 0.3]].forEach(([s, o]) => {
    root.append('rect').attr('class', 'sheet-shadow')
      .attr('x', -s).attr('y', -s + s * 0.4)
      .attr('width', totalW + 2 * s).attr('height', totalH + 2 * s)
      .attr('opacity', o);
  });
  root.append('rect')
    .attr('width', totalW).attr('height', totalH)
    .attr('fill', 'url(#paper-pattern)');

  // ── Bandas de edad: tinte alterno y doble filete entre edades ──
  for (let i = 1; i < 4; i += 2) {
    root.append('rect').attr('class', 'age-band-tint')
      .attr('y', ageYStart[i]).attr('width', totalW).attr('height', ageHArray[i]);
  }
  // Margen de las edades: rayado de grabado cerrado por un doble filete vertical
  root.append('rect').attr('fill', 'url(#hatch)')
    .attr('width', LEFT_LABEL_W - 14).attr('height', totalH);
  [[LEFT_LABEL_W - 14, 1.2], [LEFT_LABEL_W - 10, 0.6]].forEach(([x, w]) => {
    root.append('line').attr('class', 'age-divider')
      .attr('x1', x).attr('x2', x).attr('y1', 0).attr('y2', totalH).attr('stroke-width', w);
  });
  for (let i = 1; i < 4; i++) {
    [[0, 1.2], [3.5, 0.6]].forEach(([dy, w]) => {
      root.append('line').attr('class', 'age-divider')
        .attr('x1', 0).attr('x2', totalW)
        .attr('y1', ageYStart[i] + dy).attr('y2', ageYStart[i] + dy)
        .attr('stroke-width', w);
    });
  }

  // Bordes quemados de la lámina
  setBurn(burnX, 70, totalW);
  setBurn(burnY, 46, totalH);
  root.append('rect').attr('width', totalW).attr('height', totalH).attr('fill', 'url(#burn-x)').attr('pointer-events', 'none');
  root.append('rect').attr('width', totalW).attr('height', totalH).attr('fill', 'url(#burn-y)').attr('pointer-events', 'none');
  root.append('rect').attr('width', totalW).attr('height', totalH)
    .attr('fill', 'none').attr('stroke', '#2a1a0a').attr('stroke-opacity', 0.55).attr('stroke-width', 1);

  // ── Etiquetas de edad (franja izquierda) ──────────────────
  const ageImageFiles = ['base_dark_age.png', 'base_feudal_age.png', 'base_castle_age.png', 'base_imperial_age.png'];
  ageImageFiles.forEach((file, i) => {
    const g = root.append('g')
      .attr('class', 'age-label-group')
      .attr('transform', `translate(${(LEFT_LABEL_W - 12) / 2}, ${ageYStart[i] + ageHArray[i] / 2 - 44})`);
    g.append('image')
      .attr('class', 'age-emblem')
      .attr('href', `img/Ages/${file}`)
      .attr('x', -34).attr('y', 0)
      .attr('width', 68).attr('height', 68);
    const label = g.append('text').attr('class', 'age-label');
    wrapAgeLabel(t(i, 'ages')).forEach((line, li) => {
      label.append('tspan').attr('x', 0).attr('y', 84 + li * 18).text(line);
    });
  });

  // ── Conexiones ─────────────────────────────────────────────
  const edgeLayer = root.append('g').attr('class', 'edges');
  L.edges.forEach(([from, to]) => {
    const p = pos[from], c = pos[to];
    if (!p || !c) return;
    const x1 = p.x + NS / 2, y1 = p.y + NS;
    const x2 = c.x + NS / 2, y2 = c.y;
    const busY = y2 > y1 ? Math.min(y1 + BUS_DROP, (y1 + y2) / 2) : y1 + BUS_DROP;
    const d = x1 === x2 ? `M${x1},${y1} V${y2}` : `M${x1},${y1} V${busY} H${x2} V${y2}`;
    const miss = !nodesByKey[from]?.available || !nodesByKey[to]?.available;
    const el = edgeLayer.append('path')
      .attr('class', `edge${from.startsWith('b:') && to.startsWith('b:') ? ' edge-building' : ''}${miss ? ' edge-missing' : ''}`)
      .attr('d', d);
    edgeEls.push({ from, to, el });
  });

  // ── Nodos ──────────────────────────────────────────────────
  const nodeLayer = root.append('g').attr('class', 'nodes');
  const IMG = 54;
  displayNodes.forEach(n => {
    const p = pos[n.key];
    if (!p) return;
    const miss = !n.available;
    const kind = n.code.startsWith('B') || n.code.endsWith('B') ? 'building'
      : n.code.endsWith('T') ? 'tech' : 'unit';
    const variant = n.variant === 'regional' ? ' n-regional' : n.variant === 'unique' ? (kind === 'unit' ? ' n-civ-unique' : ' n-unique') : '';
    const isStatNode = ['unit', 'upgrade', 'unique', 'building', 'tech', 'defencive'].includes(n.type);

    const g = nodeLayer.append('g')
      .attr('class', `node n-${kind}${variant}${miss ? ' unavailable' : ''}`)
      .attr('transform', `translate(${p.x},${p.y})`)
      .style('cursor', isStatNode ? 'pointer' : 'default')
      .on('mouseover', ev => { highlightPath(n.key, true); showTip(ev, n); })
      .on('mousemove', ev => moveTip(ev))
      .on('mouseout', () => { highlightPath(n.key, false); hideTip(); })
      .on('click', ev => {
        ev.stopPropagation();
        if (!isStatNode) return;
        setSelectedNode(n.key);
        showStatsPanel(ev, n);
      });
    nodeEls.set(n.key, g);

    g.append('rect').attr('class', 'node-icon-bg').attr('width', NS).attr('height', NS);
    g.append('rect').attr('class', 'node-img-frame')
      .attr('x', (NS - IMG) / 2 - 1).attr('y', 3).attr('width', IMG + 2).attr('height', IMG + 2);
    const src = n.imgPath || IMG_MAP[n.id];
    if (src) {
      g.append('image')
        .attr('class', 'node-img')
        .attr('href', src)
        .attr('x', (NS - IMG) / 2).attr('y', 4)
        .attr('width', IMG).attr('height', IMG)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    }

    const { lines, size } = wrapLabel(nodeLabel(n));
    // Bloque de texto (de la altura de mayúscula a los descendentes) centrado bajo el retrato;
    // con 3 líneas sube un poco sobre el borde del retrato
    const lineH = size;
    const block = (lines.length - 1) * lineH + 0.82 * size;
    const mid = (IMG + 5 + NS - 1) / 2 - (lines.length > 2 ? 2 : 0);
    const y0 = mid - block / 2 + 0.62 * size;
    const txt = g.append('text').attr('class', 'node-label').attr('font-size', size);
    lines.forEach((line, i) => {
      txt.append('tspan').attr('x', NS / 2).attr('y', y0 + i * lineH).text(line);
    });

    if (miss) {
      g.append('rect').attr('class', 'node-disabled').attr('width', NS).attr('height', NS);
      g.append('image')
        .attr('class', 'node-cross')
        .attr('href', 'img/cross.png')
        .attr('x', (NS - IMG) / 2 - 2).attr('y', 2)
        .attr('width', IMG + 4).attr('height', IMG + 4);
    }
    g.append('rect').attr('class', 'node-outline').attr('width', NS).attr('height', NS);
  });
  refreshSidebarLinks();
}

// ═══════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════

const tipEl = document.getElementById('tooltip');
const ttIcon = document.getElementById('tt-icon');
const ttName = document.getElementById('tt-name');
const ttAge = document.getElementById('tt-age');
const ttCost = document.getElementById('tt-cost');
const ttEffect = document.getElementById('tt-effect');
const ttStats = document.getElementById('tt-stats');
const ttPrereq = document.getElementById('tt-prereq');
const ttMissing = document.getElementById('tt-missing');
const ttHint = document.getElementById('tt-hint');

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
    p.push(`<span class="res">${icon}${reduced ? `<span class="sp-cost-new">${val}</span>` : (val ?? 0)}</span>`);
  }
  return p.join(' ') || (currentLang === 'es' ? 'Gratis' : 'Free');
}

// Fila de coste para tooltip/paneles: etiqueta + recursos (+ tiempo)
function costRow(labelKey, cost, baseCost = null, time = null) {
  const tStr = time != null
    ? `<span class="res res-time"><img src="img/Icon/reload.webp" class="res-icon" alt="">${time}s</span>` : '';
  return `<div class="cost-row"><span class="cost-label">${t(labelKey)}</span><span class="cost-vals">${costStr(cost, baseCost)}${tStr}</span></div>`;
}

function showTip(ev, n) {
  const isBuilding = n.type === 'building' || n.type === 'defencive';
  const src = n.imgPath || IMG_MAP[n.id];
  ttIcon.src = src || '';
  ttIcon.style.visibility = src ? 'visible' : 'hidden';
  ttName.textContent = nodeLabel(n);
  ttAge.textContent = isBuilding ? t('building') : `${t(n.age, 'ages')} · ${t(n.type)}`;
  tipEl.classList.toggle('tt-unavailable', n.available === false);

  // Stats resumidas de unidades (las techs únicas usan el slot 'unique' pero no son unidades)
  const stats = (n.type === 'unit' || n.type === 'upgrade' || n.type === 'unique') && n.code !== 'QT'
    ? getStatsForNode(n) : null;

  const costRows = [
    n.build_cost    && costRow('build_cost', n.build_cost, null, n.build_time),
    n.research_cost && costRow('research_cost', n.research_cost, null, n.research_time),
    n.train_cost    && costRow('train_cost', n.train_cost, null, stats?.train),
  ].filter(Boolean);
  ttCost.innerHTML = costRows.join('');
  ttCost.style.display = costRows.length ? '' : 'none';

  ttEffect.textContent = tData(n, 'effect');
  if (stats) {
    const items = [
      ['hp', stats.hp], ['attack', stats.attack], ['armor', stats.armor?.[0]], ['parmor', stats.armor?.[1]],
      stats.range ? ['range', stats.range] : null, ['speed', stats.speed], stats.rof ? ['rof', `${stats.rof}s`] : null,
    ].filter(item => item && item[1] != null);
    ttStats.innerHTML = items.map(([k, v]) => `<span class="tt-stat">${statIcon(k)}<b>${v}</b></span>`).join('');
    ttStats.style.display = '';
  } else {
    ttStats.style.display = 'none';
  }

  // Requisito = nodo del que cuelga en el árbol de esta civ
  const parentKey = currentLayout?.parentOf[n.key];
  const parent = parentKey && displayNodes.find(x => x.key === parentKey);
  ttPrereq.textContent = parent ? `${t('prereq')}: ${nodeLabel(parent)}` : '';
  ttMissing.textContent = n.available === false ? t('missing') : '';
  ttHint.textContent = t(canSimulate(n) ? 'click_simulate' : 'click_details');

  tipEl.style.display = 'block';
  moveTip(ev);
}

function hideTip() { tipEl.style.display = 'none'; }
function moveTip(ev) {
  const pad = 12;
  const w = tipEl.offsetWidth, h = tipEl.offsetHeight;
  let x = ev.clientX + 18, y = ev.clientY + 14;
  if (x + w > window.innerWidth - pad) x = ev.clientX - w - 18;
  if (y + h > window.innerHeight - pad) y = window.innerHeight - h - pad;
  tipEl.style.left = `${Math.max(pad, x)}px`;
  tipEl.style.top = `${Math.max(pad, y)}px`;
}
