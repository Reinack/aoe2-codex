const ROMANS = {
  "bonuses": [
    // Villagers gather, build, and repair +5% faster
    {
      "type": "building_work_speed",
      "scope": "villager",
      "op": "multiply",
      "value": 1.05
    },
    // Infantry armor upgrade effects are doubled (+2 armor per upgrade instead of +1)
    {
      "type": "tech_effectiveness",
      "scope": "infantry_armor_upgrades",
      "op": "multiply",
      "value": 2
    },
    // Scorpions cost -50% gold
    {
      "type": "cost_modifier",
      "scope": "scorpion",
      "resource": "gold",
      "op": "multiply",
      "value": 0.5
    },
    // Galley-line and Dromons +1 melee armor and +1 pierce armor
    {
      "type": "stat_modifier",
      "scope": "galley_dromon",
      "stat": "armor_melee_and_pierce",
      "op": "add",
      "value_melee": 1,
      "value_pierce": 1
    }
  ],
  // Team bonus: Scorpions have reduced minimum range
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "scorpion",
    "stat": "min_range",
    "op": "add",
    "value": -1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 405,
      "eliteImgPic": 521,
      "cost": { "food": 75, "gold": 85 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 300 } },
    { research_cost: { food: 800, gold: 600 } }
  ]
};


window.ROMANS = ROMANS;
export default ROMANS;

