// Conexión a Neo4j + carga de .env del repo (sin dependencia externa).
import neo4j from "neo4j-driver";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const txt = readFileSync(join(__dirname, "..", ".env"), "utf-8");
    for (const line of txt.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#") || !t.includes("=")) continue;
      const i = t.indexOf("=");
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim();
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    /* sin .env: se usan defaults */
  }
}
loadEnv();

const URI = process.env.NEO4J_URI || "bolt://localhost:7687";
// Aura entrega NEO4J_USERNAME (a veces el id de instancia, no 'neo4j').
const USER = process.env.NEO4J_USER || process.env.NEO4J_USERNAME || "neo4j";
const PASS = process.env.NEO4J_PASSWORD || "codexpass";

export const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASS));

// Ejecuta una query y devuelve filas como objetos JS planos (convierte Integer).
export async function run(cypher, params = {}) {
  const session = driver.session();
  try {
    const res = await session.run(cypher, params);
    return res.records.map((r) => {
      const o = {};
      for (const key of r.keys) o[key] = neo4j.types ? toPlain(r.get(key)) : r.get(key);
      return o;
    });
  } finally {
    await session.close();
  }
}

function toPlain(v) {
  if (neo4j.isInt(v)) return v.toNumber();
  if (Array.isArray(v)) return v.map(toPlain);
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v)) o[k] = toPlain(v[k]);
    return o;
  }
  return v;
}
