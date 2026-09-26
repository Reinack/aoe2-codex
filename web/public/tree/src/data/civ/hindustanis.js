const HINDUSTANIS = {
  "bonuses": [
    // Villagers cost -8/13/18/23% in Dark/Feudal/Castle/Imperial Age
    {
      "type": "cost_modifier",
      "scope": "villager",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [0.92, 0.87, 0.82, 0.77]
    },
    // Camel Riders attack +20% faster
    {
      "type": "stat_modifier",
      "scope": "camel",
      "stat": "rof",
      "op": "multiply",
      "value": 0.8
    },
    // Gunpowder Units +1 melee armor and +1 pierce armor
    {
      "type": "stat_modifier",
      "scope": "gunpowder",
      "stat": "armor_melee_and_pierce",
      "op": "add",
      "value_melee": 1,
      "value_pierce": 1
    },
    // Can build Caravanserai in Imperial Age (heals and speeds up trade carts)
    {
      "type": "building_unlock",
      "scope": "caravanserai",
      "age": 3
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "scout_camel",
    "stat": "attack_vs_buildings",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 385,
      "eliteImgPic": 518
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 200 } },
    { research_cost: { food: 600, gold: 500 } }
  ]
};


window.HINDUSTANIS = HINDUSTANIS;
export default HINDUSTANIS;

