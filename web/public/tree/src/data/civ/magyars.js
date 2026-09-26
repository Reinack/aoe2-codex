const MAGYARS = {
  "bonuses": [
    // Villagers defeat wolves with one strike (effectively instant kill)
    {
      "type": "stat_modifier",
      "scope": "villager",
      "stat": "damage_vs_wolf",
      "op": "multiply",
      "value": 999
    },
    // Scout Cavalry-line costs -15%
    {
      "type": "cost_modifier",
      "scope": "light_cavalry",
      "resource": "all",
      "op": "multiply",
      "value": 0.85
    },
    // Melee attack upgrades (Forging, Iron Casting, Blast Furnace) free
    {
      "type": "free_tech",
      "techs": ["forging", "ironcasting", "blastfurnace"]
    }
  ],
  "teamBonus": {
    "type": "creation_speed",
    "scope": "cavalry_archer",
    "op": "multiply",
    "value": 0.75
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 99,
      "eliteImgPic": 493,
      "cost": { "food": 35, "gold": 45 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 300 } },
    { research_cost: { food: 750, gold: 600 } }
  ]
};


window.MAGYARS = MAGYARS;
export default MAGYARS;

