const ITALIANS = {
  "bonuses": [
    // Advancing to the next Age costs -15%
    {
      "line": 0,
      "type": "age_advance_cost",
      "op": "multiply",
      "value": 0.85
    },
    // Foot Archers +1 melee armor
    {
      "line": 1, "type": "stat_modifier", "scope": "foot_archer", "stat": "armor_melee", "op": "add", "value": 1 },
    // Foot Archers +1 pierce armor
    {
      "line": 1, "type": "stat_modifier", "scope": "foot_archer", "stat": "armor_pierce", "op": "add", "value": 1 },
    // Condottieri +1 melee armor
    {
      "line": 1, "type": "stat_modifier", "scope": "condottiero", "stat": "armor_melee", "op": "add", "value": 1 },
    // Condottieri +1 pierce armor
    {
      "line": 1, "type": "stat_modifier", "scope": "condottiero", "stat": "armor_pierce", "op": "add", "value": 1 },
    // Dock and University technologies cost -25%
    {
      "line": 2,
      "type": "tech_cost_modifier",
      "scope": "dock_university",
      "resource": "all",
      "op": "multiply",
      "value": 0.75
    },
    // Gunpowder Units cost -20%
    {
      "line": 3,
      "type": "cost_modifier",
      "scope": "gunpowder",
      "resource": "all",
      "op": "multiply",
      "value": 0.8
    },
    // Fishing Ships cost -15%
    {
      "line": 4,
      "type": "cost_modifier",
      "scope": "fishing_ship",
      "resource": "all",
      "op": "multiply",
      "value": 0.85
    }
  ],
  // Team bonus: Condottiero available at the Barracks in Imperial Age
  "teamBonus": {
    "type": "unit_availability",
    "scope": "condottiero",
    "building": "barracks",
    "age": 3
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 133,
      "eliteImgPic": 492
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 350, gold: 250 } },
    { research_cost: { food: 700, gold: 550 } }
  ]
};


window.ITALIANS = ITALIANS;
export default ITALIANS;

