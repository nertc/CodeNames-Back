const { changeOnlineState } = require("./changeOnlineState");
const { rooms } = require("./rooms");
const { validateUserId } = require("./validate");

function leaveRoom(roomId, userId) {
  validateUserId(roomId, userId);
  const room = rooms[roomId];
  changeOnlineState(roomId, userId, false);

  if (!Object.getOwnPropertyNames(room.isOnline)) {
    delete rooms[roomId];
  }
}

module.exports = {
  leaveRoom,
};
