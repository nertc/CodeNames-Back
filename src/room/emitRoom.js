const { roomUpdate$ } = require("./rooms");

function emitRoom(roomId) {
  roomUpdate$.emit(roomId);
}

module.exports = {
  emitRoom,
};
