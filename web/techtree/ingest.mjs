// Ingesta de stats del tech-tree a Neo4j (Fix 5).
//
// - Enriquece nodos Unit/Tech/Building del vault con stats/costos del árbol,
//   keyeados por `tree_id` (puente con el visual).
// - Para entidades del árbol sin nota de vault, crea nodos source:'techtree'.
// - Aplica los overrides de patch-177723 (gana el vault post-parche).
// - Crea aristas (Civ)-[:HAS_UNIT|HAS_TECH|HAS_BUILDING]->(entidad) desde el
//   array `available` de cada civ.
//
// Idempotente: re-correr no duplica (MATCH por path / MERGE por tree_id+rel).
// Uso:  node techtree/ingest.mjs            (dry-run: reporta, no escribe)
//       node techtree/ingest.mjs --write    (aplica a Neo4j)

import { buildMapping, kindOf } from "./map.mjs";
import { slugify } from "./load.mjs";
import { run, driver } from "../db.js";
import { OVERRIDES, PATCH_ID } from "./patch.mjs";

const LABEL = { unit: "Unit", tech: "Tech", building: "Building" };
const REL   = { unit: "HAS_UNIT", tech: "HAS_TECH", building: "HAS_BUILDING" };

// Aplana train_cost / research_cost a propiedades escalares (Neo4j no guarda maps).
function flattenCost(prefix, cost, out) {
  if (!cost) return;
  for (const res of ["food", "wood", "gold", "stone"]) {
    if (cost[res] != null) out[`${prefix}_${res}`] = cost[res];
  }
}

// Construye las propiedades de stats de una entidad del árbol, con override de parche.
function buildProps({ node, stats, name }) {
  const p = { name, tree_type: node.type, age: node.age };
  if (node.building) p.building = node.building;
  if (node.variant) p.tree_variant = node.variant;
  if (node.special) p.special = true;

  if (stats) {
    if (stats.hp != null) p.hp = stats.hp;
    if (stats.attack != null) p.attack = stats.attack;
    if (Array.isArray(stats.armor)) { p.armor_melee = stats.armor[0]; p.armor_pierce = stats.armor[1]; }
    if (stats.range != null) p.range = stats.range;
    if (stats.speed != null) p.speed = stats.speed;
    if (stats.rof != null) p.rof = stats.rof;
    if (stats.los != null) p.los = stats.los;
    if (stats.train != null) p.train_time = stats.train;
  }
  // Edificios: stats/costo viven INLINE en el nodo (node.stats / node.build_cost),
  // no en unitStats/train_cost. Los mapeamos con el mismo esquema que las unidades.
  if (node.stats) {
    const bs = node.stats;
    if (bs.hp != null) p.hp = bs.hp;
    if (Array.isArray(bs.armor)) { p.armor_melee = bs.armor[0]; p.armor_pierce = bs.armor[1]; }
    if (bs.attack != null) p.attack = bs.attack;
    if (bs.range != null) p.range = bs.range;
    if (bs.los != null) p.los = bs.los;
  }

  flattenCost("cost", node.train_cost, p);
  flattenCost("cost", node.build_cost, p);   // edificios
  flattenCost("research", node.research_cost, p);
  if (node.research_time != null) p.research_time = node.research_time;
  if (node.build_time != null) p.build_time = node.build_time;

  // Override de patch-177723: gana el vault (post-parche).
  const ov = OVERRIDES[node.id];
  if (ov) {
    if (ov.stat?.train != null) p.train_time = ov.stat.train;
    if (ov.stat?.hp != null) p.hp = ov.stat.hp;
    if (ov.node?.train_cost) { delete p.cost_food; delete p.cost_wood; delete p.cost_gold; delete p.cost_stone; flattenCost("cost", ov.node.train_cost, p); }
    if (ov.node?.research_cost) { delete p.research_food; delete p.research_wood; delete p.research_gold; delete p.research_stone; flattenCost("research", ov.node.research_cost, p); }
    if (ov.node?.research_time != null) p.research_time = ov.node.research_time;
    p.patched = PATCH_ID;
  }
  return p;
}

