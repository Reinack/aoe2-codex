const KHMER = {
  "bonuses": [
    // No buildings required to advance to the next Age or unlock other buildings
    {
      "type": "age_advance_no_prereq"
    },
    // Farmers don't require Mills or Town Centers to drop off food
    {
      "type": "stat_modifier",
      "scope": "farmer",
      "stat": "dropoff_requirement",
      "op": "remove"
    },
    // Villagers can garrison in Houses for protection
    {
      "type": "garrison_in_building",
      "scope": "villager",
      "building": "house"
    },
    // Battle Elephants move +10% faster
    {
      "type": "stat_modifier",
      "scope": "battleeleph",
      "stat": "speed",
      "op": "multiply",
      "value": 1.1
    }
  ],
  "teamBonus": {
    "type": "stat_modifier",
    "scope": "scorpion",
    "stat": "range",
    "op": "add",
    "value": 1
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 231,
      "eliteImgPic": 502
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 250 } },
    { research_cost: { food: 750, gold: 600 } }
  ]
};


window.KHMER = KHMER;
export default KHMER;

