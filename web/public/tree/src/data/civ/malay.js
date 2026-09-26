const MALAY = {
  "bonuses": [
    // Advancing to the next Age is +66% faster
    {
      "line": 0,
      "type": "age_advance_cost",
      "op": "multiply",
      "value": 0.34
    },
    // Infantry armor upgrades free
    {
      "line": 1,
      "type": "free_tech",
      "techs": ["scalemailarmor", "chainmailarmor", "platemailarmor"]
    },
    // Battle Elephants cost -25/35% in Castle/Imperial Age
    {
      "line": 2,
      "type": "cost_modifier",
      "scope": "battleeleph",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 0.75, 0.65],
      "min_age": 2
    },
    // Fish Traps cost -33%
    {
      "line": 3,
      "type": "cost_modifier",
      "scope": "fish_trap",
      "resource": "wood",
      "op": "multiply",
      "value": 0.67
    },
    // Fish Traps provide +200% more food (3x the normal amount)
    {
      "line": 3,
      "type": "stat_modifier",
      "scope": "fish_trap",
      "stat": "food_generation",
      "op": "multiply",
      "value": 3
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "dock",
    "stat": "los",
    "op": "add",
    "value": 6
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 233,
      "eliteImgPic": 503
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 350, gold: 300 } },
    { research_cost: { food: 700, gold: 600 } }
  ]
};


window.MALAY = MALAY;
export default MALAY;

