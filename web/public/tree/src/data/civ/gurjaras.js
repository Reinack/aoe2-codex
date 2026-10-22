const GURJARAS = {
  "bonuses": [
    // Start with 2 Forage Bushes near the Town Center
    {
      "type": "start_resources",
      "resource": "forage_bush",
      "op": "add",
      "value": 2
    },
    // Can garrison livestock in Mills to passively generate food
    {
      "type": "garrison_in_building",
      "scope": "livestock",
      "building": "mill"
    },
    // Mounted Units deal +20/30/40% bonus damage in Feudal/Castle/Imperial Age
    {
      "type": "stat_modifier",
      "scope": "cavalry",
      "stat": "bonus_damage",
      "op": "multiply",
      "value_by_age": [1.0, 1.20, 1.30, 1.40],
      "min_age": 1
    }
    // (Parche 185872: se eliminó el bonus "Docks +5 garrison capacity")
  ],
  "teamBonus": {
    "type": "creation_speed",
    "scope": "camel_elephant",
    "op": "multiply",
    "value": 0.75
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 390,
      "eliteImgPic": 517
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 350 } },
    { research_cost: { food: 650, gold: 600 } }
  ]
};


window.GURJARAS = GURJARAS;
export default GURJARAS;

