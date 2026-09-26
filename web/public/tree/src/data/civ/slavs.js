const SLAVS = {
  "bonuses": [
    // Farmers work +15% faster
    {
      "type": "building_work_speed",
      "scope": "farmer",
      "op": "multiply",
      "value": 1.15
    },
    // Arson and Gambesons free
    {
      "type": "free_tech",
      "techs": ["arson", "gambesons"]
    },
    // Siege Workshop Units cost -15%
    {
      "type": "cost_modifier",
      "scope": "siege",
      "resource": "all",
      "op": "multiply",
      "value": 0.85
    },
    // Monks move +20% faster
    {
      "type": "stat_modifier",
      "scope": "monk",
      "stat": "speed",
      "op": "multiply",
      "value": 1.2
    }
  ],
  // Team bonus: Military buildings (except Castles) provide +5 population space
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "military_building",
    "stat": "pop",
    "op": "add",
    "value": 5
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 114,
      "eliteImgPic": 494,
      "cost": { "food": 60, "gold": 70 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 400, gold: 200 } },
    { research_cost: { food: 700, gold: 600 } }
  ]
};


window.SLAVS = SLAVS;
export default SLAVS;

