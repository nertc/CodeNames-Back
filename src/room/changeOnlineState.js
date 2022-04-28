const { rooms } = require("./rooms");
const { validateRoomId } = require("./validate");

function changeOnlineState(roomId, userId, state) {
  validateRoomId(roomId);
  if (state) {
    rooms[roomId].isOnline[userId] = true;
  } else {
    delete rooms[roomId].isOnline[userId];
  }
}

module.exports = {
  changeOnlineState,
};
