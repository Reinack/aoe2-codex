const MAYANS = {
  "bonuses": [
    // Start with +1 extra Villager
    {
      "line": 0,
      "type": "start_resources",
      "resource": "villager",
      "op": "add",
      "value": 1
    },
    // Start with -50 food (penalty for extra villager)
    {
      "line": 0,
      "type": "start_resources",
      "resource": "food",
      "op": "add",
      "value": -50
    },
    // Resources last +15% longer (animals, forage, mines have more resources)
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "resource",
      "stat": "duration",
      "op": "multiply",
      "value": 1.15
    },
    // Foot Archers cost -10/20/30% in Feudal/Castle/Imperial Age
    {
      "line": 2,
      "type": "cost_modifier",
      "scope": "foot_archer",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [1.0, 0.90, 0.80, 0.70],
      "min_age": 1
    }
  ],
  "teamBonus": {
    "type": "building_cost_modifier",
    "scope": "all_walls",
    "resource": "all",
    "op": "multiply",
    "value": 0.5
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 108,
      "eliteImgPic": 488
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 350, gold: 300 } },
    { research_cost: { food: 850, gold: 700 } }
  ]
};


window.MAYANS = MAYANS;
export default MAYANS;


