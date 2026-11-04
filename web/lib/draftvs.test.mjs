// Pruebas del draft contra rivales: estructura y propiedades, no valores exactos del radar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { draftVs, pairScore, documented } from "./draftvs.mjs";

test("ranking ordenado y sin repetir al rival ni a los excluidos", () => {
  const r = draftVs({ vs: ["mongols"], map: "open", exclude: ["chinese"], limit: 10 });
  const scores = r.candidates.map((c) => c.score);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  assert.ok(!r.candidates.some((c) => c.civ === "mongols" || c.civ === "chinese"));
});

test("el filtro de posición respeta flanco/pocket (o flex)", () => {
  const r = draftVs({ vs: ["franks"], map: "closed", slot: "pocket", limit: 20 });
  assert.ok(r.candidates.length > 0);
  assert.ok(r.candidates.every((c) => ["pocket", "flex"].includes(c.position)));
});

test("con un pool, cada candidata trae su puntaje por rival y los bans salen del pool", () => {
  const r = draftVs({ vs: ["mongols", "franks", "khmer"], map: "open", bans: 2 });
  assert.equal(r.candidates[0].per.length, 3);
  assert.equal(r.bans.length, 2);
  assert.ok(r.bans.every((b) => ["mongols", "franks", "khmer"].includes(b.civ)));
});

test("alerta Phosphor solo en mapa abierto", () => {
  assert.ok(draftVs({ vs: ["armenians"], map: "open" }).phosphorAlert.length >= 1);
  assert.equal(draftVs({ vs: ["armenians"], map: "closed" }).phosphorAlert.length, 0);
});

test("partidas documentadas: un cruce se cuenta una vez aunque esté en ambas fichas", () => {
  const d = documented("franks", "byzantines");
  const keys = d.map((x) => x.file + "|" + x.map);
  assert.equal(new Set(keys).size, keys.length);
});

test("pairScore devuelve razones y rechaza rival sin radar", () => {
  assert.ok(pairScore("franks", "mongols", "open").reasons.length >= 2);
  assert.ok(draftVs({ vs: ["noexiste"] }).error);
});
