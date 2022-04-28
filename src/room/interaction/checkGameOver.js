const { rooms } = require("../rooms");
const { validateRoomId } = require("../validate");

function checkGameOver(roomId) {
  validateRoomId(roomId);

  const room = rooms[roomId];
  if (
    room.words.every((word) => word.team !== "enemy" || word.active) ||
    room.words.some((word) => word.team === "bomb" && word.active)
  ) {
    room.gameOver = true;
    return true;
  }
  if (room.words.every((word) => word.team !== "teammate" || word.active)) {
    room.win = true;
    room.gameOver = true;
    return true;
  }
  return false;
}

module.exports = {
  checkGameOver,
};
