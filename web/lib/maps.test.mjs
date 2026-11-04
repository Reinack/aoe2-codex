// Pruebas de los datos de guías por mapa (web/data/map-guides.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const maps = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "data", "map-guides.json"), "utf8"));
const bySlug = Object.fromEntries(maps.map((m) => [m.slug, m]));

test("hay una guía por mapa, con slug único y nombre", () => {
  assert.ok(maps.length >= 50);
  assert.equal(new Set(maps.map((m) => m.slug)).size, maps.length);
  assert.ok(maps.every((m) => m.name && m.quote && m.sections.length > 0));
});

test("los mapas clave existen con su tipo", () => {
  assert.equal(bySlug.arabia.type, "abierto");
  assert.equal(bySlug.arena.type, "cerrado");
  assert.equal(bySlug["black-forest"].type, "cerrado");
  assert.equal(bySlug.nomad.type, "nomada");
});

test("los enlaces entre mapas apuntan a guías existentes (o se descartan)", () => {
  const dangling = maps.flatMap((m) => m.mapLinks.filter((s) => !bySlug[s]).map((s) => `${m.slug}→${s}`));
  assert.ok(dangling.length <= 3, `enlaces rotos: ${dangling.join(", ")}`);
});

test("las civs destacadas son nombres reales de civ", () => {
  const team = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "data", "team-roles.json"), "utf8"));
  const names = new Set(Object.values(team).map((t) => t.name));
  for (const m of maps) for (const h of m.highlights) assert.ok(h.civs.every((c) => names.has(c)), `${m.slug}: ${h.civs}`);
});
