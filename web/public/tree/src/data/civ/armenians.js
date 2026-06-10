const ARMENIANS = {
  "bonuses": [
    // Mule Carts cost -25%
    {
      "type": "building_cost_modifier",
      "scope": "mulecart",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Mule Cart technologies are +40% more effective
    {
      "type": "tech_effectiveness",
      "scope": "mule_cart_tech",
      "op": "multiply",
      "value": 1.4
    },
    // Spearman- and Militia-line upgrades (except Man-at-Arms) available one age earlier
    {
      "type": "age_unlock",
      "scope": "spearman_militia_upgrades",
      "op": "add",
      "value": -1
    },
    // First Fortified Church receives a free Relic
    {
      "type": "free_tech"
    },
    // Galley-line and Dromons fire an additional projectile
    {
      "type": "stat_modifier",
      "scope": "galley_dromon",
      "stat": "projectile_count",
      "op": "add",
      "value": 1
    }
  ],
  // Team bonus: Infantry +2 line of sight
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "infantry",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "available": [
    "barracks",
    "archery",
    "stable",
    "siege",
    "blacksmith",
    "dock",
    "university",
    "monastery",
    "castle",
    "market",
    "tc",
    "mill",
    "mulecart",
    "militia",
    "manatarms",
    "longsword",
    "twohanded",
    "champion",
    "spearman",
    "pikeman",
    "halberdier",
    "squires",
    "arson",
    "gambesons",
    "archer",
    "crossbow",
    "arbalester",
    "skirmisher",
    "eliteskirm",
    "cavarcher",
    "scout",
    "lightcav",
    "knight",
    "cavalier",
    "bloodlines",
    "husbandry",
    "siegetower",
    "batteringram",
    "cappedram",
    "mangonel",
    "onager",
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
    "galleon",
    "firegalley",
    "demoraft",
    "demoship",
    "heavydemo",
    "drydock",
    "shipwright",
    "hulk",
    "war_hulk",
    "carrack",
    "dromon",
    "masonry",
    "ballistics",
    "chemistry",
    "guardtower",
    "murderhole",
    "siegeengineers",
    "fortifiedwall",
    "heatedshot",
    "bombardtower",
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
    "warrior_priest",
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
    "horsecollar",
    "heavyplow",
    "doublebitaxe_m",
    "bowsaw_m",
    "twomansaw_m",
    "goldmining_m",
    "goldshaft_m",
    "stonemining_m",
    "stoneshaft_m",
    "fireship",
    "fishing_lines",
    "gillnets",
    "medium_warships",
    "heavy_warships",
    "careening",
    "clinker_construction",
    "carvel_hull",
    "siphons",
    "incendiaries",
    "mule_cart",
    "fortified_church",
    "architecture",
    "stonewall",
    "watchtower",
    "palisadewall",
    "palisadegate",
    "outpost",
    "house"
  ],
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 407,
      "eliteImgPic": 522
    },
    {
      "age": 2
    }
  ],
  "overrides": {
    "spearmen": {
      "age": 0,   
      "row": 1
    },
    "pikeman": {
      "age": 1
    },
    
    "manatarms": {
      "age": 1,   
      "row": 2
    },

    "halberdier": {
      "age": 2
    },
    "longsword": {
      "age": 1,       
      "row": 3
    },
    "twohanded": {
      "age": 2,       
      "row": 4
    },
    "champion": {
      "age": 2,       
      "row": 5
    }
  },
  "uniqueTechs": [
    { research_cost: { wood: 350, gold: 250 } },
    { research_cost: { food: 800, gold: 600 } }
  ]
};

window.ARMENIANS = ARMENIANS;
export default ARMENIANS;
