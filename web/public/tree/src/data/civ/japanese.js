const JAPANESE = {
  "bonuses": [
    // Mills, Lumber Camps, and Mining Camps cost -50%
    {
      "line": 0,
      "type": "building_cost_modifier",
      "scope": "eco_camps",
      "resource": "all",
      "op": "multiply",
      "value": 0.5
    },
    // Cavalry Archers +2 attack vs. Ranged Soldiers (except Skirmishers)
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "cavarcher",
      "stat": "attack_vs_foot_archer",
      "op": "add",
      "value": 2
    },
    // Infantry attacks +33% faster starting in Feudal Age
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "rof",
      "op": "multiply",
      "value": 0.75,
      "min_age": 1
    },
    // Fishing Ships work +5/10/15/20% faster per age; +100% HP
    {
      "line": 3,
      "type": "stat_modifier",
      "scope": "fishing_ship",
      "stat": "hp",
      "op": "multiply",
      "value": 2
    }
  ],
  // Team bonus: Galley-line +4 line of sight
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "galley",
    "stat": "los",
    "op": "add",
    "value": 4
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 44,
      "eliteImgPic": 483
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 350, gold: 250 } },
    { research_cost: { wood: 550, gold: 300 } }
  ]
};


window.JAPANESE = JAPANESE;
export default JAPANESE;

