const CHINESE = {
  "bonuses": [
    // Start with +3 Villagers
    {
      "line": 0,
      "type": "start_resources",
      "resource": "villager",
      "op": "add",
      "value": 3
    },
    // Start with -50 wood
    {
      "line": 0,
      "type": "start_resources",
      "resource": "wood",
      "op": "add",
      "value": -50
    },
    // Start with -200 food
    {
      "line": 0,
      "type": "start_resources",
      "resource": "food",
      "op": "add",
      "value": -200
    },
    // Technologies cost -5/10/15% in Feudal/Castle/Imperial Age
    {
      "line": 1,
      "type": "tech_cost_modifier",
      "scope": "all_tech",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [1.0, 0.95, 0.90, 0.85],
      "min_age": 1
    },
    // Town Centers +7 line of sight
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "tc",
      "stat": "los",
      "op": "add",
      "value": 7
    },
    // Town Centers provide +15 population space
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "tc",
      "stat": "pop",
      "op": "add",
      "value": 15
    },
    // Fire Lancers move +5/10% faster in Castle/Imperial Age
    {
      "line": 3,
      "type": "stat_modifier",
      "scope": "fire_lancer",
      "stat": "speed",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 1.05, 1.10],
      "min_age": 2
    },
    // Fire Ships move +5/10% faster in Castle/Imperial Age
    {
      "line": 3,
      "type": "stat_modifier",
      "scope": "fireship",
      "stat": "speed",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 1.05, 1.10],
      "min_age": 2
    }
  ],
  // Team bonus: Farms +10% food production
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "farm",
    "stat": "food_generation",
    "op": "multiply",
    "value": 1.1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 36,
      "eliteImgPic": 482
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 400, stone: 200 } },
    { research_cost: { food: 1100, gold: 900 } }
  ]
};


window.CHINESE = CHINESE;
export default CHINESE;

