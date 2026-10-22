const FRANKS = {
  "bonuses": [
    // Foragers work +15% faster
    {
      "type": "building_work_speed",
      "scope": "forager",
      "op": "multiply",
      "value": 1.15
    },
    // Mill technologies free (Horse Collar, Heavy Plow, Crop Rotation)
    {
      "type": "free_tech",
      "techs": ["horsecollar", "heavyplow", "croprotation"]
    },
    // Mounted Units +20% HP starting in Feudal Age
    {
      "type": "stat_modifier",
      "scope": "cavalry",
      "stat": "hp",
      "op": "multiply",
      "value": 1.2,
      "min_age": 1
    },
    // Castles cost -15/25% in Castle/Imperial Age
    {
      "type": "building_cost_modifier",
      "scope": "castle",
      "resource": "all",
      "op": "multiply",
      "value_by_age": [1.0, 1.0, 0.85, 0.75],
      "min_age": 2
    },
  ],
  // Team bonus: Knight-line +2 line of sight
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "knight",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 46,
      "eliteImgPic": 473
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 250 } },  // Ordonnance Companies (reemplaza a Bearded Axe, parche 185872)
    { research_cost: { wood: 600, gold: 500 } }   // Chivalry
  ]
};


window.FRANKS = FRANKS;
export default FRANKS;

