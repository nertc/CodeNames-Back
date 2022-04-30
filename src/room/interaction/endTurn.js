const { emitRoom } = require("../emitRoom");
const { validateTurn } = require("../validate");
const { changeTurn } = require("./changeTurn");
const { checkGameOver } = require("./checkGameOver");
const { showEnemy } = require("./showEnemy");

function endTurn(roomId, userId) {
  validateTurn(roomId, userId, false);

  const enemyIndex = showEnemy(roomId);
  checkGameOver(roomId);
  changeTurn(roomId);
  emitRoom(roomId);

  return {
    enemyIndex,
  };
}

module.exports = {
  endTurn,
};
