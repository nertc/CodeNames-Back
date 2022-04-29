const { TEAMS } = require("../../teams/teams");
const { emitRoom } = require("../emitRoom");
const { rooms } = require("../rooms");
const { validateWord } = require("../validate");
const { changeTurn } = require("./changeTurn");
const { checkGameOver } = require("./checkGameOver");

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

  const enemies = room.words
    .map((word, index) => ({
      ...word,
      index,
    }))
    .filter((word) => !word.active && word.team === TEAMS.ENEMY);
  const enemy = Math.floor(Math.random() * enemies.length);
  const enemyIndex = enemies[enemy].index;
  room.words[enemyIndex].active = true;

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
