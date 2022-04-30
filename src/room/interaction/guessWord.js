const { TEAMS } = require("../../teams/teams");
const { emitRoom } = require("../emitRoom");
const { rooms } = require("../rooms");
const { validateWord } = require("../validate");
const { changeTurn } = require("./changeTurn");
const { checkGameOver } = require("./checkGameOver");
const { showEnemy } = require("./showEnemy");

function guessWord(roomId, userId, wordIndex) {
  validateWord(roomId, userId, wordIndex);

  const room = rooms[roomId];
  room.words[wordIndex].active = true;
  room.guessLeft--;

  if (
    checkGameOver(roomId) ||
    (room.words[wordIndex].team === TEAMS.TEAMMATE && room.guessLeft > 0)
  ) {
    emitRoom(roomId);
    return {
      team: room.words[wordIndex].team,
      isActivePlayer: true,
    };
  }

  const enemyIndex = showEnemy(roomId);

  checkGameOver(roomId);
  changeTurn(roomId);
  emitRoom(roomId);
  return {
    team: room.words[wordIndex].team,
    isActivePlayer: false,
    enemyIndex,
  };
}

module.exports = {
  guessWord,
};
