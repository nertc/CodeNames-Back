const { TEAMS_ARRANGEMENT } = require("./teams");

const teamsArrangement = Object.getOwnPropertyNames(TEAMS_ARRANGEMENT).map(
  (team) => ({
    team,
    count: TEAMS_ARRANGEMENT[team],
  })
);

function generateTeams() {
  const numberOfTeams = teamsArrangement.map((team) => ({ ...team }));
  const teams = [];

  while (numberOfTeams.length) {
    const index = Math.floor(Math.random() * numberOfTeams.length);
    teams.push(numberOfTeams[index].team);
    numberOfTeams[index].count--;

    if (numberOfTeams[index].count <= 0) {
      numberOfTeams[index] = numberOfTeams[numberOfTeams.length - 1];
      numberOfTeams.pop();
    }
  }

  return teams;
}

module.exports = {
  generateTeams,
};
