// ── CIVILIZATIONS INDEX ──────────────────────────────────────────────
// Re-export all civ definitions from data/civ/

import ARMENIANS from './armenians.js';
import AZTECS from './aztecs.js';
import BENGALIS from './bengalis.js';
import BERBERS from './berbers.js';
import BOHEMIANS from './bohemians.js';
import BRITONS from './britons.js';
import BULGARIANS from './bulgarians.js';
import BURGUNDIANS from './burgundians.js';
import BURMESE from './burmese.js';
import BYZANTINES from './byzantines.js';
import CELTS from './celts.js';
import CHINESE from './chinese.js';
import CUMANS from './cumans.js';
import DRAVIDIANS from './dravidians.js';
import ETHIOPIANS from './ethiopians.js';
import FRANKS from './franks.js';
import GEORGIANS from './georgians.js';
import GOTHS from './goths.js';
import GURJARAS from './gurjaras.js';
import HINDUSTANIS from './hindustanis.js';
import HUNS from './huns.js';
import INCAS from './incas.js';
import ITALIANS from './italians.js';
import JAPANESE from './japanese.js';
import JURCHENS from './jurchens.js';
import KHITANS from './khitans.js';
import KHMER from './khmer.js';
import KOREANS from './koreans.js';
import LITHUANIANS from './lithuanians.js';
import MAGYARS from './magyars.js';
import MALAY from './malay.js';
import MALIANS from './malians.js';
import MAPUCHE from './mapuche.js';
import MAYANS from './mayans.js';
import MONGOLS from './mongols.js';
import MUISCA from './muisca.js';
import PERSIANS from './persians.js';
import POLES from './poles.js';
import PORTUGUESE from './portuguese.js';
import ROMANS from './romans.js';
import SARACENS from './saracens.js';
import SHU from './shu.js';
import SICILIANS from './sicilians.js';
import SLAVS from './slavs.js';
import SPANISH from './spanish.js';
import TATARS from './tatars.js';
import TEUTONS from './teutons.js';
import TUPI from './tupi.js';
import TURKS from './turks.js';
import VIETNAMESE from './vietnamese.js';
import VIKINGS from './vikings.js';
import WEI from './wei.js';
import WU from './wu.js';

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

// Expose globally for app.js (which uses CIVS without import)
window.CIVS = CIVS;

export default CIVS;
export { CIVS };
