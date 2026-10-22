const PERSIANS = {
  "bonuses": [
    // Start with +50 wood
    {
      "line": 0,
      "type": "start_resources",
      "resource": "wood",
      "op": "add",
      "value": 50
    },
    // Start with +50 food
    {
      "line": 0,
      "type": "start_resources",
      "resource": "food",
      "op": "add",
      "value": 50
    },
    // Town Centers and Docks +100% HP and work +5/10/15/20% faster per age
    {
      "line": 1,
      "type": "stat_modifier",
      "scope": "tc_dock",
      "stat": "hp",
      "op": "multiply",
      "value": 2
    },
    // TC works +5/10/15/20% faster ? Villagers train faster
    {
      "line": 1,
      "type": "building_work_speed",
      "scope": "tc",
      "op": "multiply",
      "value_by_age": [1.05, 1.10, 1.15, 1.20]
    },
    // Dock works +5/10/15/20% faster ? Ships train faster
    {
      "line": 1,
      "type": "building_work_speed",
      "scope": "dock",
      "op": "multiply",
      "value_by_age": [1.05, 1.10, 1.15, 1.20]
    },
    // Parthian Tactics available in Castle Age
    {
      "line": 2,
      "type": "age_unlock",
      "scope": "parthian",
      "op": "add",
      "value": -1
    },
    // Can build Caravanserai in Imperial Age (heals and speeds up trade carts)
    {
      "line": 3,
      "type": "building_unlock",
      "scope": "caravanserai",
      "age": 3
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "knight",
    "stat": "attack_vs_archers",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 43,
      "eliteImgPic": 481,
      "cost": { "food": 170, "gold": 85 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 350, gold: 300 } },
    { research_cost: { wood: 600, gold: 300 } }
  ]
};


window.PERSIANS = PERSIANS;
export default PERSIANS;

