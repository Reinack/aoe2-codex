const BYZANTINES = {
  "bonuses": [
    // Buildings +10/20/30/40% HP in Dark/Feudal/Castle/Imperial Age
    {
      "line": 0,
      "type": "stat_modifier",
      "scope": "building",
      "stat": "hp",
      "op": "multiply",
      "value_by_age": [1.10, 1.20, 1.30, 1.40]
    },
    // Camel Riders cost -25%
    {
      "line": 1,
      "type": "cost_modifier",
      "scope": "camel",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Skirmishers cost -25%
    {
      "line": 1,
      "type": "cost_modifier",
      "scope": "skirmisher",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Spearman-line cost -25%
    {
      "line": 1,
      "type": "cost_modifier",
      "scope": "spearman",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Town Watch and Town Patrol free
    {
      "line": 2,
      "type": "free_tech",
      "techs": ["townwatch", "townpatrol"]
    },
    // Advancing to Imperial Age costs -33%
    {
      "line": 3,
      "type": "age_advance_cost",
      "age": 3,
      "op": "multiply",
      "value": 0.67
    },
    // Fire Ships and Dromons attack +25% faster (rof multiplier 0.75)
    {
      "line": 4,
      "type": "stat_modifier",
      "scope": "fire_ship",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75
    }
  ],
  // Team bonus: Monks heal +100% faster
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "monk",
    "stat": "heal_rate",
    "op": "multiply",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 35,
      "eliteImgPic": 476,
      "cost": { "food": 70, "gold": 75 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 300 } },
    { research_cost: { food: 800, gold: 600 } }
  ]
};


window.BYZANTINES = BYZANTINES;
export default BYZANTINES;

