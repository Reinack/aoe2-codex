# Pendientes — funcionalidades vistas en otras páginas de AoE2

Relevamiento hecho el 2026-11-04 sobre ~30 páginas/herramientas de la comunidad de
AoE2 (listadas al final). Se comparó contra lo que el proyecto **ya tiene** y se
recopiló solo lo que **falta**.

## Estado de implementación (2026-11-04)

Casi todo vive en la vista **🧪 Lab** del frontend Express (`web/public/lab.js` + `lab.css`; rutas en `web/lib/lab.mjs`).
El cruce **civ vs civ** vive en **Matchups** (`web/public/matchup-extra.js`).

### Dónde vive cada cosa (sin duplicados)

| Pregunta | Vista | Nota |
|---|---|---|
| ¿Cómo juego contra esta civ? (counter-play, debilidades, Phosphor, partidas documentadas, radar, diferencias de árbol) | **Matchups** | Absorbió "Comparar civs" y el panel de rival de Scouting; muestra además datos que el servidor ya devolvía y la vista nunca renderizaba |
| ¿Qué unidad le gana a cuál? | **Counters** (edges curados del vault) | El Simulador es la contraparte numérica; se enlazan |
| ¿Qué miro del rival y cómo respondo? ¿Quién de mi equipo lo hace? | **Lab → Scouting** | Genérico y por equipo; lo específico de una civ está en Matchups |
| ¿Qué civ pickeo / baneo? | **Lab → Draft** | Un solo panel: por mapa, y contra las civs del rival si las cargás |
| Guía de un mapa | **Lab → Mapas** | Atajos a Draft, Scouting, builds y a Matchups con ese mapa |

| # | Ítem | Estado | Dónde |
|---|---|---|---|
| 1 | Build orders con timer/overlay | ✅ hecho | pestaña *Build orders*; datos de `scripts/build-build-orders.mjs` (9 builds, 17 secciones). Overlay en página y en ventana aparte (`/?lab=overlay&bo=<id>`), voz por paso, medallas oro/plata/bronce, export JSON |
| 2 | Benchmarks de timings | ✅ hecho | pestaña *Timings*; `data/timings.json` curado con nota de origen por fila + comparador "mi partida". Sin segmentación por Elo: la wiki no la trae |
| 3 | Draft / pick-ban | ✅ hecho | pestaña *Draft*, un solo panel: por mapa con el radar del vault + tier Phosphor (formatos 1v1–4v4, Bo1/3/5) y, si cargás las civs del rival, puntúa contra ellas (`lib/draftvs.mjs`: categorías débiles explotables, mapa, partidas documentadas), sugiere bans de su pool y alerta de Phosphor Rush; cada pick enlaza a Matchups |
| 4 | Team Lab | ✅ hecho | pestaña *Team Lab*; `scripts/build-team-roles.mjs` (56 civs), asignación flanco/pocket, sinergias, cobertura de líneas y huecos |
| 5 | Árbol de scouting | ✅ hecho | pestaña *Scouting*; `data/scouting-tree.json` (16 señales) + quién del equipo ejecuta cada respuesta. El counter-play de una civ concreta se muestra en Matchups |
| 6 | Simulador + matriz de costo | ✅ hecho (aproximado) | pestaña *Simulador*; `lib/sim.mjs` (35 unidades, con tests). Aplica bonos de civ, bonus de equipo del aliado y descuentos de costo según la edad (`data/civ-combat.json`). Sin hit&run, techs únicas ni unidades únicas |
| 7 | Comparador civ vs civ | ✅ hecho | integrado en **Matchups** (radar y "solo lo que difiere" en los árboles, `/api/compare`); ya no hay pestaña aparte |
| 12 | Quiz con repetición espaciada | ✅ hecho | pestaña *Estudio*; 195 tarjetas, cajas de Leitner en `localStorage` |
| 8 | Stats de ladder | ⏳ pendiente | requiere decidir fuente externa (API pública) y cómo mostrarla sin pisar al vault |
| 9 | Guías por mapa | ✅ hecho | pestaña *Mapas*; `scripts/build-map-guides.mjs` (58 mapas), ficha, secciones de la wiki renderizadas, civs que destacan, ranking del radar por tipo de mapa y atajos a draft, scouting y build orders (`/api/maps`, `/api/maps/:slug`). Falta el nodo `Map` en Neo4j |
| 10 | Trade/reliquias en la Calculadora | ✅ hecho | panel en *Oferta* de la Calculadora: oro por viaje según distancia entre Markets y tamaño de mapa (fórmula de `market.md`), Caravan, bonus de equipo Spanish/Bengalis/Aztecs/Burgundians y Grand Trunk Road (`lib/eco.mjs`, `POST /api/passive`). Sigue pendiente afinar las tasas semilla de `eco-model.json` |
| 11 | Tracker de parches | ⏳ pendiente | necesita dos versiones del árbol para diferenciar |
| 13–17 | Hotkeys, replays, perfiles/torneos, constructor de civs, API alternativa | ⏳ pendiente | dependen de datos o servicios externos / fuera del núcleo |

