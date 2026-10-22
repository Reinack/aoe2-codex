const VARANGIANS = {
  "bonuses": [
    // Shepherding, fishing and hunting also generate gold
    {
      "type": "gather_bonus",
      "scope": "villager",
      "effect": "food_also_generates_gold"
    },
    // Bloodlines and Caravan effects +50%
    {
      "type": "tech_effectiveness",
      "scope": "bloodlines_caravan",
      "techs": ["bloodlines", "caravan"],
      "value": 1.5
    },
    // Varangian Guards attack +25% faster (rof ÷ 1.25) and generate +50% gold
    {
      "type": "stat_modifier",
      "scope": "varangian_guard",
      "stat": "rof",
      "op": "multiply",
      "value": 0.8
    },
    // Longships and Catapult Galleons attack +15% faster (rof ÷ 1.15)
    {
      "type": "stat_modifier",
      "scope": "longship_catapult_galleon",
      "stat": "rof",
      "op": "multiply",
      "value": 0.87
    }
  ],
  // Team bonus: Knight-line +1 attack vs. infantry
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "knight",
    "stat": "bonus_vs_infantry",
    "op": "add",
    "value": 1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 906,
      "eliteImgPic": 907,
      "cost": { "food": 75, "gold": 55 },
      "elite_cost": { "food": 825, "gold": 725 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 500, gold: 300 } },  // Vendel Legacy
    { research_cost: { food: 475, gold: 400 } }   // Gothikon
  ]
};


window.VARANGIANS = VARANGIANS;
export default VARANGIANS;
