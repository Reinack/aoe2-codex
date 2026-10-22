const BERBERS = {
  "bonuses": [
    // Villagers move +5% faster in Dark Age, +10% starting in Feudal Age
    {
      "type": "stat_modifier",
      "scope": "villager",
      "stat": "speed",
      "op": "multiply",
      "value_by_age": [1.05, 1.10, 1.10, 1.10]
    },
    // Stable Units cost -15/20% in Castle/Imperial Age
    {
      "type": "cost_modifier",
      "scope": "cavalry",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 0.85, 0.80],
      "min_age": 2
    },
    // Ships move +10% faster
    {
      "type": "stat_modifier",
      "scope": "ship",
      "stat": "speed",
      "op": "multiply",
      "value": 1.1
    }
  ],
  // Team bonus: Genitour available at the Archery Range starting in Castle Age
  "teamBonus": {
    "type": "unit_availability",
    "scope": "genitour",
    "building": "archery",
    "age": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 191,
      "eliteImgPic": 498
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 400, stone: 200 } },
    { research_cost: { food: 600, gold: 500 } }
  ]
};


window.BERBERS = BERBERS;
export default BERBERS;

