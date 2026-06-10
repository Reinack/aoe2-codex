// ── DATA INDEX ──────────────────────────────────────────────
// Consolidated exports for all data

import { AGES, AGE_COLORS } from './ages.js';
import { NODES } from './nodes.js';
const BUILDINGS = NODES.filter(n => n.type === 'building');
const DEFENSIVES = NODES.filter(n => n.type === 'defencive');
import { UNIT_STATS, REGIONAL_UNIT_STATS, UNIQUE_UNIT_STATS } from './units.js';
import { IMG_MAP } from './img_map.js';
import { UNIT_CLASSES, UNIQUE_UNIT_CLASSES, TECHS } from './tech_data.js';

// ── CIVILIZATIONS INDEX ──────────────────────────────────────────────
// Re-export all civ definitions from data/civ/

import ARMENIANS from './civ/armenians.js';
import AZTECS from './civ/aztecs.js';
import BENGALIS from './civ/bengalis.js';
import BERBERS from './civ/berbers.js';
import BOHEMIANS from './civ/bohemians.js';
import BRITONS from './civ/britons.js';
import BULGARIANS from './civ/bulgarians.js';
import BURGUNDIANS from './civ/burgundians.js';
import BURMESE from './civ/burmese.js';
import BYZANTINES from './civ/byzantines.js';
import CELTS from './civ/celts.js';
import CHINESE from './civ/chinese.js';
import CUMANS from './civ/cumans.js';
import DRAVIDIANS from './civ/dravidians.js';
import ETHIOPIANS from './civ/ethiopians.js';
import FRANKS from './civ/franks.js';
import GEORGIANS from './civ/georgians.js';
import GOTHS from './civ/goths.js';
import GURJARAS from './civ/gurjaras.js';
import HINDUSTANIS from './civ/hindustanis.js';
import HUNS from './civ/huns.js';
import INCAS from './civ/incas.js';
import ITALIANS from './civ/italians.js';
import JAPANESE from './civ/japanese.js';
import JURCHENS from './civ/jurchens.js';
import KHITANS from './civ/khitans.js';
import KHMER from './civ/khmer.js';
import KOREANS from './civ/koreans.js';
import LITHUANIANS from './civ/lithuanians.js';
import MAGYARS from './civ/magyars.js';
import MALAY from './civ/malay.js';
import MALIANS from './civ/malians.js';
import MAPUCHE from './civ/mapuche.js';
import MAYANS from './civ/mayans.js';
import MONGOLS from './civ/mongols.js';
import MUISCA from './civ/muisca.js';
import PERSIANS from './civ/persians.js';
import POLES from './civ/poles.js';
import PORTUGUESE from './civ/portuguese.js';
import ROMANS from './civ/romans.js';
import SARACENS from './civ/saracens.js';
import SHU from './civ/shu.js';
import SICILIANS from './civ/sicilians.js';
import SLAVS from './civ/slavs.js';
import SPANISH from './civ/spanish.js';
import TATARS from './civ/tatars.js';
import TEUTONS from './civ/teutons.js';
import TUPI from './civ/tupi.js';
import TURKS from './civ/turks.js';
import VIETNAMESE from './civ/vietnamese.js';
import VIKINGS from './civ/vikings.js';
import WEI from './civ/wei.js';
import WU from './civ/wu.js';

const CIVS = {
  armenians: ARMENIANS,
  aztecs: AZTECS,
  bengalis: BENGALIS,
  berbers: BERBERS,
  bohemians: BOHEMIANS,
  britons: BRITONS,
  bulgarians: BULGARIANS,
  burgundians: BURGUNDIANS,
  burmese: BURMESE,
  byzantines: BYZANTINES,
  celts: CELTS,
  chinese: CHINESE,
  cumans: CUMANS,
  dravidians: DRAVIDIANS,
  ethiopians: ETHIOPIANS,
  franks: FRANKS,
  georgians: GEORGIANS,
  goths: GOTHS,
  gurjaras: GURJARAS,
  hindustanis: HINDUSTANIS,
  huns: HUNS,
  incas: INCAS,
  italians: ITALIANS,
  japanese: JAPANESE,
  jurchens: JURCHENS,
  khitans: KHITANS,
  khmer: KHMER,
  koreans: KOREANS,
  lithuanians: LITHUANIANS,
  magyars: MAGYARS,
  malay: MALAY,
  malians: MALIANS,
  mapuche: MAPUCHE,
  mayans: MAYANS,
  mongols: MONGOLS,
  muisca: MUISCA,
  persians: PERSIANS,
  poles: POLES,
  portuguese: PORTUGUESE,
  romans: ROMANS,
  saracens: SARACENS,
  shu: SHU,
  sicilians: SICILIANS,
  slavs: SLAVS,
  spanish: SPANISH,
  tatars: TATARS,
  teutons: TEUTONS,
  tupi: TUPI,
  turks: TURKS,
  vietnamese: VIETNAMESE,
  vikings: VIKINGS,
  wei: WEI,
  wu: WU,
};

// Expose globally for app.js (which uses globals without import)
window.AGES = AGES;
window.AGE_COLORS = AGE_COLORS;
window.BUILDINGS = BUILDINGS;
window.DEFENSIVES = DEFENSIVES;
window.NODES = NODES;
window.UNIT_STATS = UNIT_STATS;
window.REGIONAL_UNIT_STATS = REGIONAL_UNIT_STATS;
window.UNIQUE_UNIT_STATS = UNIQUE_UNIT_STATS;
window.IMG_MAP = IMG_MAP;
window.CIVS = CIVS;
window.UNIT_CLASSES = UNIT_CLASSES;
window.UNIQUE_UNIT_CLASSES = UNIQUE_UNIT_CLASSES;
window.TECHS = TECHS;

export default CIVS;
export { AGES, AGE_COLORS, BUILDINGS, DEFENSIVES, NODES, UNIT_STATS, REGIONAL_UNIT_STATS, UNIQUE_UNIT_STATS, IMG_MAP, CIVS };
