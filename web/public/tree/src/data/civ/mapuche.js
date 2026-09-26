const MAPUCHE = {
  "bonuses": [
    {
      "line": 0,
      "type": "stat_modifier",
      "scope": "villager",
      "stat": "food",
      "op": "multiply",
      "value": 1.2
    },   // Los recolectores entregan +20% más de comida
    // Settlements (Tahsili) can train Spearman-line and Skirmishers
    {
      "line": 1,
      "type": "unit_availability",
      "scope": "spearman_skirmisher",
      "building": "tahsili"
    },
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "hp",
      "op": "add",
      "value_by_age": [0, 5, 10, 15],
      "min_age": 1
    },
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "skirmisher",
      "stat": "hp",
      "op": "add",
      "value_by_age": [0, 5, 10, 15],
      "min_age": 1
    },
    // Mounted Units generate +3 gold when defeating enemy military units
    {
      "line": 3,
      "type": "stat_modifier",
      "scope": "mounted",
      "stat": "gold_on_kill",
      "op": "add",
      "value": 3
    },
    // Enemy Castles are revealed on the map at all times
    {
      "line": 4,
      "type": "map_reveal",
      "scope": "enemy_castle"
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "spear_skirm",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 545,
      "eliteImgPic": 546,
      "cost": { "food": 65, "gold": 40 }
    },
    {
      "age": 2
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 350 } },
    { research_cost: { food: 500, gold: 450 } }
  ]
};


window.MAPUCHE = MAPUCHE;
export default MAPUCHE;


