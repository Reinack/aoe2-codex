const CUMANS = {
  "bonuses": [
    // One additional Town Center can be built in Feudal Age
    {
      "line": 0,
      "type": "building_unlock",
      "scope": "tc",
      "age": 1,
      "count": 1
    },
    // Mounted Units move +5/10/15% faster in Feudal/Castle/Imperial Age
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "cavalry",
      "stat": "speed",
      "op": "multiply",
      "value_by_age": [1.0, 1.05, 1.10, 1.15],
      "min_age": 1
    },
    // Archery Ranges cost -75 wood
    {
      "line": 2,
      "type": "building_cost_modifier",
      "scope": "archery",
      "resource": "wood",
      "op": "add",
      "value": -75
    },
    // Stables cost -75 wood
    {
      "line": 2,
      "type": "building_cost_modifier",
      "scope": "stable",
      "resource": "wood",
      "op": "add",
      "value": -75
    },
    // Siege Workshop and Battering Ram available in Feudal Age; Capped Ram in Castle Age
    {
      "line": 3,
      "type": "age_unlock",
      "scope": "siege_workshop",
      "op": "add",
      "value": -1
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "palisade",
    "stat": "hp",
    "op": "multiply",
    "value": 1.33
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 252,
      "eliteImgPic": 508
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 200, gold: 200 } },
    { research_cost: { food: 600, gold: 500 } }
  ]
};

window.CUMANS = CUMANS;
export default CUMANS;
