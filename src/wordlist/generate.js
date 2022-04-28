const { wordlist } = require("./wordlist");
const { WORDS } = require("./words");

function generateWords() {
  const generatedWords = [];
  const usedWords = {};
  while (generatedWords.length < WORDS) {
    const wordId = Math.floor(Math.random() * wordlist.length);
    const word = wordlist[wordId];
    if (!usedWords[word]) {
      usedWords[word] = true;
      generatedWords.push(word);
    }
  }

  return generatedWords;
}

module.exports = {
  generateWords,
};
