const BULGARIANS = {
  "bonuses": [
    // Militia-line upgrades free
    {
      "line": 0,
      "type": "free_tech",
      "techs": ["manatarms", "longsword", "twohanded", "champion"]
    },
    // Blacksmith technologies cost -50% food
    {
      "line": 1,
      "type": "tech_cost_modifier",
      "scope": "blacksmith",
      "resource": "food",
      "op": "multiply",
      "value": 0.5
    },
    // Siege Workshop technologies cost -50% food
    {
      "line": 1,
      "type": "tech_cost_modifier",
      "scope": "siege_workshop",
      "resource": "food",
      "op": "multiply",
      "value": 0.5
    },
    // Town Centers cost -50% stone
    {
      "line": 2,
      "type": "building_cost_modifier",
      "scope": "tc",
      "resource": "stone",
      "op": "multiply",
      "value": 0.5
    },
    // Can build Krepost in Castle Age (minor castle that trains Konniks)
    {
      "line": 3,
      "type": "building_unlock",
      "scope": "krepost",
      "age": 2
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "blacksmith",
    "op": "multiply",
    "value": 1.8
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 249,
      "eliteImgPic": 506,
      "cost": { "food": 60, "gold": 70 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 200, gold: 200 } },
    { research_cost: { food: 550, gold: 450 } }
  ]
};


window.BULGARIANS = BULGARIANS;
export default BULGARIANS;

