// Pruebas del comercio y las reliquias en el modelo económico.
import { test } from "node:test";
import assert from "node:assert/strict";
import { tradeStats, solve, catalog } from "./eco.mjs";

test("oro por viaje: máximo teórico Ludicrous ≈ 517 (market.md), tolerancia 3%", () => {
  const t = tradeStats({ map: "ludicrous", distance: 480 * Math.SQRT2 });
  assert.ok(Math.abs(t.goldPerTrip - 517) / 517 < 0.03, `dio ${t.goldPerTrip}`);
});

test("el oro por viaje crece casi con el cuadrado de la distancia", () => {
  const a = tradeStats({ map: "large", distance: 100 }).goldPerTrip;
  const b = tradeStats({ map: "large", distance: 200 }).goldPerTrip;
  assert.ok(b / a > 2.5 && b / a < 4.5);
});

test("hacen falta más de 5 casillas para generar oro", () => {
  assert.equal(tradeStats({ map: "medium", distance: 5 }).goldPerTrip, 0);
});

test("Caravan acelera el cart un 50% y Spanish suma +25% de oro por viaje", () => {
  const base = tradeStats({ map: "medium", distance: 150 });
  const car = tradeStats({ map: "medium", distance: 150, caravan: true });
  assert.ok(Math.abs(car.perCartPerMin.gold / base.perCartPerMin.gold - 1.5) < 0.02);
  const sp = tradeStats({ map: "medium", distance: 150, mods: ["spanish_team"] });
  assert.ok(Math.abs(sp.goldPerTrip / base.goldPerTrip - 1.25) < 0.01);
});

test("Bengalis suman comida además del oro", () => {
  const t = tradeStats({ map: "medium", distance: 150, mods: ["bengali_team"] });
  assert.ok(t.perCartPerMin.food > 0);
});

test("reliquias: 5 base = 150 oro/min; Aztecs +10 y Burgundians +20 comida cada una", () => {
  const base = solve({ items: [], supply: { passive: { relics: 5 } } });
  assert.equal(base.passiveIncome.gold, 150);
  const mods = solve({ items: [], supply: { passive: { relics: 5, relicMods: ["aztec_team", "burgundian_team"] } } });
  assert.equal(mods.passiveIncome.gold, 200);
  assert.equal(mods.passiveIncome.food, 100);
});

test("sin distancia el comercio usa el valor plano anterior (compatibilidad)", () => {
  const r = solve({ items: [], supply: { passive: { tradeCarts: 10 } } });
  assert.equal(r.passiveIncome.gold, 400);
  assert.equal(r.passiveDetail.trade.mode, "plano");
});

test("con distancia el comercio reduce la demanda de oro del plan", () => {
  const items = [{ id: "paladin", lines: 4 }];
  const sin = solve({ items, age: "imperial" });
  const con = solve({ items, age: "imperial", supply: { passive: { tradeCarts: 40, trade: { map: "large", distance: 180 } } } });
  assert.ok(con.perResource.gold.fillVillagers < sin.perResource.gold.fillVillagers);
});

test("el catálogo expone los mods de reliquia y comercio", () => {
  const c = catalog();
  assert.ok(c.passive.relic.mods.aztec_team);
  assert.ok(c.passive.trade.mapSizes.ludicrous);
});

test("passiveSummary devuelve ingreso y detalle sin plan de producción", async () => {
  const { passiveSummary } = await import("./eco.mjs");
  const r = passiveSummary({ relics: 5, tradeCarts: 10, trade: { map: "medium", distance: 150 } });
  assert.ok(r.passiveIncome.gold > 150);
  assert.equal(r.passiveDetail.trade.mode, "distancia");
  assert.deepEqual(passiveSummary(null).passiveIncome, { food: 0, wood: 0, gold: 0, stone: 0 });
});