**Estilo:** el Lab y el panel de comercio siguen `docs/GUIA-DE-ESTILO.md` del tech tree: pergamino para contenido, papiro para controles, negro de diálogo para el overlay, botones rojos con filete dorado, oro solo como hilo o letra, pigmentos del árbol para categorías y edades, números en Crimson Pro (no Cinzel) y registros con filetes en lugar de tarjetas. Los tokens de edad (`--age-0…3`) están en `web/public/lab.css`.

**Íconos:** el Lab usa los íconos del árbol (unidades, mejoras, techs y edificios, en casillas con el pigmento de su familia) y los emblemas de las 56 civs (`web/public/img/civs`, envejecidos con sepia como los chips del árbol). `web/data/icons.json` (`npm run data:icons`) trae el catálogo por id y un índice por nombre en inglés; los textos de build orders, scouting, counter-play y mapas muestran el ícono delante de cada nombre reconocido. La Calculadora suma emblemas en los bonos de equipo e íconos de recursos y del Trade Cart.

**GameKit (hover):** `web/public/gamekit.js` es el módulo compartido de íconos y hover de unidades, techs, edificios y civs (ver README). El Lab, la Calculadora (picker y filas), las fichas de civ del Explorador y las zonas `data-gk-auto` (detalle, chat, panel de counters) ya lo usan; una vista nueva solo necesita `GK.ico(...)`, `data-gk="i:id"` o `data-gk-auto`.

**Layout:** las grillas del Lab (`.lab-grid`, `.two`, `.auto`, `.split`) se adaptan al ancho disponible con `auto-fit`: 1 columna en celular con pestañas deslizables, paneles lado a lado desde ~700 px, panel lateral fijo desde 1100 px, y en pantallas muy grandes más columnas (el contenedor se centra a 2800 px y el texto corrido no pasa de ~95 caracteres).

Para regenerar los datos del Lab tras cambios en la wiki o en el árbol: `cd web && npm run data:lab` (build orders, roles de equipo, bonos de combate y guías por mapa).

---

## Lo que el proyecto ya cubre (no se repite abajo)

Tech-tree enlazado al grafo · Graph explorer · Matchup Lab (consejos, alerta Phosphor
Rush, unidades faltantes) · Counters (botonera + counter graph + filtro por civ) ·
Calculadora de Producción (modelo económico demanda/oferta) · Chat GraphRAG citado ·
Radar de civs · Analítica de red (PageRank, Louvain) · i18n ES/EN en codex-web.

Verificado en `web/server.js` y `web/public/index.html`: **no hay** nada de build orders,
draft, benchmarks, simulador de combate, replays, quiz ni modo equipos.

> Regla de [[feedback_juego_por_equipos]]: foco 1v1, pero toda feature de decisión debe
> soportar 2v2–4v4 (quién del equipo hace cada respuesta y por qué).
> Regla de [[feedback_unidades_especiales]]: únicas/regionales solo si una civ elegida
> las construye.

---

## P1 — Alto valor, encaja directo con el vault

### 1. Visor de build orders con timer y overlay
*Vistos en: RTS Overlay, Border (SiegeEngineers), buildorderguide.com, Sage of Empires,
IdleTC, aoe2-build-orders (Rahien), Joh's Build Order Reference.*
- Vista "Build Orders" que lea las BO que ya viven en el vault (Hera, etc.) y las muestre
  paso a paso: pasos por población/tiempo, **reparto de aldeanos por recurso en cada paso**
  (lo que hace IdleTC), edad objetivo y click times.
- Timer manual/automático con avance de paso, y modo **overlay** (ventana mínima always-on-top
  o ruta `/overlay`).
