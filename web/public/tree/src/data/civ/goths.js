const GOTHS = {
  "bonuses": [
    // Loom is researched instantly and free
    {
      "type": "free_tech",
      "techs": ["loom"]
    },
    // Hunters carry +15; hunted animals last +20% longer
    {
      "type": "stat_modifier",
      "scope": "hunter",
      "stat": "carry",
      "op": "add",
      "value": 15
    },
    // Infantry costs -15/20/25/30% in Dark/Feudal/Castle/Imperial Age
    {
      "type": "cost_modifier",
      "scope": "infantry",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [0.85, 0.80, 0.75, 0.70]
    },
    // Infantry +1/+2/+3 attack vs. buildings in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "attack_vs_buildings",
      "op": "add",
      "value_by_age": [0, 1, 2, 3],
      "min_age": 1
    },
    // +10 population space in Imperial Age
    {
      "type": "stat_modifier",
      "scope": "population",
      "stat": "pop_space",
      "op": "add",
      "value": 10
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "barracks",
    "op": "multiply",
    "value": 1.2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 50,
      "eliteImgPic": 478
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 450, gold: 250 } },
    { research_cost: { wood: 400, gold: 600 } }
  ]
};


window.GOTHS = GOTHS;
export default GOTHS;

