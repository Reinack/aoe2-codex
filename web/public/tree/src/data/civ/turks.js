const TURKS = {
  "bonuses": [
    // Gold miners work +25% faster
    {
      "type": "building_work_speed",
      "scope": "gold_miner",
      "op": "multiply",
      "value": 1.25
    },
    // Scout Cavalry-line +1 pierce armor and upgrades free; Chemistry free
    {
      "type": "free_tech",
      "techs": ["scout", "lightcav", "hussar"]
    },
    // Gunpowder technologies cost -50%
    {
      "type": "cost_modifier",
      "scope": "gunpowder_tech",
      "resource": "all",
      "op": "multiply",
      "value": 0.5
    },
    // Gunpowder Units +25% HP
    {
      "type": "stat_modifier",
      "scope": "gunpowder",
      "stat": "hp",
      "op": "multiply",
      "value": 1.25
    }
  ],
  // Team bonus: Gunpowder Units train +25% faster
  "teamBonus": {
    "type": "creation_speed",
    "scope": "gunpowder",
    "op": "multiply",
    "value": 0.75
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 39,
      "eliteImgPic": 480
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 350, gold: 150 } },
    { research_cost: { food: 600, gold: 650 } }
  ]
};


window.TURKS = TURKS;
export default TURKS;

