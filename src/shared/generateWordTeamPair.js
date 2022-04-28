const { generateTeams } = require("../teams/generate");
const { generateWords } = require("../wordlist/generate");

function generateWordTeamPair() {
  const words = generateWords();
  const teams = generateTeams();
  return words.map((word, i) => ({
    word,
    team: teams[i],
    active: false,
  }));
}

module.exports = {
  generateWordTeamPair,
};
