const PORTUGUESE = {
  "bonuses": [
    // Foragers generate wood in addition to food while foraging
    {
      "type": "stat_modifier",
      "scope": "forager",
      "stat": "wood_generation",
      "op": "add",
      "value": 1
    },
    // All units cost -20% gold
    {
      "type": "cost_modifier",
      "scope": "unit",
      "resource": "gold",
      "op": "multiply",
      "value": 0.8
    },
    // Can build Feitoria in Imperial Age (generates resources automatically)
    {
      "type": "building_unlock",
      "scope": "feitoria",
      "age": 3
    },
    // Ships +10/15/20% HP in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "ship",
      "stat": "hp",
      "op": "multiply",
      "value_by_age": [1.0, 1.10, 1.15, 1.20],
      "min_age": 1
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "tech_research",
    "op": "multiply",
    "value": 1.25
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 190,
      "eliteImgPic": 496
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 200 } },
    { research_cost: { food: 600, gold: 500 } }
  ]
};


window.PORTUGUESE = PORTUGUESE;
export default PORTUGUESE;

