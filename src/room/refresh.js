const { generateWordTeamPair } = require("../shared/generateWordTeamPair");
const { emitRoom } = require("./emitRoom");
const { rooms } = require("./rooms");
const { validateUserId } = require("./validate");

function refreshRoom(roomId, userId) {
  validateUserId(roomId, userId);
  const room = rooms[roomId];
  const guide = (room.guide + 1) % 2;
  const words = generateWordTeamPair();
  const { players, isOnline } = room;
  const newRoom = {
    players,
    guide,
    words,
    currentKey: {},
    activePlayer: guide,
    isOnline,
    guessLeft: 0,
    gameOver: false,
    win: false,
  };
  rooms[roomId] = newRoom;
  emitRoom(roomId);
  return newRoom;
}

module.exports = {
  refreshRoom,
};
