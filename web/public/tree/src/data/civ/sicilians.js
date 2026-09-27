const SICILIANS = {
  "bonuses": [
    // Start with +100 stone
    {
      "type": "start_resources",
      "resource": "stone",
      "op": "add",
      "value": 100
    },
    // Farm upgrades provide +125% additional food (2.25x the normal value)
    {
      "type": "tech_effectiveness",
      "scope": "farm_upgrades",
      "op": "multiply",
      "value": 2.25
    },
    // Soldiers receive -40% bonus damage from enemy attacks
    {
      "type": "stat_modifier",
      "scope": "soldier",
      "stat": "bonus_damage_reduction",
      "op": "multiply",
      "value": 0.6
    },
    // Can build Donjon in Dark Age (replaces Watch Tower-line)
    {
      "type": "building_unlock",
      "scope": "donjon",
      "age": 0
    },
    // Fortifications built +50% faster; Town Centers built +100% faster
    {
      "type": "building_work_speed",
      "scope": "fortification",
      "op": "multiply",
      "value": 1.5
    }
  ],
  "teamBonus": {
    "type": "cost_modifier",
    "scope": "transport_ship",
    "resource": "all",
    "op": "multiply",
    "value": 0.5
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 356,
      "eliteImgPic": 512
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 300 } },
    { research_cost: { food: 750, gold: 550 } }
  ]
};


window.SICILIANS = SICILIANS;
export default SICILIANS;

