const MUISCA = {
  "bonuses": [
    // Advancing to the next Age costs -50% gold
    {
      "line": 0,
      "type": "age_advance_cost",
      "resource": "gold",
      "op": "multiply",
      "value": 0.5
    },
    // Settlements cost -25%
    {
      "line": 1,
      "type": "building_cost_modifier",
      "scope": "tahsili",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Settlements heal nearby units within a small radius
    {
      "line": 1,
      "type": "building_effect",
      "scope": "tahsili",
      "effect": "heal_nearby_units"
    },
    // Champi Warriors +1/2/3 melee armor in Feudal/Castle/Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "champiwarrior",
      "stat": "armor_melee",
      "op": "add",
      "value_by_age": [0, 1, 2, 3],
      "min_age": 1
    },
    // Archery Range Units +1/2/3 melee armor in Feudal/Castle/Imperial Age
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "foot_archer",
      "stat": "armor_melee",
      "op": "add",
      "value_by_age": [0, 1, 2, 3],
      "min_age": 1
    },
    // Monks regain faith +50% faster
    {
      "line": 3,
      "type": "stat_modifier",
      "scope": "monk",
      "stat": "faith",
      "op": "multiply",
      "value": 1.5
    },
    // Caravan free
    {
      "line": 4,
      "type": "free_tech",
      "techs": ["caravan"],
      "tech": "caravan"
    },
    // Guilds free
    {
      "line": 4,
      "type": "free_tech",
      "techs": ["guilds"],
      "tech": "guilds"
    }
  ],
  // Team bonus: Natural gold sources last +15% longer
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "gold_source",
    "stat": "duration",
    "op": "multiply",
    "value": 1.15
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 543,
      "eliteImgPic": 544
    },
    {
      "age": 2
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 350 } },
    { research_cost: { wood: 450, gold: 350 } }
  ]
};


window.MUISCA = MUISCA;
export default MUISCA;

