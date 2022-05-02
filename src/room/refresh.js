const { ForbiddenError } = require("../errors/forbiddenError");
const { generateWordTeamPair } = require("../shared/generateWordTeamPair");
const { emitRoom } = require("./emitRoom");
const { rooms } = require("./rooms");
const { validateUserId } = require("./validate");

async function refreshRoom(roomId, userId) {
  validateUserId(roomId, userId);
  const room = rooms[roomId];
  if (room.refreshing) {
    throw new ForbiddenError("Room is already refreshing");
  }
  room.refreshing = true;
  const guide = (room.guide + 1) % 2;
  const words = await generateWordTeamPair();
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
