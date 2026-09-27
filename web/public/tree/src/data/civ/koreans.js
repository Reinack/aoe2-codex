const KOREANS = {
  "bonuses": [
    // Stone miners work +20% faster
    {
      "line": 0,
      "type": "building_work_speed",
      "scope": "miner",
      "op": "multiply",
      "value": 1.2
    },
    // Ranged Soldiers and Infantry cost -50% wood
    {
      "line": 1,
      "type": "cost_modifier",
      "scope": "infantry",
      "resource": "wood",
      "op": "multiply",
      "value": 0.5
    },
    // Foot Archers cost -50% wood
    {
      "line": 1,
      "type": "cost_modifier",
      "scope": "foot_archer",
      "resource": "wood",
      "op": "multiply",
      "value": 0.5
    },
    // Archer armor and tower upgrades free (Bombard Tower requires Chemistry)
    {
      "line": 2,
      "type": "free_tech",
      "techs": ["paddedarcharmor", "leatherarcharmor", "ringarcherarmor", "guardtower_tech", "keep_tech", "bombardtower_tech"]
    },
    // Warships cost -20% wood
    {
      "line": 3,
      "type": "cost_modifier",
      "scope": "ship",
      "resource": "wood",
      "op": "multiply",
      "value": 0.8
    }
  ],
  // Team bonus: Villagers +3 line of sight
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "villager",
    "stat": "los",
    "op": "add",
    "value": 3
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 117,
      "eliteImgPic": 490
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 400, gold: 200 } },
    { research_cost: { wood: 700, gold: 400 } }
  ]
};


window.KOREANS = KOREANS;
export default KOREANS;

