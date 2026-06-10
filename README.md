# AoE2 Strategy Codex

Plataforma que transforma una base de conocimiento personal de **Age of Empires II**
(un vault de Obsidian de ~700 notas y ~71.000 líneas de síntesis estratégica) en un
sistema vivo: un **grafo de conocimiento** navegable, un asistente **GraphRAG** y
analítica de red.

No es "otra wiki". Es la ingeniería **alrededor** del conocimiento.

## Por qué existe

El vault ya contiene síntesis real (build orders, matchups, tier-lists, perfiles de
jugadores) interconectada con wikilinks. Ese grafo implícito es el activo. Este
proyecto lo extrae, lo modela y lo hace consultable — y se mantiene **en sincronía**
con el vault a medida que sigue creciendo.

## Arquitectura (polyglot — cada pieza en su mejor herramienta)

```
Vault Obsidian (read-only)
        │  python -m codex.sync   (incremental, idempotente)
        ▼
   Neo4j (grafo)  ──►  GraphRAG chat (Python + Ollama)
        │              Analítica de red (Python + NetworkX)
        │              Dashboard (Streamlit)
        ▼
   API (Node/Express)  ──►  Frontend tech-tree + graph view (JS + Cytoscape)
```

| Componente            | Stack                     |
|-----------------------|---------------------------|
| Ingest / sync         | Python                    |
| Grafo                 | Neo4j 5 (+ APOC)          |
| GraphRAG              | Python + Ollama           |
| Analítica de red      | Python + NetworkX / GDS   |
| Dashboard             | Streamlit                 |
| API web               | Node / Express            |
| Frontend              | JavaScript ES6 + Cytoscape|

## Pipeline de sync incremental

El núcleo. El vault sigue editándose en Obsidian; el grafo se actualiza **solo con el
delta** mediante detección de cambios por hash:

```bash
python -m codex.sync          # incremental (default): solo notas nuevas/modificadas/borradas
python -m codex.sync --full   # rebuild total (primera vez / recovery)
python -m codex.sync --watch  # modo live: observa el vault y sincroniza al guardar
```

- **Detección de cambios:** SHA-1 por nota vs `.codex/manifest.json`.
- **Idempotencia:** cada nota es dueña de sus aristas → se borran y recrean limpio
  (sin duplicados ni huérfanos). Borrar una nota → `DETACH DELETE`.
- **Re-embedding selectivo** (futuro): solo se recalculan los vectores de las
  secciones `## ##` que cambiaron.

## Analítica de red (Fase 3)

Métricas con NetworkX sobre el grafo de wikilinks. Reporte por consola o dashboard:

```bash
cd analytics
pip install -e .
python -m codex_analytics.report          # reporte de texto (verificación rápida)
python -m streamlit run codex_analytics/app.py   # dashboard interactivo
```

El dashboard cubre: centralidad (PageRank, betweenness), preguntas del meta
(unidades por estrategia, techs que conectan civs, influencia de jugadores),
**comunidades Louvain** (clústeres temáticos emergentes), conocimiento aislado
(lint del vault), tier-lists y un explorador de vecindad por nodo (pyvis).

## GraphRAG chat (Fase 4)

Embeddings → **vector index nativo de Neo4j** (los chunks viven en el mismo grafo).
Retrieval híbrido: búsqueda vectorial + léxico de alias ES/MX + expansión por las
aristas `LINKS_TO`. Respuesta citada por fuente, con umbral de abstención.

El pipeline es **agnóstico al proveedor** vía `LLM_PROVIDER` en `.env`:

| `LLM_PROVIDER` | Embeddings | Chat | Uso |
|---|---|---|---|
| `gemini` (**default**) | `gemini-embedding-001` (768d) | `gemini-2.5-flash` | cloud — deployable sin Ollama |
| `ollama` | `bge-m3` (1024d) | `gemma3:4b` | 100% local, sin costo, sin datos afuera |

```bash
cd rag
pip install -e .
python -m codex_rag.build          # chunk + embed del vault (incremental; --full reembebe)
python -m codex_rag.chat "¿Cómo juego Scout Rush con Georgianos?"
python -m streamlit run codex_rag/chat_app.py     # chat con UI
```

Modelo de datos: `(:Chunk {text, embedding})-[:PART_OF]->(:Note)`, una sección
H2 por chunk (~5100 chunks). El build es incremental por hash, igual que el sync.

