const INCAS = {
  "bonuses": [
    // Houses and Settlements provide +5 population space
    {
      "type": "stat_modifier",
      "scope": "house",
      "stat": "pop",
      "op": "add",
      "value": 5
    },
    // Buildings cost -15% stone
    {
      "type": "building_cost_modifier",
      "scope": "building",
      "resource": "stone",
      "op": "multiply",
      "value": 0.85
    },
    // Military Units cost -5/10/15/20% food in Dark/Feudal/Castle/Imperial Age
    {
      "type": "cost_modifier",
      "scope": "military_unit",
      "resource": "food",
      "op": "multiply",
      "value_by_age": [0.95, 0.90, 0.85, 0.80]
    },
    // Villagers are affected by Infantry Blacksmith upgrades starting in Castle Age
    {
      "type": "tech_applies_to",
      "scope": "villager",
      "techs": ["blacksmith_infantry_upgrades"]
    }
  ],
  // Team bonus: Start with a free Llama (bonus livestock)
  "teamBonus": {
    "type": "start_resources",
    "resource": "llama",
    "op": "add",
    "value": 1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 97,
      "eliteImgPic": 495
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 200 } },
    { research_cost: { food: 550, gold: 450 } }
  ]
};


window.INCAS = INCAS;
export default INCAS;

