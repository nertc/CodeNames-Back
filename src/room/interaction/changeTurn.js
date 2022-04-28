const { rooms } = require("../rooms");
const { validateRoomId } = require("../validate");

function changeTurn(roomId) {
  validateRoomId(roomId);

  const room = rooms[roomId];
  room.activePlayer++;
  room.activePlayer %= 2;
}

module.exports = {
  changeTurn,
};
