var {v4: uuidv4} = require("uuid");

const idLastJoin = {};

function generateUserId() {
  let id = "";
  do {
    id = uuidv4();
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
