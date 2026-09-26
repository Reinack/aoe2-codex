const WEI = {
  "bonuses": [
    // Receive one free Villager for each economic upgrade researched
    {
      "line": 0,
      "type": "free_tech",
      "techs": ["horsecollar", "heavyplow", "croprotation", "doublebitaxe", "bowsaw", "twomansaw", "goldmining", "goldshaft", "stonemining", "stoneshaft"]
    },
    // Hei Guang Cavalry and Xianbei Raider +20/30% HP in Castle/Imperial Age
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "hei_guang_xianbei",
      "stat": "hp",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 1.2, 1.3],
      "min_age": 2
    },
    // Traction Trebuchets cost -25%
    {
      "line": 2,
      "type": "cost_modifier",
      "scope": "traction_treb",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Lou Chuans cost -25%
    {
      "line": 2,
      "type": "cost_modifier",
      "scope": "lou_chuan",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    }
  ],
  // Team bonus: Cavalry +2 attack vs. Siege Weapons
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "cavalry",
    "stat": "attack_vs_siege",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 432,
      "eliteImgPic": 526,
      "cost": { "food": 60, "gold": 80 },
      "elite_cost": { "food": 1000, "gold": 800 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 200 } },
    { research_cost: { food: 700, gold: 600 } }
  ]
};


window.WEI = WEI;
export default WEI;

