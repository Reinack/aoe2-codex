const JURCHENS = {
  "bonuses": [
    // Meat of hunted and livestock animals doesn't decay
    {
      "type": "stat_modifier",
      "scope": "hunted_livestock",
      "stat": "food_decay",
      "op": "multiply",
      "value": 0
    },
    // Mounted Units and Fire Lancers attack +25% faster starting in Feudal Age
    {
      "type": "stat_modifier",
      "scope": "cavalry",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75,
      "min_age": 1
    },
    // Siege Engineers available in Castle Age
    {
      "type": "age_unlock",
      "scope": "siege_engineers",
      "op": "add",
      "value": -1
    },
    // Siege and Fortification upgrades cost -75% wood and research +100% faster
    {
      "type": "tech_cost_modifier",
      "scope": "siege_fortification_upgrades",
      "resource": "wood",
      "op": "multiply",
      "value": 0.25
    },
    // Units receive -50% friendly fire damage
    {
      "type": "stat_modifier",
      "scope": "unit",
      "stat": "friendly_fire_reduction",
      "op": "multiply",
      "value": 0.5
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "gunpowder",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 461,
      "eliteImgPic": 524,
      "cost": { "food": 80, "gold": 55 },
      "elite_cost": { "food": 950, "gold": 550 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 400, stone: 200 } },
    { research_cost: { food: 700, gold: 600 } }
  ]
};

window.JURCHENS = JURCHENS;
export default JURCHENS;
