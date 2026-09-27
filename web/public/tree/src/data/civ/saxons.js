const SAXONS = {
  "bonuses": [
    // Mills, Lumber Camps and Mining Camps provide +35 food and +10 stone when built
    {
      "type": "building_effect",
      "scope": "mill",
      "effect": "resources_on_build",
      "value": { "food": 35, "stone": 10 }
    },
    // Foot soldiers cost -5% per Town Center or Castle controlled (max -20%); starting TC = -5%
    {
      "type": "cost_modifier",
      "scope": "infantry",
      "resource": "all",
      "op": "multiply",
      "value": 0.95
    },
    // Towers and Castles fire +100% base arrows starting in Castle Age
    {
      "type": "stat_modifier",
      "scope": "tower_castle",
      "stat": "base_arrows",
      "op": "multiply",
      "value": 2,
      "min_age": 2
    },
    // Longships and Catapult Galleons +20% HP
    {
      "type": "stat_modifier",
      "scope": "longship_catapult_galleon",
      "stat": "hp",
      "op": "multiply",
      "value": 1.2
    }
  ],
  // Team bonus: Repairers work +25% faster
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "villager",
    "stat": "repair_speed",
    "op": "multiply",
    "value": 1.25
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 904,
      "eliteImgPic": 905,
      "cost": { "wood": 80, "gold": 35 },
      "elite_cost": { "wood": 750, "gold": 700 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 350, gold: 200 } },  // Clerical Recruitment
    { research_cost: { food: 525, gold: 475 } }   // Shield Wall
  ]
};


window.SAXONS = SAXONS;
export default SAXONS;
