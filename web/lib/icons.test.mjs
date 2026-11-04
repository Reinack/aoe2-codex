// Integridad del catálogo de íconos (web/data/icons.json): cada ícono apunta a un archivo real.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const WEB = join(dirname(fileURLToPath(import.meta.url)), "..");
const icons = JSON.parse(readFileSync(join(WEB, "data", "icons.json"), "utf8"));
const team = JSON.parse(readFileSync(join(WEB, "data", "team-roles.json"), "utf8"));

test("hay íconos de unidades, techs y edificios", () => {
  const kinds = new Set(Object.values(icons.items).map((i) => i.k));
  assert.deepEqual([...kinds].sort(), ["building", "tech", "unit"]);
  assert.ok(Object.keys(icons.items).length > 200);
});

test("todos los archivos de íconos existen en public/tree", () => {
  const missing = Object.entries(icons.items).filter(([, i]) => !existsSync(join(WEB, "public", "tree", i.i))).map(([id]) => id);
  assert.deepEqual(missing, []);
  for (const p of [...Object.values(icons.ages), ...Object.values(icons.stats), ...Object.values(icons.res)])
    assert.ok(existsSync(join(WEB, "public", "tree", p)), p);
});

test("el índice por nombre apunta a ids del catálogo", () => {
  for (const [name, id] of Object.entries(icons.names)) assert.ok(icons.items[id], `${name} → ${id}`);
  for (const n of ["barracks", "mill", "lumber camp", "feudal age", "town center", "knight", "paladin", "loom", "house"])
    assert.ok(icons.names[n], n);
});

test("las 56 civs tienen emblema", () => {
  const sin = Object.keys(team).filter((s) => !icons.civs.includes(s));
  assert.deepEqual(sin, []);
});

test("los ids que usa el Lab para íconos de pestañas y cobertura existen", () => {
  for (const id of ["barracks", "outpost", "scout", "castle", "tc", "knight", "blacksmith", "university",
    "paladin", "halberdier", "arbalester", "eliteskirm", "heavycamel", "eliteeleph", "hcavarcher", "handcannon", "siegeonager", "bombcannon", "monk", "galleon"])
    assert.ok(icons.items[id], id);
});
