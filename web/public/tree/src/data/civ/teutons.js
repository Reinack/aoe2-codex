const TEUTONS = {
  "bonuses": [
    // Farms cost -40%
    {
      "type": "building_cost_modifier",
      "scope": "farm",
      "resource": "all",
      "op": "multiply",
      "value": 0.6
    },
    // Town Centers +10 garrison capacity; Towers +5 garrison capacity
    {
      "type": "stat_modifier",
      "scope": "tc_tower",
      "stat": "garrison",
      "op": "add",
      "value": 10
    },
    // Infantry and Mounted Units +1/+2 melee armor in Castle/Imperial Age
    // (parche 185872: antes "Barracks and Stable units"; ahora incluye arqueros montados)
    {
      "type": "stat_modifier",
      "scope": "infantry_mounted",
      "stat": "armor_melee",
      "op": "add",
      "value_by_age": [0, 0, 1, 2],
      "min_age": 2
    },
    // Monks +100% healing range (double the normal range)
    {
      "type": "stat_modifier",
      "scope": "monk",
      "stat": "heal_range",
      "op": "multiply",
      "value": 2
    },
    // Murder Holes and Herbal Medicine free
    {
      "type": "free_tech",
      "techs": ["murderhole", "herbalmedicine"]
    }
  ],
  // Team bonus: Units are more resistant to conversion
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "unit",
    "stat": "conversion_resistance",
    "op": "multiply",
    "value": 1.5
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 45,
      "eliteImgPic": 477
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 300 } },
    { research_cost: { food: 600, stone: 400 } }
  ]
};


window.TEUTONS = TEUTONS;
export default TEUTONS;

