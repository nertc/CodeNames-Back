const { changeOnlineState } = require("./changeOnlineState");
const { rooms } = require("./rooms");
const { validateRoomId } = require("./validate");

function leaveRoom(roomId, userId) {
  validateRoomId(roomId);
  const room = rooms[roomId];
  changeOnlineState(roomId, userId, false);

  if (!Object.getOwnPropertyNames(room.isOnline).length) {
    delete rooms[roomId];
  }
}

module.exports = {
  leaveRoom,
};
