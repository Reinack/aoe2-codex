// Puente tree-id ↔ nota del vault + reporte de incongruencias árbol↔vault.
//
// Empareja cada nodo del tech-tree (por nombre EN del locale) con la nota del
// vault del mismo tipo (Unit/Tech/Building/Civ) ya cargada en Neo4j, vía slug.
// Produce:
//   - mapping  : tree-id → { name, kind, notePath|null }
//   - report   : matched / treeOnly / patch overrides / cobertura
// y escribe el MD de incongruencias en el vault (carpeta meta/, no raw/).

import { writeFileSync } from "node:fs";
import { loadTree, slugify } from "./load.mjs";
import { run, driver } from "../db.js";
import { OVERRIDES, DOCUMENTED, PATCH_ID, PATCH_DATE } from "./patch.mjs";

const REPORT_PATH = "D:/Boveda/Aoe/meta/codex-incongruencias-arbol-vault.md";

// Clasifica un nodo del árbol en unit / tech / building para enrutar el match.
export function kindOf(node) {
  const t = node.type;
  if (t === "building" || t === "defencive") return "building";
  if (t === "tech") return "tech";
  if (t === "unit" || t === "upgrade") return "unit";
  if (t === "unique") return /uniquetech/.test(node.id) ? "tech" : "unit";
  return "unit";
}

// Etiqueta de label en Neo4j por kind.
const LABEL = { unit: "Unit", tech: "Tech", building: "Building" };

// Trae las notas del vault de un tipo, indexadas por slug(title).
async function vaultIndex(label) {
  const rows = await run(
    `MATCH (n:${label}) WHERE n.title IS NOT NULL RETURN n.title AS title, n.path AS path`
  );
  const bySlug = new Map();
  for (const r of rows) {
    const s = slugify(r.title);
    if (!bySlug.has(s)) bySlug.set(s, r);
  }
  return { rows, bySlug };
}

export async function buildMapping() {
  const tree = await loadTree();
  const idx = {
    unit: await vaultIndex("Unit"),
    tech: await vaultIndex("Tech"),
    building: await vaultIndex("Building"),
  };

  const mapping = {};      // tree-id → {name, kind, notePath}
  const matched = [];      // {id, name, kind, path}
  const treeOnly = [];     // {id, name, kind} sin nota
  const usedPaths = new Set();

  for (const node of tree.NODES) {
    const kind = kindOf(node);
    const name = tree.names[node.id] || prettify(node.id);
    const slug = slugify(name);
    const hit = idx[kind].bySlug.get(slug) || idx.unit.bySlug.get(slug)
             || idx.tech.bySlug.get(slug) || idx.building.bySlug.get(slug);
    mapping[node.id] = { name, kind, notePath: hit ? hit.path : null };
    if (hit) {
      matched.push({ id: node.id, name, kind, path: hit.path });
      usedPaths.add(hit.path);
    } else {
      treeOnly.push({ id: node.id, name, kind });
    }
  }

  return { tree, idx, mapping, matched, treeOnly, usedPaths };
}

