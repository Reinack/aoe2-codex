// Patch 177723 (AoE2 DE, 2026-06-02) — capa de corrección sobre los datos del árbol.
//
// El repo del tech-tree se pusheó el 2026-05-29 → sus datos son PRE-parche.
// Regla del proyecto: el árbol es fuente de verdad PARA TODO MENOS lo tocado por
// este parche; ahí gana el vault (post-parche).
//
// Dos grupos:
//   OVERRIDES  → entidades direccionables por tree-id cuyos stats/costos a nivel
//                nodo se corrigen en la ingesta. Cada uno declara qué pisa.
//   DOCUMENTED → cambios del parche que NO se modelan como stat de nodo
//                (bonos de civ, únicas de castillo sin stats limpias en el árbol).
//                No se ingesta número; se documenta en el MD que el vault manda.
//
// Fuente: D:\Boveda\Aoe\meta\patch-177723.md

export const PATCH_ID = "patch-177723";
export const PATCH_DATE = "2026-06-02";

// Correcciones aplicadas durante la ingesta (post-parche = autoritativo).
// `stat`  → pisa campos del UNIT_STATS (hp, train, ...)
// `node`  → pisa campos del NODE (train_cost, research_cost, research_time)
// `pre`   → valor que traía el árbol (para el log de incongruencias)
// `flag`  → true si el árbol ni siquiera coincidía con el pre-parche conocido
export const OVERRIDES = {
  slinger: {
    name: "Slinger",
    node: { train_cost: { food: 50, wood: 25 } },
    pre:  { train_cost: { food: 70, wood: 10 } },
    note: "Costo 70F/10W → 50F/25W. Resistencia a conversión 0 → 2 (no se modela en stats base).",
  },
  temple_guard: {
    name: "Temple Guard",
    node: { train_cost: { food: 70, gold: 45 } },
    pre:  { train_cost: { food: 50, gold: 30 } },
    flag: true,
    note: "Parche: 80F/45G → 70F/45G. El árbol traía 50F/30G, que NO coincide ni con el valor pre-parche del parche note → dato del árbol descartado, gana vault. Bonus vs caballería +3 → +5 (no se modela en stats base).",
  },
  champiscout: {
    name: "Champi Scout",
    stat: { train: 42 },
    pre:  { train: 45 },
    note: "Train time 45 → 42 s.",
  },
  champirunner: {
    name: "Champi Runner",
    stat: { train: 34 },
    node: { research_cost: { food: 90, gold: 60 }, research_time: 40 },
    pre:  { train: 40, research_cost: { food: 120, gold: 60 }, research_time: 40 },
    note: "Train 40 → 34 s. Upgrade 120F/60G → 90F/60G. Research time ya estaba en 40 en el árbol (el árbol quedó pre/post mezclado).",
  },
  champiwarrior: {
    name: "Champi Warrior",
    node: { research_cost: { food: 150, gold: 175 } },
    pre:  { research_cost: { food: 200, gold: 175 } },
    note: "Upgrade 200F/175G → 150F/175G.",
  },
};

// Cambios del parche no modelados como stat de nodo (vault autoritativo).
export const DOCUMENTED = [
  { scope: "Armenians", change: "Elite Composite Bowman HP 45 → 50. Ahora acceden a Siege Ram." },
  { scope: "Burgundians", change: "Descuento comida techs económicas 33% → 40%. Team bonus (reliquias→comida) 30 → 20 c/min (nerf)." },
  { scope: "Inca", change: "Descuento de comida militar por era 5/10/15/20% → 15/20/25/30%. Costo en comida del Kamayuk reajustado para mantener el descuento neto." },
  { scope: "Mapuche", change: "Bonus recolectores de comida +20% → +25%." },
  { scope: "Muisca", change: "Settlements 25% → 33% de descuento. Elite Temple Guard bonus vs caballería +6 → +8. Guecha Warrior HP 50 → 55, Elite 50 → 60. Huaracas: velocidad de entrenamiento del Slinger 25% → 50%." },
  { scope: "Tupi", change: "Blackwood Archer (Akudar) train time 14 → 18 s (Elite sin cambios)." },
  { scope: "Wei", change: "Tiger Cavalry HP 115 → 110 / train 15 → 18 s; Elite Tiger Cavalry HP 130 → 125." },
  { scope: "Aztecs", change: "Xolotl Warrior ahora afectado por Garland Wars, Holcans, Fabric Shields, Herbalism, Caciques, Butalmapu." },
  { scope: "Naval — Dock", change: "Flechas máx 5 fijo → 0/3/4/5 por era. Bonus vs barcos +3 fijo → +0/+2/+3/+4 por era." },
  { scope: "Naval — Torres", change: "Watch Tower +6→+5, Guard Tower +8→+7, Keep +9→+8, Sea Tower +8→+5 (bonus vs barcos)." },
];
