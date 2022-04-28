const fs = require("fs");

const buffer = fs.readFileSync("./wordlist.txt");
const wordlist = Object.freeze(buffer.toString().split(/\r?\n/));

module.exports = {
  wordlist,
};
