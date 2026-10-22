const DANES = {
  "bonuses": [
    // Fishing Ships and Villagers drop off +5% food
    {
      "type": "gather_bonus",
      "scope": "villager",
      "resource": "food",
      "op": "multiply",
      "value": 1.05
    },
    // Loot 25% of the resource cost of each destroyed building (except walls and gates)
    {
      "type": "building_effect",
      "scope": "unit",
      "effect": "loot_destroyed_buildings",
      "value": 0.25
    },
    // Barracks and Siege Workshop upgrades cost -66% gold
    {
      "type": "tech_cost_modifier",
      "scope": "barracks_siege",
      "resource": "gold",
      "op": "multiply",
      "value": 0.34
    },
    // Varangian Guards and Longships move +10% faster
    {
      "type": "stat_modifier",
      "scope": "varangian_longship",
      "stat": "speed",
      "op": "multiply",
      "value": 1.1
    }
  ],
  // Team bonus: Land siege units (except Grenadiers) +2 line of sight
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "siege",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 908,
      "eliteImgPic": 909,
      "cost": { "food": 65, "gold": 15 },
      "elite_cost": { "food": 825, "gold": 825 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 250, gold: 450 } },  // Hamask
    { research_cost: { wood: 950, gold: 900 } }   // Northmen's Fury
  ]
};


window.DANES = DANES;
export default DANES;
