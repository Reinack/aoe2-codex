const TUPI = {
  "bonuses": [
    // Start with +25 of each resource (food, wood, gold, stone)
    {
      "type": "start_resources",
      "resource": "all",
      "op": "add",
      "value": 25
    },
    // Villagers can garrison in Settlements for protection
    {
      "type": "garrison_in_building",
      "scope": "villager",
      "building": "tahsili"
    },
    // Fallen units return 15% of their cost as resources
    {
      "type": "stat_modifier",
      "scope": "unit",
      "stat": "death_refund",
      "op": "multiply",
      "value": 0.15
    },
    // Archery Range and Barracks upgrades cost -50% food
    {
      "type": "tech_cost_modifier",
      "scope": "archery_barracks",
      "resource": "food",
      "op": "multiply",
      "value": 0.5
    }
  ],
  // Team bonus: Towers and Castles provide +10 population space
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "castle_tower",
    "stat": "pop",
    "op": "add",
    "value": 10
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 549,
      "eliteImgPic": 550
    },
    {
      "age": 2
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 200 } },
    { research_cost: { food: 650, gold: 600 } }
  ]
};


window.TUPI = TUPI;
export default TUPI;


