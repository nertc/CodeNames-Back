const { TEAMS_ARRANGEMENT } = require("./teams");

const teamsArrangement = Object.getOwnPropertyNames(TEAMS_ARRANGEMENT)
  .map((team) => new Array(TEAMS_ARRANGEMENT[team]).fill(team))
  .flat();

function generateTeams() {
  const positions = [...new Array(teamsArrangement.length).keys()];
  const teams = [...teamsArrangement];
  const result = new Array(teamsArrangement.length);

  while (teams.length) {
    const teamIndex = Math.floor(Math.random() * teams.length);
    const positionIndex = Math.floor(Math.random() * positions.length);

    const randomTeam = teams[teamIndex];
    const randomPosition = positions[positionIndex];

    result[randomPosition] = randomTeam;

    teams[teamIndex] = teams[teams.length - 1];
    teams.pop();

    positions[positionIndex] = positions[positions.length - 1];
    positions.pop();
  }

  return result;
}

module.exports = {
  generateTeams,
};
