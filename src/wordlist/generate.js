const axios = require("axios");
const { WORDS } = require("./words");

function generateWords() {
  return axios
    .post("https://geonouns.herokuapp.com/random", {
      count: WORDS,
    })
    .then(({ data }) => data);
}

module.exports = {
  generateWords,
};
