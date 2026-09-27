const GEORGIANS = {
  "bonuses": [
    // Start with a free Mule Cart
    {
      "type": "start_resources",
      "resource": "mulecart",
      "op": "add",
      "value": 1
    },
    // Units and buildings receive -15% damage when located on higher elevation
    {
      "type": "stat_modifier",
      "scope": "unit_building",
      "stat": "elevation_damage_reduction",
      "op": "multiply",
      "value": 0.85
    },
    // Mounted Units regenerate 2/8/14 HP per minute in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "cavalry",
      "stat": "regen",
      "op": "add",
      "value_by_age": [0, 2, 8, 14],
      "min_age": 1
    },
    // Fortified Churches provide Villagers in a 9-tile radius with +10% work rate
    {
      "type": "aura",
      "scope": "fortified_church",
      "op": "multiply",
      "value": 1.1
    }
  ],
  // Team bonus: Building repairs cost -25%
  "teamBonus": {
    "type": "cost_modifier",
    "scope": "repair",
    "resource": "all",
    "op": "multiply",
    "value": 0.75
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 408,
      "eliteImgPic": 523,
      "cost": { "food": 60, "gold": 45 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 350, gold: 250 } },
    { research_cost: { food: 750, gold: 600 } }
  ]
};


window.GEORGIANS = GEORGIANS;
export default GEORGIANS;

