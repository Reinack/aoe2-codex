const MUISCA = {
  "bonuses": [
    // Advancing to the next Age costs -50% gold
    {
      "type": "age_advance_cost",
      "resource": "gold",
      "op": "multiply",
      "value": 0.5
    },
    // Settlements cost -25%
    {
      "type": "building_cost_modifier",
      "scope": "tahsili",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Settlements heal nearby units within a small radius
    {
      "type": "building_effect",
      "scope": "tahsili",
      "effect": "heal_nearby_units"
    },
    // Champi Warriors +1/2/3 melee armor in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "champiwarrior",
      "stat": "armor_melee",
      "op": "add",
      "value_by_age": [0, 1, 2, 3],
      "min_age": 1
    },
    // Archery Range Units +1/2/3 melee armor in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "foot_archer",
      "stat": "armor_melee",
      "op": "add",
      "value_by_age": [0, 1, 2, 3],
      "min_age": 1
    },
    // Monks regain faith +50% faster
    {
      "type": "stat_modifier",
      "scope": "monk",
      "stat": "faith",
      "op": "multiply",
      "value": 1.5
    },
    // Caravan free
    {
      "type": "free_tech",
      "tech": "caravan"
    },
    // Guilds free
    {
      "type": "free_tech",
      "tech": "guilds"
    }
  ],
  // Team bonus: Natural gold sources last +15% longer
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "gold_source",
    "stat": "duration",
    "op": "multiply",
    "value": 1.15
  },
  "available": [
    "barracks",
    "archery",
    "siege",
    "blacksmith",
    "dock",
    "university",
    "monastery",
    "castle",
    "market",
    "tc",
    "tahsili",
    "spearman",
    "pikeman",
    "halberdier",
    "squires",
    "arson",
    "champiscout",
    "champirunner",
    "champiwarrior",
    "elitechampi",
    "xolotl_warrior",
    "temple_guard",
    "archer",
    "crossbow",
    "arbalester",
    "skirmisher",
    "eliteskirm",
    "siegetower",
    "batteringram",
    "cappedram",
    "mangonel",
    "onager",
    "siegeonager",
    "scorpion",
    "heavyscorpion",
    "forging",
    "ironcasting",
    "blastfurnace",
    "scalemailarmor",
    "chainmailarmor",
    "platemailarmor",
    "paddedarcharmor",
    "leatherarcharmor",
    "ringarcherarmor",
    "scalebarding",
    "chainbarding",
    "fletching",
    "bodkinarrow",
    "bracer",
    "fishingship",
    "transportship",
    "tradecog",
    "galley",
    "wargalley",
    "firegalley",
    "demoraft",
    "demoship",
    "drydock",
    "shipwright",
    "hulk",
    "war_hulk",
    "catapult_gall",
    "masonry",
    "ballistics",
    "chemistry",
    "guardtower",
    "arrowslits",
    "murderhole",
    "treadmillcrane",
    "fortifiedwall",
    "keep",
    "heatedshot",
    "monk",
    "redemption",
    "atonement",
    "heresy",
    "sanctity",
    "fervor",
    "herbalmedicine",
    "devotion",
    "illumination",
    "blockprinting",
    "theocracy",
    "faith",
    "trebuchet",
    "petard",
    "uniqueunit",
    "eliteunique",
    "hoardings",
    "conscription",
    "sappers",
    "slinger",
    "tradecart",
    "caravan",
    "coinage",
    "banking",
    "guilds",
    "villager",
    "loom",
    "wheelbarrow",
    "townwatch",
    "handcart",
    "townpatrol",
    "horsecollar_t",
    "heavyplow_t",
    "croprotation_t",
    "doublebitaxe_t",
    "bowsaw_t",
    "twomansaw_t",
    "goldmining_t",
    "goldshaft_t",
    "stonemining_t",
    "stoneshaft_t",
    "carrack",
    "heavydemo",
    "galleon",
    "fireship",
    "fishing_lines",
    "gillnets",
    "medium_warships",
    "heavy_warships",
    "careening",
    "clinker_construction",
    "watchtower",
    "palisadewall",
    "palisadegate",
    "outpost", 
    "stonewall",
    "gate",
    "house"
  ],
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 543,
      "eliteImgPic": 544
    },
    {
      "age": 2
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 350 } },
    { research_cost: { wood: 450, gold: 350 } }
  ]
};


window.MUISCA = MUISCA;
export default MUISCA;

