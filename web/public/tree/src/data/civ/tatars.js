const TATARS = {
  "bonuses": [
    // Livestock animals last +50% longer (more food per animal)
    {
      "type": "stat_modifier",
      "scope": "livestock",
      "stat": "food_duration",
      "op": "multiply",
      "value": 1.5
    },
    // Units deal +25% damage when fighting from higher elevation
    {
      "type": "stat_modifier",
      "scope": "unit",
      "stat": "elevation_attack_bonus",
      "op": "multiply",
      "value": 1.25
    },
    // New Town Centers spawn 2 Sheep starting in Castle Age
    {
      "type": "unit_spawn_on_build",
      "scope": "sheep",
      "building": "tc",
      "op": "add",
      "value": 2
    },
    // Thumb Ring and Parthian Tactics free
    {
      "type": "free_tech",
      "techs": ["thumbring", "parthian"]
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "cavalry_archer",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 251,
      "eliteImgPic": 507,
      "cost": { "food": 60, "gold": 40 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 350, stone: 200 } },
    { research_cost: { wood: 600, gold: 500 } }
  ]
};


window.TATARS = TATARS;
export default TATARS;

