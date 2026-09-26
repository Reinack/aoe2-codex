const BOHEMIANS = {
  "bonuses": [
    // Mining Camp technologies free
    {
      "line": 0,
      "type": "free_tech",
      "techs": ["goldmining", "goldshaft", "stonemining", "stoneshaft"]
    },
    // Spearman-line deals +25% bonus damage
    {
      "line": 2,
      "type": "stat_modifier",
      "scope": "spearman",
      "stat": "bonus_damage",
      "op": "multiply",
      "value": 1.25
    },
    // Blacksmiths cost -100 wood
    {
      "line": 1,
      "type": "building_cost_modifier",
      "scope": "blacksmith",
      "resource": "wood",
      "op": "add",
      "value": -100
    },
    // Universities cost -100 wood
    {
      "line": 1,
      "type": "building_cost_modifier",
      "scope": "university",
      "resource": "wood",
      "op": "add",
      "value": -100
    },
    // Fervor and Sanctity technologies also affect Villagers
    {
      "line": 3,
      "type": "tech_applies_to",
      "scope": "villager",
      "techs": ["fervor", "sanctity"]
    },
    // Chemistry and Hand Cannoneer available in Castle Age
    {
      "line": 4,
      "type": "age_unlock",
      "scope": "chemistry",
      "op": "add",
      "value": -1
    }
  ],
  "teamBonus": {
    "type": "building_work_speed",
    "scope": "market",
    "op": "multiply",
    "value": 1.8
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 370,
      "eliteImgPic": 514
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 350, gold: 300 } },
    { research_cost: { food: 700, gold: 600 } }
  ]
};

window.BOHEMIANS = BOHEMIANS;
export default BOHEMIANS;
