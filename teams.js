function getTeams(originalNumberOfTeams) {
  const numberOfTeams = originalNumberOfTeams.map((team) => ({ ...team }));
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
  getTeams,
};
