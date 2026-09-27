const VIKINGS = {
  "bonuses": [
    // Wheelbarrow and Hand Cart free
    {
      "type": "free_tech",
      "techs": ["wheelbarrow", "handcart"]
    },
    // Infantry +20% HP starting in Feudal Age
    {
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "hp",
      "op": "multiply",
      "value": 1.2,
      "min_age": 1
    },
    // Warships cost -10/15/20% in Feudal/Castle/Imperial Age
    {
      "type": "cost_modifier",
      "scope": "ship",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [1.0, 0.90, 0.85, 0.80],
      "min_age": 1
    }
  ],
  // Team bonus: Docks cost -15%
  "teamBonus": {
    "type": "building_cost_modifier",
    "scope": "dock",
    "resource": "all",
    "op": "multiply",
    "value": 0.85
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 38,
      "eliteImgPic": 485
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 600, gold: 450 } },
    { research_cost: { food: 650, gold: 500 } }
  ]
};


window.VIKINGS = VIKINGS;
export default VIKINGS;

