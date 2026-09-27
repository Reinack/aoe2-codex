const DRAVIDIANS = {
  "bonuses": [
    // Fishermen and Fishing Ships carry +15
    {
      "line": 0,
      "type": "stat_modifier",
      "scope": "fisherman",
      "stat": "carry",
      "op": "add",
      "value": 15
    },
    // Receive +200 wood when advancing to the next Age
    {
      "line": 1,
      "type": "resource_on_age",
      "resource": "wood",
      "op": "add",
      "value": 200
    },
    // Skirmishers attack +25% faster
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "skirmisher",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75
    },
    // Elephant Archers attack +25% faster
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "elephant_archer",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75
    },
    // Barracks technologies cost -50%
    {
      "line": 3,
      "type": "tech_cost_modifier",
      "scope": "barracks",
      "resource": "all",
      "op": "multiply",
      "value": 0.5
    },
    // Siege Weapons cost -33% wood
    {
      "line": 4,
      "type": "cost_modifier",
      "scope": "siege",
      "resource": "wood",
      "op": "multiply",
      "value": 0.67
    }
  ],
  // Team bonus: Docks provide +5 population space
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "dock",
    "stat": "pop",
    "op": "add",
    "value": 5
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 386,
      "eliteImgPic": 515
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 300 } },
    { research_cost: { food: 700, gold: 550 } }
  ]
};


window.DRAVIDIANS = DRAVIDIANS;
export default DRAVIDIANS;