function prettify(id) {
  return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtCost(c) {
  if (!c) return "—";
  return Object.entries(c).map(([k, v]) => `${v}${k[0].toUpperCase()}`).join("/");
}

// ── MD de incongruencias ─────────────────────────────────────────────────────
function buildMarkdown({ tree, matched, treeOnly }) {
  const today = new Date().toISOString().slice(0, 10);
  const byKind = (arr, k) => arr.filter((x) => x.kind === k).length;

  let md = `# Incongruencias árbol↔vault — AoE2 Codex

> Generado automáticamente por el pipeline del codex (web/techtree/map.mjs).
> **No editar a mano:** se regenera en cada ingesta del tech-tree.
> Fecha: ${today}

Este documento registra dónde el **Aoe2-Tech-Tree-Advanced** (fuente de verdad de
stats/costos en el codex) discrepa de mi base de conocimiento del vault, y qué dato
gana. Regla: **el árbol manda en todo, excepto lo afectado por [[meta/${PATCH_ID}]]**
(${PATCH_DATE}), donde gana el vault porque el árbol es pre-parche.

---

## 1. Overrides del parche aplicados en la ingesta

El repo del árbol se pusheó el 2026-05-29; el parche es del ${PATCH_DATE}. Para estas
entidades, la ingesta **descarta el valor del árbol** y escribe el valor post-parche.

| Entidad | Campo | Árbol (pre) | Vault (post, aplicado) | Nota |
|---|---|---|---|---|
`;
  for (const [id, o] of Object.entries(OVERRIDES)) {
    const fields = { ...(o.node || {}), ...(o.stat || {}) };
    for (const [f, v] of Object.entries(fields)) {
      const pre = o.pre ? o.pre[f] : undefined;
      const preStr = typeof pre === "object" ? fmtCost(pre) : (pre ?? "—");
      const postStr = typeof v === "object" ? fmtCost(v) : v;
      const flag = o.flag ? " ⚠️" : "";
      md += `| ${o.name}${flag} | ${f} | ${preStr} | ${postStr} | ${o.note ? o.note.split(".")[0] + "." : ""} |\n`;
    }
  }

  md += `
> ⚠️ = el dato del árbol **ni siquiera coincidía con el valor pre-parche conocido**
> (no es solo pre/post: el árbol estaba directamente mal para esa entidad).

### Detalle por entidad
`;
  for (const o of Object.values(OVERRIDES)) {
    md += `- **${o.name}**: ${o.note}\n`;
  }

  md += `
---

## 2. Cambios del parche NO modelados como stat de nodo

Bonos de civilización y unidades únicas de castillo cuyas estadísticas el árbol no
expone de forma limpia a nivel nodo. **No se ingesta número**; el vault es autoritativo.

| Ámbito | Cambio |
|---|---|
`;
  for (const d of DOCUMENTED) md += `| ${d.scope} | ${d.change} |\n`;

  md += `
---

## 3. Cobertura del emparejamiento tree↔vault

Cuántos nodos del árbol tienen nota de prosa en el vault. Los "solo en árbol" no son
errores: son entidades de juego que aún no tienen nota dedicada (genéricas como
*Man-at-Arms*, upgrades de blacksmith, etc.). El árbol les da los números igual.

| Tipo | Nodos árbol | Con nota vault | Solo en árbol |
|---|---|---|---|
| Unidades | ${byKind(matched, "unit") + byKind(treeOnly, "unit")} | ${byKind(matched, "unit")} | ${byKind(treeOnly, "unit")} |
| Tecnologías | ${byKind(matched, "tech") + byKind(treeOnly, "tech")} | ${byKind(matched, "tech")} | ${byKind(treeOnly, "tech")} |
| Edificios | ${byKind(matched, "building") + byKind(treeOnly, "building")} | ${byKind(matched, "building")} | ${byKind(treeOnly, "building")} |
| **Total** | **${matched.length + treeOnly.length}** | **${matched.length}** | **${treeOnly.length}** |

### Nodos del árbol sin nota en el vault (muestra, top 40 por tipo)
`;
  for (const k of ["unit", "tech", "building"]) {
    const list = treeOnly.filter((x) => x.kind === k).map((x) => x.name).slice(0, 40);
    md += `\n**${k}** (${treeOnly.filter((x) => x.kind === k).length}): ${list.join(", ")}\n`;
  }

  md += `
---

## Refs
- [[meta/${PATCH_ID}]] — parche que motiva los overrides
- Fuente de datos: \`Aoe2-Tech-Tree-Advanced/public/src/data/\` (nodes, units, tech_data, civ/)
- Pipeline: \`aoe2-codex/web/techtree/\`
`;
  return md;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const m = await buildMapping();
  const md = buildMarkdown(m);
  if (process.argv.includes("--write")) {
    writeFileSync(REPORT_PATH, md, "utf-8");
    console.log("MD escrito en:", REPORT_PATH);
  }
  console.log("matched:", m.matched.length, "| treeOnly:", m.treeOnly.length);
  console.log("  unit  matched/only:", m.matched.filter(x=>x.kind==="unit").length, "/", m.treeOnly.filter(x=>x.kind==="unit").length);
  console.log("  tech  matched/only:", m.matched.filter(x=>x.kind==="tech").length, "/", m.treeOnly.filter(x=>x.kind==="tech").length);
  console.log("  bldg  matched/only:", m.matched.filter(x=>x.kind==="building").length, "/", m.treeOnly.filter(x=>x.kind==="building").length);
  console.log("muestra matched:", m.matched.slice(0, 8).map(x=>`${x.id}→${x.path.split("/").pop()}`));
  await driver.close();
}
