// node --test web/lib/uu-counters.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classBonus, descToLines, inferUniqueCounters, LINE_NOTE, typeLine, unitProfile } from "./uu-counters.mjs";

const DB = JSON.parse(readFileSync(new URL("../data/unit-classes.json", import.meta.url), "utf8"));
const LINES = Object.keys(LINE_NOTE).map((id) => ({ id, profile: DB[LINE_NOTE[id]] }));
const ids = (list) => list.map((x) => x.id);

describe("counters inferidos de unidades únicas", () => {
  it("cada línea genérica tiene su ficha con clases", () => {
    for (const [line, slug] of Object.entries(LINE_NOTE)) assert.ok(DB[slug]?.classes, `${line} → ${slug}`);
  });

  it("la descripción en español se mapea a líneas", () => {
    assert.deepEqual(descToLines("skirmishers, la línea del lancero y los Camel Riders"),
      ["camel-line", "skirmisher-line", "spearman-line"]);
    assert.deepEqual(descToLines("unidades a corta distancia"), []);
    assert.deepEqual(descToLines("arqueros a caballo"), ["cavalry-archer"]);
  });

  it("el bonus descuenta la armadura de la clase", () => {
    // Cataphract tiene 12+ de armadura en la clase Cavalry: el Halberdier no le pega +32.
    const cata = unitProfile(DB, "Cataphract");
    const { total } = classBonus(DB.halberdier, cata);
    assert.ok(total > 0 && total < 32, String(total));
  });

  it("el tipo sale de las clases de armadura", () => {
    assert.equal(typeLine(unitProfile(DB, "Mangudai")), "cavalry-archer");
    assert.equal(typeLine(unitProfile(DB, "Jaguar Warrior")), "militia-line");
    assert.equal(typeLine(unitProfile(DB, "War Elephant")), "battle-elephant");
  });

  it("Mangudai: Skirmisher, Halberdier y Camel son Primario", () => {
    const p = unitProfile(DB, "Mangudai");
    const { counters } = inferUniqueCounters(p, LINES, {
      parent: "cavalry-archer", incoming: { "skirmisher-line": 1, "camel-line": 0.7 }, outgoing: {},
    });
    for (const id of ["skirmisher-line", "spearman-line", "camel-line"]) {
      assert.equal(counters.find((x) => x.id === id)?.tier, "PRIMARIO", id);
    }
  });

  it("Huskarl: le gana a los arqueros aunque la infantería pierda contra ellos", () => {
    const p = unitProfile(DB, "Huskarl");
    const { counters, beats } = inferUniqueCounters(p, LINES, {
      parent: "militia-line", incoming: { "archer-line": 1 }, outgoing: {},
    });
    assert.ok(ids(beats).includes("archer-line"));
    assert.ok(!ids(counters).includes("archer-line"));
  });

  it("ninguna línea queda de los dos lados", () => {
    for (const name of ["Mangudai", "Jaguar Warrior", "Cataphract", "Conquistador", "Teutonic Knight"]) {
      const { counters, beats } = inferUniqueCounters(unitProfile(DB, name), LINES);
      const both = ids(counters).filter((id) => ids(beats).includes(id));
      assert.deepEqual(both, [], name);
    }
  });
});
