const SHU = {
  "bonuses": [
    // Lumberjacks generate food in addition to wood while chopping
    {
      "line": 0,
      "type": "stat_modifier",
      "scope": "lumberjack",
      "stat": "food_generation",
      "op": "add",
      "value": 1
    },
    // Archery Unit technologies at Archery Range and Blacksmith cost -25%
    {
      "line": 1,
      "type": "tech_cost_modifier",
      "scope": "archer_unit_techs",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Siege Weapons move +10/15% faster in Castle/Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "siege",
      "stat": "speed",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 1.10, 1.15],
      "min_age": 2
    },
    // Siege Warships move +10/15% faster in Castle/Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "ship",
      "stat": "speed",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 1.10, 1.15],
      "min_age": 2
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "foot_archer",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 434,
      "eliteImgPic": 527,
      "cost": { "food": 60, "gold": 15 },
      "elite_cost": { "food": 900, "gold": 500 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 350 } },
    { research_cost: { food: 850, gold: 700 } }
  ]
};


window.SHU = SHU;
export default SHU;

