const WU = {
  "bonuses": [
    // Military production buildings and Docks provide +55 food at game start
    {
      "line": 0,
      "type": "stat_modifier",
      "scope": "military_building_dock",
      "stat": "food_storage",
      "op": "add",
      "value": 55
    },
    // Infantry regenerates 10/15/30 HP per minute in Feudal/Castle/Imperial Age
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "regen",
      "op": "add",
      "value_by_age": [0, 10, 15, 30],
      "min_age": 1
    },
    // Hei Guang Cavalry +2 attack in Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "hei_guang",
      "stat": "attack",
      "op": "add",
      "value": 2,
      "min_age": 3
    },
    // Jian Swordsmen +2 attack in Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "jian_swordsman",
      "stat": "attack",
      "op": "add",
      "value": 2,
      "min_age": 3
    },
    // Careening and Dry Dock free
    {
      "line": 3,
      "type": "free_tech",
      "techs": ["careening", "drydock"]
    }
  ],
  // Team bonus: Houses built +100% faster
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "house",
    "op": "multiply",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 436,
      "eliteImgPic": 528,
      "cost": { "wood": 45, "gold": 45 },
      "elite_cost": { "food": 800, "gold": 800 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 250 } },
    { research_cost: { food: 800, gold: 700 } }
  ]
};


window.WU = WU;
export default WU;

