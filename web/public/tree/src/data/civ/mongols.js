const MONGOLS = {
  "bonuses": [
    // Hunters work +40% faster
    {
      "line": 0,
      "type": "building_work_speed",
      "scope": "hunter",
      "op": "multiply",
      "value": 1.4
    },
    // Cavalry Archers attack +25% faster
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "cavalry_archer",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75
    },
    // Scout Cavalry-line +20/30% HP in Castle/Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "light_cavalry",
      "stat": "hp",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 1.2, 1.3],
      "min_age": 2
    },
    // Steppe Lancers +20/30% HP in Castle/Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "steppe_lancer",
      "stat": "hp",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 1.2, 1.3],
      "min_age": 2
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "light_cavalry",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 42,
      "eliteImgPic": 484
    }
  ],
  "uniqueTechs": [
    { research_cost: { } },
    { research_cost: { wood: 500, gold: 450 } }
  ]
};


window.MONGOLS = MONGOLS;
export default MONGOLS;

