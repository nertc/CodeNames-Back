const axios = require("axios");
const { WORDS } = require("./words");

function generateWords() {
  return axios
    .post("https://geonouns.herokuapp.com/random", {
      count: WORDS,
    })
    .then(({ data }) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

module.exports = {
  generateWords,
};
