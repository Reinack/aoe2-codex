const BENGALIS = {
  "bonuses": [
    // Town Centers spawn 2 Villagers when the next Age is reached
    {
      "type": "unit_spawn_on_age",
      "scope": "villager",
      "op": "add",
      "value": 2
    },
    // Cavalry +2 attack vs. Skirmishers
    {
      "type": "stat_modifier",
      "scope": "cavalry",
      "stat": "attack_vs_skirmisher",
      "op": "add",
      "value": 2
    },
    // Elephant Units receive -25% bonus damage and are more resistant to conversion
    {
      "type": "stat_modifier",
      "scope": "elephant",
      "stat": "bonus_damage_reduction",
      "op": "multiply",
      "value": 0.75
    },
    // Monks +3 melee armor and +3 pierce armor
    {
      "type": "stat_modifier",
      "scope": "monk",
      "stat": "armor_melee_and_pierce",
      "op": "add",
      "value_melee": 3,
      "value_pierce": 3
    },
    // Ships regenerate 15 HP per minute
    {
      "type": "stat_modifier",
      "scope": "ship",
      "stat": "regen",
      "op": "add",
      "value": 15
    }
  ],
  // Team bonus: Trade Units generate +10% food in addition to gold
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "trade_unit",
    "stat": "food_generation",
    "op": "multiply",
    "value": 1.1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 389,
      "eliteImgPic": 520,
      "cost": { "gold": 60 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 200 } },
    { research_cost: { food: 800, gold: 700 } }
  ]
};


window.BENGALIS = BENGALIS;
export default BENGALIS;

