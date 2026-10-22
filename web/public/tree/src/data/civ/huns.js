const HUNS = {
  "bonuses": [
    // Do not need Houses to support population (no house requirement)
    {
      "line": 0,
      "type": "house_requirement",
      "op": "remove"
    },
    // Start with -100 wood (penalty for not needing houses)
    {
      "line": 0,
      "type": "start_resources",
      "resource": "wood",
      "op": "add",
      "value": -100
    },
    // Cavalry Archers cost -10/20% in Castle/Imperial Age
    {
      "line": 1,
      "type": "cost_modifier",
      "scope": "cavalry_archer",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 0.90, 0.80],
      "min_age": 2
    },
    // Trebuchets fire more accurately against units and small targets
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "trebuchet",
      "stat": "accuracy",
      "op": "add",
      "value": 1
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "stable",
    "op": "multiply",
    "value": 1.2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 105,
      "eliteImgPic": 487,
      "cost": { "food": 60, "gold": 60 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 200 } },
    { research_cost: { wood: 300, food: 500 } }
  ]
};


window.HUNS = HUNS;
export default HUNS;

