const BRITONS = {
  "bonuses": [
    // Shepherds work +25% faster
    {
      "type": "building_work_speed",
      "scope": "shepherd",
      "op": "multiply",
      "value": 1.25
    },
    // Town Centers cost -50% wood starting in Castle Age
    {
      "type": "building_cost_modifier",
      "scope": "tc",
      "resource": "wood",
      "op": "multiply",
      "value": 0.5
    },
    // Foot Archers (except Skirmishers) +1/+2 range in Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "foot_archer_no_skirm",
      "stat": "range",
      "op": "add",
      "value_by_age": [0, 0, 1, 2],
      "min_age": 2
    }
  ],
  // Team bonus: Archery Ranges work +10% faster
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "archer",
    "op": "multiply",
    "value": 1.1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 41,
      "eliteImgPic": 472
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 300 } },
    { research_cost: { wood: 800, gold: 500 } }
  ]
};


window.BRITONS = BRITONS;
export default BRITONS;