- Cue de audio por paso (opcional).
- Medalla bronce/plata/oro según tiempo real vs. objetivo (Sage of Empires).
- Importar/exportar JSON compatible con RTS Overlay.
- Enlazar cada BO con la civ/matchup/mapa del grafo (`Note` → `Civ`).

### 2. Benchmarks de timings por edad y por Elo
*Vistos en: Guild Order (build orders economic timings, castle age timings), Joh's
reference, aoe2insights (match pages con build orders/APM).*
- Tabla de "click times" de Feudal / Castle / Imperial por estrategia (drush-FC, scouts,
  archers, FC boom) con rangos por nivel.
- Vincular con la Calculadora: "para este timing necesitás N aldeanos en X".
- Importante: los sitios de timings tienen fuentes dudosas; usar **solo los del vault**
  y marcar origen.

### 3. Draft / pick-ban helper (modo capitán)
*Vistos en: aoe2cm.net, aoe2-improved-captain-mode, civ picks by matchup (Guild Order),
aoezone (MoA5 Bo3/Bo5).*
- Dado un formato (Bo3/Bo5, bans de civ y mapa) sugerir picks/bans usando radar, tier
  lists del vault y matchups documentados.
- Rastrear el pool restante de cada jugador en series con "civ única por serie".
- Soportar draft por equipos.

### 4. Modo equipos: posiciones y team bonuses
*Vistos en: Guild Order (team game positioning/positions), foro de AoE (team bonus),
r/aoe2 "Best 4v4 Team Bonus".*
- Vista "Team Lab": composición de 2v2–4v4, asignación **flank vs pocket**, sinergia
  de team bonuses entre civs elegidas, y reparto de counters por jugador.
- Sugerencia de rol según las civs fuertes de cada jugador (caballería → pocket;
  presión de arqueros/infantería → flank).

### 5. Árbol de decisión de scouting y "qué hago si veo X"
*Vistos en: Guild Order (dark age scouting, boom vs push), Scout Rush guide (substack),
Mehvix's Counter List 2.0.*
- Flujo interactivo: "vi esto a los 1:30 / 7:00" → reacción recomendada por civ propia y
  rival, con re-chequeo a ~7:00 y ~8:00 (boom vs push en 5 factores).
- Alimentarlo desde `counter-play.json` y `documented-matchups.json`.

---

## P2 — Valor medio, requiere datos nuevos

### 6. Simulador de combate y matriz de eficiencia de costo
*Vistos en: AoE2 Combat Simulator (foro), Zephni aoe2fightsim, AOE Scout Battle
Simulator, matrices de cost efficiency, unit counter finder.*
- Ejército A vs B con upgrades y bonos de civ (usa `item-costs.json`, `civ-mods.json`,
  `eco-techs.json` que ya existen).
- Matriz unidad-vs-unidad con y sin Hit&Run.
- Aviso explícito de limitaciones (selección de objetivo, edge cases de upgrades), como
  advierten los propios autores.

### 7. Comparador civ vs civ por diferencias de árbol
*Vistos en: aoe2.betra.is (muestra solo techs que difieren), AgeOfNotes (tabla
comparativa), aoe2insights (páginas por civ), aoe2-de-tools civ-ranking.*
- Comparador lado a lado: bonos, equipo, UU, UT y **solo techs/unidades que difieren**.
- Añadir bonos únicos y team bonus a la cabecera de la comparación.

### 8. Estadísticas de ladder (win rate por civ / mapa / Elo / parche)
*Vistos en: aoestats.io, AoE2 Complete Guide (tier por ladder, popularidad de mapa por
Elo), unistats (matriz de winrate por par de civs), AoeDash.*
- Ingestar un dataset externo (ver ítem 14) para mostrar win rate real junto a la
  opinión de la bóveda y detectar **discrepancias** entre tier list del vault y datos.
- Filtros por mapa, Elo y parche; matriz civ-vs-civ; pick rate.
- Decisión abierta: el vault es la fuente de verdad ([[feedback_aoe_respuestas]]); estos
  datos irían como capa separada y etiquetada.

### 9. Guías por mapa
*Vistos en: AOE2 Guide (aoe2-guide.pages.dev: Arabia, Arena, Black Forest, Hideout),
"10 most competitive maps", foro (Persians en mapas de madera).*
- Nodo `Map` en el grafo con civs fuertes, aperturas típicas, walling y control de
  reliquias; enlazar con tier lists por mapa. Hoy el mapa solo aparece como texto.

