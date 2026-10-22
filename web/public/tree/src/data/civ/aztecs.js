const AZTECS = {
  "bonuses": [
    // Start with +50 gold
    {
      "type": "start_resources",
      "resource": "gold",
      "op": "add",
      "value": 50
    },
    // Villagers carry +3 resources
    {
      "type": "stat_modifier",
      "scope": "villager",
      "stat": "carry",
      "op": "add",
      "value": 3
    },
    // Military Units train +15% faster
    {
      "type": "creation_speed",
      "scope": "military_unit",
      "op": "multiply",
      "value": 0.85
    },
    // Monks gain +5 HP for each researched Monastery technology
    {
      "type": "stat_modifier",
      "scope": "monk",
      "stat": "hp",
      "op": "add",
      "value": 5
    }
  ],
  // Team bonus: Relics generate +33% gold
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "relic",
    "stat": "gold_generation",
    "op": "multiply",
    "value": 1.33
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 110,
      "eliteImgPic": 486
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 400, gold: 350 } },
    { research_cost: { food: 450, gold: 750 } }
  ]
};


window.AZTECS = AZTECS;
export default AZTECS;

