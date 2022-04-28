const { isUserOnline } = require("./users");

function changeUserState(userId, state) {
  if (state) {
    isUserOnline[userId] = true;
  } else {
    delete isUserOnline[userId];
  }
}

module.exports = {
  changeUserState,
};