### 10. Timeline de reliquias, comercio y control de mapa
*Vistos en: AoE2 Wiki (Trade Cart), foros de reliquias, guía Windows Central de tower rush.*
- Extender la Calculadora con ingreso por **trade** según distancia de ruta y por
  reliquias (hoy son pasivos semilla en `eco-model.json`).
- Pendiente ya anotado: afinar tasas y aplicar `civ-mods.gen`.

### 11. Tracker de cambios entre parches
*Vistos en: wiki de Fandom (páginas por parche), notas oficiales (parche naval 169123),
hilos que advierten que las notas omiten cambios.*
- Diff de stats/costos entre versiones del árbol (`nodes.js`, `tech_data.js`) y marcar en
  el vault qué notas quedaron **desactualizadas** tras un parche (hay base:
  `AoE-Wiki/_tools/desactualizadas`).
- Mostrar "cambió en el parche X" dentro del panel del tech-tree.

---

## P3 — Ideas de producto / aprendizaje

### 12. Modo estudio: quiz y flashcards con repetición espaciada
*Vistos en: AoE2 Trainer (iOS, 259 cards), Anki AoE Flashcards, Brainscape, Cram.*
- Cartas generadas desde el grafo (bonos de civ, team bonus, UU, UT, quién counterea a
  quién) con repetición espaciada; mostrar la fuente en el vault.

### 13. Entrenador de hotkeys / secuencias
*Vistos en: AoE2 Hotkey Execution & Sequence Trainer, tabla DE hotkeys con teclado virtual
y curso de 30 lecciones, editor aokhotkeys.*
- Fuera del núcleo del proyecto; evaluar solo como mini-módulo o enlace.

### 14. Importar partidas y análisis de replay
*Vistos en: aoe2insights (build orders, APM, TC idle, gather rates por minuto — Premium),
AoE2 Coach (compara contra ganadores de tu Elo), Replay Coach (Guild Order), mgz /
mgz-fast, RecAnalyst.*
- Subir un `.aoe2record` y cruzar contra el vault: click times, TC idle, build order real
  vs. la BO objetivo del ítem 1.
- Cuidado: los records guardan *comandos*, no acciones → usar "commands per minute", no APM.
- Los parsers se rompen con cada parche; fijar versión.
- Dependencia de datos: perfil de jugador/historial vía API pública (aoe2companion,
  aoe2.net, aoe2insights).

### 15. Perfil de jugador y calendario de torneos
*Vistos en: aoe2insights (win rate por duración, civ, posición), Liquipedia (resultados,
brackets), esportsearnings, calendario oficial de esports, aoe2companion.*
- Ya existe "influencia de jugadores" en analítica; falta enlazar un jugador con
  resultados/torneos recientes y su pool de civs.

### 16. Constructor de civs personalizadas (curiosidad)
*Visto en: Empire Forge (foro, set 2026), Advanced Genie Editor.*
- Baja prioridad. Útil solo como inspiración para un "what-if" de bonos en la Calculadora.

### 17. Fuente de datos alternativa
*Vistos en: aoe2-data-api (amrtgaber), aoe2dat / genieutils-py, awesome-aoe2.*
- Contrastar `web/data/*.json` con una API/dump abierto para validar stats y detectar
  incongruencias árbol↔vault de forma automática.

---

## Deuda ya conocida (de la memoria del proyecto, no de este relevamiento)

- Afinar tasas de `eco-model.json`; aplicar `civ-mods.gen` en el motor; costos por-UU
  faltantes.
- Contenido dinámico (consejos/grafo) solo en ES: falta `?lang=` en backend.
- Graph explorer sin stats/prosa en el panel (re-correr tree-wiring + embeddings).
- Rama `feat/wiki-publica` con 1 commit sin mergear (9b50714).

## Priorización sugerida

1. **Build orders + timer/overlay** (1) — usa contenido que ya existe, visible de inmediato.
2. **Benchmarks de timings** (2) — ata BO con la Calculadora.
3. **Team Lab** (4) y **árbol de scouting** (5) — respetan la regla de equipos y reusan
   `counter-play.json`.
4. Luego simulador (6), comparador (7) y stats de ladder (8).

## Aviso sobre las fuentes

