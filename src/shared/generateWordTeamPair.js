const { generateTeams } = require("../teams/generate");
const { generateWords } = require("../wordlist/generate");

async function generateWordTeamPair() {
  const words = await generateWords();
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
