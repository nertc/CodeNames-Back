const { v4: uuidv4 } = require("uuid");
const { changeUserState } = require("./changeState");
const { isUserOnline } = require("./users");

function generateUserId() {
  let id = "";
  do {
    id = uuidv4();
  } while (isUserOnline[id]);
  changeUserState(id, true);
  return id;
}

module.exports = {
  generateUserId,
};
