var crypto = require("crypto");

const idLastJoin = {};

function generateUserId() {
  let id = "";
  do {
    id = crypto.randomUUID();
  } while (
    idLastJoin[id] &&
    new Date(idLastJoin[id].getDate() + 2) >= Date.now()
  );
  idLastJoin[id] = new Date();
  return id;
}

module.exports = {
  generateUserId,
};
