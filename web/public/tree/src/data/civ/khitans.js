const KHITANS = {
  "bonuses": [
    // Pastures replace Farms as the food-gathering building
    {
      "type": "building_replacement",
      "scope": "pasture",
      "replaces": "farm"
    },
    // Melee attack upgrade effects are doubled
    {
      "type": "tech_effectiveness",
      "scope": "melee_attack_upgrades",
      "op": "multiply",
      "value": 2
    },
    // Skirmishers, Spearman-, and Scout Cavalry-line train and upgrade +15% faster
    {
      "type": "creation_speed",
      "scope": "skirm_spear_scout",
      "op": "multiply",
      "value": 0.85
    },
    // Heavy Cavalry Archer upgrade available in Castle Age and costs -50%
    {
      "type": "tech_cost_modifier",
      "scope": "hcavarcher_upgrade",
      "techs": ["hcavarcher"],
      "resource": "all",
      "op": "multiply",
      "value": 0.5
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "infantry",
    "stat": "attack_vs_foot_archer",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 463,
      "eliteImgPic": 525,
      "cost": { "food": 40, "gold": 40 },
      "elite_cost": { "food": 800, "gold": 650 }
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 350 } },
    { research_cost: { food: 800, gold: 700 } }
  ]
};


window.KHITANS = KHITANS;
export default KHITANS;

