// ═══════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════

const NW = 68, NH = 68, NPADX = 14, NPADY = 10;
const SLOT_H = 108;         // Height of a sub-row (node + 40px padding)
const LEFT_LABEL_W = 175;
const TOP_PAD = 10;         // Espacio superior antes de la primera edad
const AGE_TOP_H = 18;       // Space at top of age bands
const BLD_GAP = 22;         // Separación entre grupos de edificios

function computeLayout(currentNodes, currentBuildings) {

  // ── Column remapping ──────────────────────────────────────
  // Only visible nodes are in currentNodes. Collect the actual columns
  // used per group and remap them to consecutive indices so that gaps
  // left by hidden regional/unique units are eliminated.
  const usedCols = {}; // key → sorted array of original col values
  currentNodes.forEach(n => {
    const key = n.type === 'defencive' ? 'defencive' : n.building;
    if (!usedCols[key]) usedCols[key] = new Set();
    usedCols[key].add(n.col);
  });
  const colRemap = {}; // key → { originalCol: compactCol }
  Object.entries(usedCols).forEach(([key, colSet]) => {
    const sorted = [...colSet].sort((a, b) => a - b);
    colRemap[key] = {};
    sorted.forEach((col, idx) => { colRemap[key][col] = idx; });
  });

  const remappedCol = (key, col) => colRemap[key]?.[col] ?? col;

  // ── maxRow based on compacted columns ────────────────────
  const maxRow = {};
  currentBuildings.forEach(b => { maxRow[b.id] = -1; });
  currentNodes.forEach(n => {
    const key = n.type === 'defencive' ? 'defencive' : n.building;
    maxRow[key] = Math.max(maxRow[key] ?? -1, remappedCol(key, n.col));
  });

  // ── X allocation ─────────────────────────────────────────
  const bldX = {};
  const colGroupX = {};
  let x = LEFT_LABEL_W;
  const allocatedColGroups = new Set();

  currentBuildings.forEach(b => {
    if (b.layout_col) {
      if (!allocatedColGroups.has(b.layout_col)) {
        allocatedColGroups.add(b.layout_col);
        colGroupX[b.layout_col] = x;
        x += (NW + NPADX) + BLD_GAP;
      }
      bldX[b.id] = colGroupX[b.layout_col];
    } else {
      bldX[b.id] = x;
      const cols = Math.max((maxRow[b.id] ?? 0) + 1, 1);
      x += cols * (NW + NPADX) + BLD_GAP;
    }
  });

  // Place defensive group AFTER university
  if (maxRow['defencive'] !== undefined) {
    const uniX = bldX['university'] ?? x;
    const uniCols = (maxRow['university'] ?? 0) + 1;
    colGroupX['defencive'] = uniX + uniCols * (NW + NPADX) + BLD_GAP;
    const defEnd = colGroupX['defencive'] + ((maxRow['defencive'] ?? 0) + 1) * (NW + NPADX) + BLD_GAP;
    x = Math.max(x, defEnd);
  }

  // ── Age band heights ──────────────────────────────────────
  const ageYStart = [TOP_PAD, 0, 0, 0];
  const ageHArray = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    ageHArray[i] = AGE_TOP_H + 2 * SLOT_H + 10;
    if (i > 0) ageYStart[i] = ageYStart[i - 1] + ageHArray[i - 1];
  }

  // ── Node positions ────────────────────────────────────────
  const pos = {};
  currentNodes.forEach(n => {
    const isDef = n.type === 'defencive';
    const key = isDef ? 'defencive' : n.building;
    let colIndex = remappedCol(key, n.col);

    // If node has a prereq in the same building/age, align to prereq's column
    if (n.prereqs && n.prereqs.length > 0) {
      const pId = n.prereqs[0];
      const pNode = currentNodes.find(p => p.id === pId);
      if (pNode && ((isDef && pNode.type === 'defencive') || pNode.building === n.building)
          && Math.floor(pNode.row / 2) === Math.floor(n.row / 2)) {
        colIndex = remappedCol(key, pNode.col);
      }
    }

    const ageIndex = Math.floor(n.row / 2);
    const subRow = n.row % 2;
    const baseX = isDef ? (colGroupX['defencive'] ?? x) : bldX[n.building];
    pos[n.id] = {
      x: baseX + colIndex * (NW + NPADX),
      y: ageYStart[ageIndex] + AGE_TOP_H + subRow * SLOT_H + 10,
    };
  });

  // ── Building positions (centered over visible nodes) ──────
  const bldPos = {};
  currentBuildings.forEach(b => {
    const ageIdx = Math.floor((b.row ?? b.age * 2) / 2);
    const subRow = (b.row ?? b.age * 2) % 2;
    const key = b.id;

    const bldNodes = currentNodes.filter(n => n.building === b.id);
    let minCol = Infinity, maxCol = -Infinity;
    bldNodes.forEach(n => {
      let ci = remappedCol(key, n.col);
      if (n.prereqs && n.prereqs.length > 0) {
        const pNode = currentNodes.find(p => p.id === n.prereqs[0]);
        if (pNode && pNode.building === n.building && Math.floor(pNode.row / 2) === Math.floor(n.row / 2)) {
          ci = remappedCol(key, pNode.col);
        }
      }
      if (ci < minCol) minCol = ci;
      if (ci > maxCol) maxCol = ci;
    });
    if (minCol === Infinity) { minCol = 0; maxCol = 0; }

    bldPos[b.id] = {
      x: bldX[b.id] + ((minCol + maxCol) / 2) * (NW + NPADX),
      y: ageYStart[ageIdx] + AGE_TOP_H + subRow * SLOT_H + 10,
    };
  });

  return {
    bldX, bldPos, maxRow, pos, ageYStart, ageHArray,
    totalW: x, totalH: ageYStart[3] + ageHArray[3] + 20,
  };
}