async function main() {
  const write = process.argv.includes("--write");
  const { tree, mapping, matched, treeOnly } = await buildMapping();

  // id → node del árbol (para resolver `available` y stats).
  const nodeById = new Map(tree.NODES.map((n) => [n.id, n]));

  // Payloads de upsert: matched (por path) y treeOnly (por tree_id, nodo nuevo).
  const matchedRows = [];   // {path, tree_id, kind, props}
  const newRows = { unit: [], tech: [], building: [] };

  for (const node of tree.NODES) {
    const kind = kindOf(node);
    if (!LABEL[kind]) continue;
    const name = mapping[node.id].name;
    const stats = tree.unitStats[node.id];
    const props = buildProps({ node, stats, name });
    const notePath = mapping[node.id].notePath;
    if (notePath) {
      matchedRows.push({ path: notePath, tree_id: node.id, props });
    } else {
      newRows[kind].push({ tree_id: node.id, props });
    }
  }

  // Civs: key (lowercase) → path de la nota del vault, vía slug(title).
  // Algunos títulos del vault llevan sufijo ES ("Burmese-Birmanos") → match por prefijo.
  const civNotes = await run(`MATCH (c:Civ) WHERE c.title IS NOT NULL RETURN c.title AS title, c.path AS path`);
  const civSlugs = civNotes.map((r) => ({ slug: slugify(r.title), path: r.path }));
  const civPathFor = (key) => {
    const k = slugify(key);
    const exact = civSlugs.find((c) => c.slug === k);
    if (exact) return exact.path;
    const pref = civSlugs.find((c) => c.slug === k || c.slug.startsWith(k + "-"));
    return pref ? pref.path : null;
  };

  // Aristas HAS_* desde `available` de cada civ.
  const edgeRows = [];      // {civPath, tree_id, rel}
  let civMiss = 0, availMiss = 0;
  for (const [civKey, civ] of Object.entries(tree.CIVS)) {
    const civPath = civPathFor(civKey);
    if (!civPath) { civMiss++; continue; }
    for (const id of civ.available || []) {
      const n = nodeById.get(id);
      if (!n) { availMiss++; continue; }
      const kind = kindOf(n);
      if (!REL[kind]) continue;
      edgeRows.push({ civPath, tree_id: id, rel: REL[kind] });
    }
  }

  console.log("── PLAN DE INGESTA ──");
  console.log("upsert sobre notas vault:", matchedRows.length);
  console.log("nodos nuevos (techtree):", newRows.unit.length, "unit /", newRows.tech.length, "tech /", newRows.building.length, "building");
  console.log("aristas HAS_*:", edgeRows.length, `(civs sin match: ${civMiss}, available ids no-nodo: ${availMiss})`);
  console.log("overrides de parche aplicados:", matchedRows.filter(r=>r.props.patched).length + Object.values(newRows).flat().filter(r=>r.props.patched).length);

  if (!write) { console.log("\n(dry-run; usar --write para aplicar)"); await driver.close(); return; }

  // ── Fase A: upsert de nodos ──
  await run(
    `UNWIND $rows AS row
     MATCH (n {path: row.path})
     SET n.tree_id = row.tree_id, n.stat_source = 'techtree', n += row.props`,
    { rows: matchedRows }
  );
  for (const kind of ["unit", "tech", "building"]) {
    if (!newRows[kind].length) continue;
    await run(
      `UNWIND $rows AS row
       MERGE (n:${LABEL[kind]} {tree_id: row.tree_id})
       SET n.source = 'techtree', n.stat_source = 'techtree', n.title = row.props.name, n += row.props`,
      { rows: newRows[kind] }
    );
  }

  // ── Fase B: aristas HAS_* (target por tree_id: vault-enriquecido o techtree-nuevo) ──
  for (const rel of ["HAS_UNIT", "HAS_TECH", "HAS_BUILDING"]) {
    const rows = edgeRows.filter((e) => e.rel === rel);
    if (!rows.length) continue;
    await run(
      `UNWIND $rows AS row
       MATCH (c:Civ {path: row.civPath})
       MATCH (t {tree_id: row.tree_id})
       MERGE (c)-[:${rel}]->(t)`,
      { rows }
    );
  }

  console.log("\n✓ ingesta aplicada");
  await driver.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