Varias páginas (sobre todo Guild Order y blogs de tier lists) parecen contenido generado
o desactualizado, y algunas afirmaciones se contradicen. Se usaron para **detectar
funcionalidades**, no como fuente de datos: el contenido estratégico debe salir del vault.

## Páginas consultadas (30)

1. aoe2companion (directorio awesome-aoe2) — https://awesome.ecosyste.ms/projects/github.com%2FArkanosis%2Fawesome-aoe2
2. Guild Order — build orders por civ — https://guildorder.com/es/games/aoe2/guides/build-orders-by-civ
3. IdleTC (BO con reparto de aldeanos) — https://forums.ageofempires.com/t/idletc-free-aoe2-de-build-orders-with-the-villager-split-on-every-step/290952
4. aoe2insights (About / Premium) — https://aoe2insights.com/about/ · https://www.aoe2insights.com/premium/
5. aoezone — unistats civ matchup tool — https://www.aoezone.net/threads/unistats-civ-matchup-statistics-tool.151841/
6. RTS Overlay (aoezone) — https://aoezone.net/threads/aoe2-overlay-with-build-orders-29-from-hera-included-and-match-data.182348/
7. RTS Overlay (foro oficial) — https://forums.ageofempires.com/t/aoe2-overlay-with-build-orders-29-from-hera-included-and-match-data/205494
8. Import de buildorderguide a RTS Overlay — https://forums.ageofempires.com/t/import-any-aoe2-build-order-from-buildorderguide-into-rts-overlay/233153
9. Border (SiegeEngineers) — https://github.com/abductedPlatypus/border/wiki/build-orders
10. Sage of Empires — https://github.com/Mulliman/sage-of-empires
11. aoe2-build-orders (Rahien) — https://gh.r-mj.com/Rahien/aoe2-build-orders
12. aoe2cm / captains mode (aoezone) — https://aoezone.net/threads/captains-mode-dm-edition-tutorial.117673/
13. aoe2-improved-captain-mode — https://awesome.ecosyste.ms/projects/github.com%2Fjerkeeler%2Faoe2-improved-captain-mode
14. Guild Order — civ picks by matchup — https://guildorder.com/games/aoe2/guides/civ-picks-by-matchup
15. AoE2 Fight Simulator (Zephni) — https://github.com/Zephni/aoe2fightsim
16. AOE Scout Battle Simulator — https://forums.ageofempires.com/t/aoe-2-battle-simulator-is-now-live-on-aoe-scout/290438
17. Cost efficiency matrices — https://forums.ageofempires.com/t/age-of-empires-2-cost-efficiency-matrices/85494
18. AoE2 Coach (replay analysis) — https://forums.ageofempires.com/t/aoe2-coach-aoe2coach-net-data-based-replay-analysis-tool-and-chatbot-that-compares-you-to-winners-at-your-elo/287451
19. mgz-fast — https://pypi.org/project/mgz-fast/
20. aoe2insights — estadísticas de jugador — https://www.aoe2insights.com/user/5808/stats/4
21. AOE2 Guide — mapas (Arabia) — https://aoe2-guide.pages.dev/en/maps/arabia
22. AOE2 Complete Guide (stats de ladder) — https://aoe2-guide.vercel.app/maps
23. Civ vs civ comparison tool (betra.is, Reddit) — https://redlib.hackliberty.org/r/aoe2/comments/1kahvyn/civ_vs_civ_comparison_tool_includes_new_civs
24. AgeOfNotes — tech tree / civs — https://ageofnotes.com/tech-tree
25. West Games — AoE2 Resource Calculator — https://west-games.com/aoe2-resource-calculator/
26. aoe2calc.org — https://www.github.com/posixpascal/aoe2calc.org
27. Guild Order — dark age scouting & feudal pressure — https://guildorder.com/games/aoe2/guides/dark-age-scouting-and-feudal-pressure
28. Guild Order — team game positioning — https://guildorder.com/games/aoe2/guides/team-game-positioning
29. AoE2 Trainer / hotkey trainer — https://forums.ageofempires.com/t/free-web-tool-aoe2-hotkey-execution-sequence-trainer/287945
30. Liquipedia AoE — resultados recientes — https://liquipedia.net/ageofempires/Recent_Tournament_Results

Además (contexto de parches y datos): Joh's Build Order Reference, Fandom (Trade Cart / patches),
aoe2-data-api, aoe2dat, Empire Forge, ageofempires.com (roadmap 2026).
