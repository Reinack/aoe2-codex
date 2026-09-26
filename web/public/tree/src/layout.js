// ═══════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════
//
// Arquitectura del árbol del juego (una por civilización, ver data/civ_trees.js):
//   · Cada edificio trae una grilla de 8 sub-filas (2 por edad) × N columnas.
//   · Los edificios se reparten en carriles de izquierda a derecha; los que no
//     tienen grilla propia (torres, murallas, casa, maravilla…) se apilan en el
//     mismo carril hasta que cambia el tipo de edificio.
//   · Conexiones: edificio → edificio (mejora o requisito), ítem → ítem de
//     arriba (línea de mejora) y edificio → primer ítem de cada columna.

const NS = 80;              // Lado del nodo (cuadrado)
const COL_GAP = 12;         // Separación horizontal entre columnas de una grilla
const COL_W = NS + COL_GAP; // Paso de columna
const ROW_H = NS + 42;      // Paso de sub-fila (nodo + espacio para conectores)
const LEFT_LABEL_W = 170;   // Franja izquierda con los nombres de las edades
const TOP_PAD = 14;         // Margen superior
const LANE_GAP = 30;        // Separación entre carriles de edificios
const BUS_DROP = 16;        // Distancia del borde inferior del padre a la barra de conexión
const SHEET_MARGIN = 26;    // Fondo visible alrededor de la lámina al desplazarse

function computeTreeLayout(civTree) {
  const buildings = civTree.b.map(b => ({ ...b }));
  const pos = {};          // key → {x, y}
  const cells = [];        // ítems de grilla con su key, edificio, fila y columna
  const edges = [];        // [fromKey, toKey]
  const parentOf = {};     // key → key del padre (para resaltar la ruta)

  const rowY = row => TOP_PAD + row * ROW_H;

  // ── Carriles ─────────────────────────────────────────────
  let laneX = LEFT_LABEL_W;
  let laneW = 0;
  let first = true;
  let prevRow = 0;
  let prevOwnColumn = true;
  let prevType = '';

  buildings.forEach(b => {
    const cols = b.g ? b.g[0].length : 1;
    const width = cols * COL_W;
    const newLane = b.nc === true || prevOwnColumn || !!b.g || prevRow > b.r || prevType !== b.t;

    if (newLane) {
      laneX += first ? 0 : laneW + LANE_GAP;
      laneW = width;
      first = false;
    } else {
      laneW = Math.max(laneW, width);
      if (prevRow === b.r) b.r++;
    }
    // Un edificio nunca comparte fila con el que lo habilita
    if (b.l) {
      const linked = buildings.find(x => x.id === b.l);
      if (linked && linked.r === b.r) b.r++;
    }

    // Centrado sobre el ancho actual del carril (con grilla: exactamente sobre ella)
    b.key = `b:${b.id}`;
    pos[b.key] = { x: laneX + (laneW - COL_W) / 2, y: rowY(b.r) };

    if (b.g) {
      b.g.forEach((row, r) => row.forEach((cell, c) => {
        if (!cell) return;
        const key = `${b.id}:${r}:${c}`;
        pos[key] = { x: laneX + c * COL_W, y: rowY(r) };
        cells.push({ key, building: b.id, row: r, col: c, cell });
      }));
    }

    prevRow = b.r;
    prevType = b.t;
    prevOwnColumn = b.nc !== false;
  });
  const totalW = laneX + laneW + LANE_GAP;

  // ── Conexiones entre edificios ───────────────────────────
  const byId = Object.fromEntries(buildings.map(b => [b.id, b]));
  buildings.forEach(b => {
    let from = null;
    if (b.f && byId[b.f]) from = byId[b.f];
    else if (b.l && byId[b.l] && byId[b.l].nc !== false) from = byId[b.l];
    if (from) {
      edges.push([from.key, b.key]);
      parentOf[b.key] = from.key;
    }
  });

  // ── Conexiones de la grilla ──────────────────────────────
  cells.forEach(({ key, building, row, col, cell }) => {
    const link = cell[3];
    let from = null;
    if (link === 'b') {
      from = `b:${building}`;
    } else if (link === 'a') {
      const grid = byId[building].g;
      for (let r = row - 1; r >= 0; r--) {
        if (grid[r][col]) { from = `${building}:${r}:${col}`; break; }
      }
    }
    if (from) {
      edges.push([from, key]);
      parentOf[key] = from;
    } else {
      // Sin línea visible, igual pertenece a su edificio (para el resaltado)
      parentOf[key] = `b:${building}`;
    }
  });

  // ── Bandas de edad ───────────────────────────────────────
  const ageYStart = [0, 1, 2, 3].map(i => (i === 0 ? 0 : rowY(i * 2) - (ROW_H - NS) / 2));
  const ageHArray = ageYStart.map((y, i) => (i < 3 ? ageYStart[i + 1] : rowY(8) - (ROW_H - NS) / 2) - y);
  const totalH = ageYStart[3] + ageHArray[3];

  return { buildings, cells, pos, edges, parentOf, ageYStart, ageHArray, totalW, totalH };
}
