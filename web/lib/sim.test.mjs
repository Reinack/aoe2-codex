// Pruebas del simulador: tendencias conocidas del juego (no valores exactos).
import { test } from "node:test";
import assert from "node:assert/strict";
import { simulate, simMatrix, simCatalog } from "./sim.mjs";

const fight = (a, na, b, nb, o) => simulate([{ id: a, count: na }], [{ id: b, count: nb }], o);

test("catálogo con stats y costo", async () => {
  const c = await simCatalog();
  assert.ok(c.length >= 30);
  assert.ok(c.every((u) => u.hp > 0 && u.value > 0));
});

test("Halberdiers a igual costo vencen a Paladines (bonus +32 vs Cavalry)", async () => {
  const r = await fight("paladin", 10, "halberdier", 20);
  assert.equal(r.winner, "B");
});

test("Elite Skirmishers vencen a Arbalesters a igual costo", async () => {
  const r = await fight("eliteskirm", 35, "arbalester", 30);
  assert.equal(r.winner, "A");
});

test("las mejoras de armadura cambian el resultado", async () => {
  const base = await fight("knight", 10, "arbalester", 10);
  const armored = await fight("knight", 10, "arbalester", 10, { upgradesA: { armPierce: 3 } });
  assert.ok(armored.a.rows[0].left >= base.a.rows[0].left);
});

test("matriz: diagonal 0 y antisimétrica en signo", async () => {
  const m = await simMatrix(["halberdier", "paladin", "arbalester"]);
  assert.equal(m.cells[0][0], 0);
  assert.ok(m.cells[0][1] * m.cells[1][0] <= 0);
});

test("rechaza ejércitos vacíos", async () => {
  await assert.rejects(() => simulate([], [{ id: "knight", count: 1 }]));
});
