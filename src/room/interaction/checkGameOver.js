const { TEAMS } = require("../../teams/teams");
const { rooms } = require("../rooms");
const { validateRoomId } = require("../validate");

function checkGameOver(roomId) {
  validateRoomId(roomId);

  const room = rooms[roomId];
  if (
    room.words.every((word) => word.team !== TEAMS.ENEMY || word.active) ||
    room.words.some((word) => word.team === TEAMS.BOMB && word.active)
  ) {
    room.gameOver = true;
    return true;
  }
  if (room.words.every((word) => word.team !== TEAMS.TEAMMATE || word.active)) {
    room.win = true;
    room.gameOver = true;
    return true;
  }
  return false;
}

module.exports = {
  checkGameOver,
};
