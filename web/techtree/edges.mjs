// Aristas de juego derivadas del tech-tree (complemento de techtree/ingest.mjs).
//
// ingest.mjs pone stats/costos en los nodos y crea (Civ)-[:HAS_*]->(entidad).
// Este script agrega las RELACIONES entre entidades, que son el corazón del grafo:
//
//   (:Tech)-[:AFFECTS {…mod}]->(:Unit|:Building)   de TECHS.affects (+ UNIT_CLASSES)
//   (:Building)-[:TRAINS]->(:Unit)                 del campo node.building (unidades/upgrades)
//   (:Building)-[:RESEARCHES]->(:Tech)             del campo node.building (techs)
//   (:Unit)-[:UPGRADES_TO]->(:Unit)                de node.prereqs (nodos type:'upgrade')
//   (:Tech)-[:ENABLES]->(:Unit|:Building)          best-effort: prereqs que son techs
//
// Requiere que techtree/ingest.mjs --write ya haya corrido (los nodos deben tener
// `tree_id`; acá matcheamos SIEMPRE por tree_id y nunca creamos nodos nuevos).
//
// Idempotente: en --write borra estos 5 tipos de arista y los recrea desde cero
// (son 100% derivados del árbol, así que no hay "dueño" externo que preservar).
//
// Uso:  node techtree/edges.mjs            (dry-run: reporta, no escribe)
//       node techtree/edges.mjs --write    (aplica a Neo4j)

import { loadTree } from "./load.mjs";
import { kindOf } from "./map.mjs";
import { run, driver } from "../db.js";

const EDGE_TYPES = ["AFFECTS", "TRAINS", "RESEARCHES", "UPGRADES_TO", "ENABLES"];

// mod → props escalares de la arista (Neo4j no guarda maps). Copia números/strings/bools.
function flattenMod(mod) {
  const out = {};
  if (!mod) return out;
  for (const [k, v] of Object.entries(mod)) {
    if (v == null) continue;
    if (typeof v === "number" || typeof v === "string" || typeof v === "boolean") out[k] = v;
  }
  return out;
}

// Expande un `affects` (mezcla de nombres de clase e ids sueltos) a ids concretos.
function resolveTargets(affects, UNIT_CLASSES) {
  const ids = new Set();
  for (const a of affects || []) {
    if (UNIT_CLASSES[a]) UNIT_CLASSES[a].forEach((id) => ids.add(id));
    else ids.add(a); // id individual (unidad/edificio) — se filtra por MATCH si no existe
  }
  return [...ids];
}

async function main() {
  const write = process.argv.includes("--write");
  const { NODES, TECHS, UNIT_CLASSES } = await loadTree();
  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // ── 1. AFFECTS: tech → unidad/edificio ──────────────────────────────────────
  const affects = []; // {from, to, props}
  for (const [techId, def] of Object.entries(TECHS)) {
    const props = flattenMod(def.mod);
    for (const to of resolveTargets(def.affects, UNIT_CLASSES)) {
      affects.push({ from: techId, to, props });
    }
  }

  // ── 2/5. TRAINS / RESEARCHES / ENABLES desde node.building y prereqs ─────────
  const trains = [];    // {from:buildingId, to:unitId}
  const researches = []; // {from:buildingId, to:techId}
  const upgrades = [];  // {from:prevUnitId, to:unitId}
  const enables = [];   // {from:techId, to:entityId}

  for (const node of NODES) {
    const kind = kindOf(node);

    // TRAINS / RESEARCHES: el edificio donde vive el nodo lo produce/investiga.
    if (node.building && nodeById.has(node.building)) {
      if (kind === "tech") researches.push({ from: node.building, to: node.id });
      else if (kind === "unit") trains.push({ from: node.building, to: node.id });
    }

    // UPGRADES_TO: cada upgrade sale de su(s) prereq(s) de la misma línea (unidad→unidad).
    if (node.type === "upgrade") {
      for (const p of node.prereqs || []) {
        const pn = nodeById.get(p);
        if (pn && kindOf(pn) === "unit") upgrades.push({ from: p, to: node.id });
      }
    }

    // ENABLES (best-effort): un prereq que es tech habilita este nodo.
    for (const p of node.prereqs || []) {
      const pn = nodeById.get(p);
      if (pn && kindOf(pn) === "tech") enables.push({ from: p, to: node.id });
    }
  }

  console.log("── PLAN DE ARISTAS (derivadas del árbol) ──");
  console.log("AFFECTS      (tech→unidad/edif):", affects.length);
  console.log("TRAINS       (edif→unidad)     :", trains.length);
  console.log("RESEARCHES   (edif→tech)       :", researches.length);
  console.log("UPGRADES_TO  (unidad→unidad)   :", upgrades.length);
  console.log("ENABLES      (tech→entidad)    :", enables.length);
  console.log("(los MATCH por tree_id descartan targets sin nodo en el grafo)");

  if (!write) {
    console.log("\nMuestra AFFECTS:", affects.slice(0, 6).map((e) => `${e.from}→${e.to} ${JSON.stringify(e.props)}`));
    console.log("Muestra UPGRADES_TO:", upgrades.slice(0, 6).map((e) => `${e.from}→${e.to}`));
    console.log("\n(dry-run; usar --write para aplicar)");
    await driver.close();
    return;
  }

  // ── Reset idempotente: borra los 5 tipos (son 100% derivados) ───────────────
  await run(`MATCH ()-[r:${EDGE_TYPES.join("|")}]->() DELETE r`);

  // ── Escritura (MATCH por tree_id en ambos extremos → no crea nodos) ─────────
  const written = {};
  written.AFFECTS = await writeEdges("AFFECTS", affects, { srcLabel: "Tech", withProps: true });
  written.TRAINS = await writeEdges("TRAINS", trains, { srcLabel: "Building" });
  written.RESEARCHES = await writeEdges("RESEARCHES", researches, { srcLabel: "Building" });
  written.UPGRADES_TO = await writeEdges("UPGRADES_TO", upgrades, { srcLabel: "Unit" });
  written.ENABLES = await writeEdges("ENABLES", enables, { srcLabel: "Tech" });

  console.log("\n✓ aristas aplicadas (creadas tras el reset):");
  for (const t of EDGE_TYPES) console.log(`  ${t}:`, written[t]);
  await driver.close();
}

// Crea aristas de un tipo por lotes. Devuelve cuántas quedaron (MERGE post-reset = únicas).
async function writeEdges(rel, rows, { srcLabel, withProps = false } = {}) {
  if (!rows.length) return 0;
  const src = srcLabel ? `:${srcLabel}` : "";
  const setProps = withProps ? "SET r += row.props" : "";
  await run(
    `UNWIND $rows AS row
     MATCH (a${src} {tree_id: row.from})
     MATCH (b {tree_id: row.to})
     MERGE (a)-[r:${rel}]->(b)
     ${setProps}`,
    { rows }
  );
  const [{ c }] = await run(`MATCH ()-[r:${rel}]->() RETURN count(r) AS c`, {});
  return c;
}

main().catch((e) => { console.error(e); process.exit(1); });
