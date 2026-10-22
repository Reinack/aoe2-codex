const LITHUANIANS = {
  "bonuses": [
    // Each Town Center provides +100 food at game start
    {
      "line": 0,
      "type": "stat_modifier",
      "scope": "tc",
      "stat": "food_storage",
      "op": "add",
      "value": 100
    },
    // Spearman-line moves +10% faster
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "spearman",
      "stat": "speed",
      "op": "multiply",
      "value": 1.1
    },
    // Skirmisher-line moves +10% faster
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "skirmisher",
      "stat": "speed",
      "op": "multiply",
      "value": 1.1
    },
    // Each garrisoned Relic provides +1 attack to Knight-line and Leitis (max +4)
    {
      "line": 2,
      "type": "relic_stat_bonus",
      "scope": "knight",
      "stat": "attack",
      "op": "add",
      "value_per_relic": 1,
      "max": 4
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "monastery",
    "op": "multiply",
    "value": 1.2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 253,
      "eliteImgPic": 509,
      "cost": { "food": 70, "gold": 50 }
    },
    {
      "age": 2
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 200, gold: 150 } },
    { research_cost: { food: 400, gold: 300 } }
  ]
};


window.LITHUANIANS = LITHUANIANS;
export default LITHUANIANS;

