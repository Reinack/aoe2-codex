const ARMENIANS = {
  "bonuses": [
    // Mule Carts cost -25%
    {
      "type": "building_cost_modifier",
      "scope": "mulecart",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Mule Cart technologies are +40% more effective
    {
      "type": "tech_effectiveness",
      "scope": "mule_cart_tech",
      "op": "multiply",
      "value": 1.4
    },
    // Spearman- and Militia-line upgrades (except Man-at-Arms) available one age earlier
    {
      "type": "age_unlock",
      "scope": "spearman_militia_upgrades",
      "op": "add",
      "value": -1
    },
    // First Fortified Church receives a free Relic
    {
      "type": "free_tech",
      "techs": ["fortified_church"]
    },
    // Galley-line and Dromons fire an additional projectile
    {
      "type": "stat_modifier",
      "scope": "galley_dromon",
      "stat": "projectile_count",
      "op": "add",
      "value": 1
    }
  ],
  // Team bonus: Infantry +2 line of sight
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "infantry",
    "stat": "los",
    "op": "add",
    "value": 2
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 407,
      "eliteImgPic": 522
    },
    {
      "age": 2
    }
  ],
  "uniqueTechs": [
    { research_cost: { wood: 350, gold: 250 } },
    { research_cost: { food: 800, gold: 600 } }
  ]
};

window.ARMENIANS = ARMENIANS;
export default ARMENIANS;
