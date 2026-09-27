const MALIANS = {
  "bonuses": [
    // Buildings cost -15% wood
    {
      "type": "building_cost_modifier",
      "scope": "building",
      "resource": "wood",
      "op": "multiply",
      "value": 0.85
    },
    // Villagers drop off +10% more gold (gold miners work +10% more efficiently)
    {
      "type": "stat_modifier",
      "scope": "gold_miner",
      "stat": "drop_rate",
      "op": "multiply",
      "value": 1.1
    },
    // Barracks Units +1/+2/+3 pierce armor in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "infantry",
      "stat": "armor_pierce",
      "op": "add",
      "value_by_age": [0, 1, 2, 3],
      "min_age": 1
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "university",
    "op": "multiply",
    "value": 1.8
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 197,
      "eliteImgPic": 500
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 200 } },
    { research_cost: { food: 600, gold: 500 } }
  ]
};


window.MALIANS = MALIANS;
export default MALIANS;