> **El índice se construye para UN proveedor** (las dimensiones difieren: 768 vs
> 1024). Si cambiás de proveedor, reembebé con `--full`; el vector index se recrea
> solo al detectar el cambio de dimensión.

### Default: Gemini (cloud)

API key en [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — creá
una **nueva** (nace como *auth key*, no le afectan los deadlines de las *standard
keys* de jun/sep 2026). Para el re-embed inicial conviene **billing Tier 1** (el
free tier no alcanza para el bulk; el re-embed completo cuesta ~US$0.30). Ponela en
`.env` como `GEMINI_API_KEY` y corré `python -m codex_rag.build --full`.

> Nota TLS: en máquinas con antivirus/proxy que interceptan HTTPS, el cliente usa
> el almacén de certificados del SO vía `truststore` (verificación TLS activa).

### Alternativa: Ollama (100% local, sin costo)

Para correr todo localmente sin cuentas ni nube:

```bash
ollama pull bge-m3 && ollama pull gemma3:4b
# en .env:  LLM_PROVIDER=ollama  y  EMBED_DIM=1024
cd rag && python -m codex_rag.build --full      # reembebe el índice a 1024d (bge-m3)
```

## Setup

```bash
cp .env.example .env          # ajustar VAULT_PATH y credenciales de Neo4j
docker compose up -d          # levanta Neo4j en localhost:7474 / bolt:7687

cd ingest
pip install -e .
python -m codex.sync --full   # primera ingesta completa del vault
```

Verificar en Neo4j Browser (http://localhost:7474):

```cypher
MATCH (n:Note) RETURN count(n);                          // 658 notas
MATCH (:Note)-[r:LINKS_TO]->(:Note) RETURN count(r);     // 4258 aristas

// Civs A-tier en Arabia según Hera
MATCH (c:Civ)-[r:RATED]->(tl:TierList)
WHERE tl.name CONTAINS 'Hera' AND r.tier = 'A'
RETURN c.title ORDER BY c.title;

// Notas más enlazadas (preview de centralidad)
MATCH (n:Note)<-[r:LINKS_TO]-() RETURN n.path, count(r) AS inbound
ORDER BY inbound DESC LIMIT 10;
```

## Tech-tree → grafo (Fase 6 + Fix 5)

El visual del proyecto hermano **Aoe2-Tech-Tree-Advanced** está vendorizado en
`web/public/tree/` y cableado al grafo: al hacer click en una unidad/tech, un bloque
"📖 Codex" consulta `GET /api/tree/:tree_id` y muestra los stats que viven en Neo4j,
qué civs tienen acceso, la prosa del vault y un botón al GraphRAG. Abrir
http://localhost:3000/tree/ con la API levantada.

La ingesta de stats/costos del árbol y las aristas `HAS_UNIT`/`HAS_TECH`/`HAS_BUILDING`
se corre desde `web/`:

```bash
cd web
npm run techtree:dry      # plan de ingesta (no escribe)
npm run techtree:ingest   # aplica stats + aristas a Neo4j (idempotente)
npm run techtree:report   # regenera el MD de incongruencias árbol↔vault
```

> El árbol es la fuente de verdad de stats **excepto** lo tocado por `patch-177723`
> (ahí gana el vault, post-parche). Las incongruencias quedan registradas en
> `<vault>/meta/codex-incongruencias-arbol-vault.md`. Correr **después** de
> `python -m codex.sync --full` (el sync puede pisar el `tree_id` de las notas).

## Estado

- [x] Scaffold + Docker (Neo4j)
- [x] Sync incremental: vault → Neo4j (`Note`, `LINKS_TO`, `Concept`/`DEFINES`)
- [x] Nodos tipados (`Civ`, `Player`, `Strategy`, `Tech`…) + `RATED`→`TierList`
- [x] Analítica de red (NetworkX) + dashboard Streamlit
- [x] GraphRAG chat (Ollama local + vector index nativo de Neo4j)
- [x] API Express + frontend explorador + chat GraphRAG (`:3000`)
- [x] Integración tech-tree cableada al grafo + ingesta de stats (`HAS_*`, `tree_id`)
- [ ] Push a GitHub + deploy de demo (Fase 7)
