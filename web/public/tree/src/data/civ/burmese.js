const BURMESE = {
  "bonuses": [
    // Lumber Camp technologies free
    {
      "line": 0,
      "type": "tech_cost_modifier",
      "scope": "lumber",
      "resource": "all",
      "op": "multiply",
      "value": 0
    },
    // Infantry +1/+2/+3 attack in Feudal/Castle/Imperial Age
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "attack",
      "op": "add",
      "value_by_age": [0, 1, 2, 3],
      "min_age": 1
    },
    // Battle Elephants +1 melee armor and +1 pierce armor
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "battle_elephant",
      "stat": "armor_melee",
      "op": "add",
      "value": 1
    },
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "battle_elephant",
      "stat": "armor_pierce",
      "op": "add",
      "value": 1
    },
    // Monastery technologies cost -50%
    {
      "line": 3,
      "type": "tech_cost_modifier",
      "scope": "monastery",
      "resource": "all",
      "op": "multiply",
      "value": 0.5
    }
  ],
  // Team bonus: Relics visible on the map at the start of the game
  "teamBonus": {
    "type": "map_reveal",
    "scope": "relic"
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 230,
      "eliteImgPic": 504
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 350 } },
    { research_cost: { food: 600, gold: 500 } }
  ]
};


window.BURMESE = BURMESE;
export default BURMESE;

