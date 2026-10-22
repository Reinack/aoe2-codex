const SARACENS = {
  "bonuses": [
    // Market trading fee only 5%; Markets cost -100 wood
    {
      "type": "building_cost_modifier",
      "scope": "market",
      "resource": "wood",
      "op": "add",
      "value": -100
    },
    // Camel Units +25% HP
    {
      "type": "stat_modifier",
      "scope": "camel",
      "stat": "hp",
      "op": "multiply",
      "value": 1.25
    },
    // Galley-line attacks +25% faster
    {
      "type": "stat_modifier",
      "scope": "galley",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75
    },
    // Transport Ships +100% HP, +20 carry capacity
    {
      "type": "stat_modifier",
      "scope": "transport_ship",
      "stat": "hp",
      "op": "multiply",
      "value": 2
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "foot_archer",
    "stat": "attack_vs_buildings",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 37,
      "eliteImgPic": 479,
      "cost": { "food": 55, "gold": 85 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 300, gold: 200 } },
    { research_cost: { food: 650, gold: 500 } }
  ]
};


window.SARACENS = SARACENS;
export default SARACENS;

