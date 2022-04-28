const { rooms } = require("./rooms");
const { validateUserId } = require("./validate");

function getRoomInfo(roomId, userId) {
  validateUserId(roomId, userId);

  const room = rooms[roomId];
  const guide = room.players[room.guide] === userId;
  return {
    guide,
    words: room.words.map((word) => {
      if (guide || word.active) {
        return word;
      } else {
        return {
          word: word.word,
          active: word.active,
        };
      }
    }),
    currentKey: room.currentKey,
    isActivePlayer: room.players[room.activePlayer] === userId,
    gameOver: room.gameOver,
    win: room.win,
  };
}

module.exports = {
  getRoomInfo,
};
