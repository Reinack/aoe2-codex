const ETHIOPIANS = {
  "bonuses": [
    // Receive +100 gold when advancing to the next Age
    {
      "line": 0,
      "type": "age_advance_bonus",
      "resource": "gold",
      "op": "add",
      "value": 100
    },
    // Receive +100 food when advancing to the next Age
    {
      "line": 0,
      "type": "age_advance_bonus",
      "resource": "food",
      "op": "add",
      "value": 100
    },
    // Foot Archers attack +18% faster
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "foot_archer",
      "stat": "rof",
      "op": "multiply",
      "value": 0.82
    },
    // Pikeman upgrade free
    {
      "line": 2,
      "type": "free_tech",
      "techs": ["pikeman"]
    }
  ],
  // Team bonus: Outposts +3 line of sight and cost no stone
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "outpost",
    "stat": "los",
    "op": "add",
    "value": 3
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 195,
      "eliteImgPic": 501
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 200 } },
    { research_cost: { wood: 600, gold: 500 } }
  ]
};


window.ETHIOPIANS = ETHIOPIANS;
export default ETHIOPIANS;

