const TEAMS = Object.freeze({
  ENEMY: "enemy",
  TEAMMATE: "teammate",
  NEUTRAL: "neutral",
  BOMB: "bomb",
});

const TEAMS_ARRANGEMENT = Object.freeze({
  [TEAMS.ENEMY]: 7,
  [TEAMS.TEAMMATE]: 8,
  [TEAMS.NEUTRAL]: 4,
  [TEAMS.BOMB]: 1,
});

module.exports = {
  TEAMS,
  TEAMS_ARRANGEMENT,
};
