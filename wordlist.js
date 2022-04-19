const fs = require("fs");

const buffer = fs.readFileSync("wordlist.txt");
const words = buffer.toString().split(/\r?\n/);

function getWords(numOfWords) {
  const generatedWords = [];
  const usedWords = {};
  while (generatedWords.length < numOfWords) {
    const wordId = Math.floor(Math.random() * words.length);
    const word = words[wordId];
    if (!usedWords[word]) {
      usedWords[word] = true;
      generatedWords.push(word);
    }
  }

  return generatedWords;
}

module.exports = {
  getWords,
};
