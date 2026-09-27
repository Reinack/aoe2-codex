const POLES = {
  "bonuses": [
    // Folwark replaces Mill (instantly collects food from adjacent farms when built)
    {
      "type": "building_replacement",
      "scope": "folwark",
      "replaces": "mill"
    },
    // Villagers regenerate 10/15/20 HP per minute in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "villager",
      "stat": "regen",
      "op": "add",
      "value_by_age": [0, 10, 15, 20],
      "min_age": 1
    },
    // Stone Miners generate gold in addition to stone
    {
      "type": "stat_modifier",
      "scope": "stone_miner",
      "stat": "gold_generation",
      "op": "add",
      "value": 1
    },
    // Bloodlines and Scout Cavalry-line upgrades cost -50% food
    {
      "type": "tech_cost_modifier",
      "scope": "bloodlines_scout_upgrades",
      "techs": ["bloodlines", "lightcav", "hussar", "winged_hussar"],
      "resource": "food",
      "op": "multiply",
      "value": 0.5
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "light_cavalry",
    "stat": "attack_vs_archers",
    "op": "add",
    "value": 1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 369,
      "eliteImgPic": 513
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 250 } },
    { research_cost: { food: 750, gold: 600 } }
  ]
};


window.POLES = POLES;
export default POLES;

