const CELTS = {
  "bonuses": [
    // Lumberjacks work +15% faster
    {
      "line": 0,
      "type": "building_work_speed",
      "scope": "lumberjack",
      "op": "multiply",
      "value": 1.15
    },
    // Infantry moves +5/10/15/20% faster in Dark/Feudal/Castle/Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "speed",
      "op": "multiply",
      "value_by_age": [1.05, 1.10, 1.15, 1.20]
    },
    // Livestock animals within Celt unit line of sight cannot be stolen by enemies
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "livestock",
      "stat": "steal_protection",
      "op": "add",
      "value": 1
    },
    // Siege Weapons attack +25% faster
    {
      "line": 3,
      "type": "stat_modifier",
      "scope": "siege",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "siege",
    "op": "multiply",
    "value": 1.2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 47,
      "eliteImgPic": 475
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 200 } },
    { research_cost: { food: 750, gold: 450 } }
  ]
};


window.CELTS = CELTS;
export default CELTS;

