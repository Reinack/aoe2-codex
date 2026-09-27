const VIETNAMESE = {
  "bonuses": [
    // Enemy Town Centers are revealed on the map at the start of the game
    {
      "type": "map_reveal",
      "scope": "enemy_tc"
    },
    // Economic upgrades cost no wood and research +100% faster
    {
      "type": "building_work_speed",
      "scope": "tech_research",
      "op": "multiply",
      "value": 2
    },
    // Foot Archers and Skirmishers +20% HP (parche 185872: antes "Archery Range units and Fire Lancers")
    {
      "type": "stat_modifier",
      "scope": "foot_archer",
      "stat": "hp",
      "op": "multiply",
      "value": 1.2
    },
    // Conscription free
    {
      "type": "free_tech",
      "techs": ["conscription"]
    }
  ],
  // Team bonus: Imperial Skirmisher upgrade available in Imperial Age
  "teamBonus": {
    "type": "unit_availability",
    "scope": "imp_skirmisher",
    "age": 3
  },
  "uniqueUnits": [
    {
      "age": 2,
      "imgPic": 232,
      "eliteImgPic": 505
    }
  ],
  "uniqueTechs": [
    { research_cost: { food: 300, gold: 350 } },
    { research_cost: { food: 750, gold: 600 } }
  ]
};


window.VIETNAMESE = VIETNAMESE;
export default VIETNAMESE;

