const BURGUNDIANS = {
  "bonuses": [
    // Economic upgrades available one age earlier and cost -33% food
    {
      "type": "tech_cost_modifier",
      "scope": "economic_tech",
      "resource": "food",
      "op": "multiply",
      "value": 0.67
    },
    // Stable technologies cost -50%
    {
      "type": "tech_cost_modifier",
      "scope": "stable",
      "resource": "all",
      "op": "multiply",
      "value": 0.5
    },
    // Cavalier upgrade available in Castle Age
    {
      "type": "age_unlock",
      "scope": "cavalier",
      "op": "add",
      "value": -1
    },
    // Gunpowder Units +25% attack
    {
      "type": "stat_modifier",
      "scope": "gunpowder",
      "stat": "attack",
      "op": "multiply",
      "value": 1.25
    }
  ],
  // Team bonus: Relics generate food in addition to gold
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "relic",
    "stat": "food_generation",
    "op": "add",
    "value": 1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 355,
      "eliteImgPic": 511,
      "cost": { "food": 55, "gold": 55 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 300 } },
    { research_cost: { food: 600, gold: 500 } }
  ]
};

window.BURGUNDIANS = BURGUNDIANS;
export default BURGUNDIANS;
