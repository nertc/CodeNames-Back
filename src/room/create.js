const { generateWordTeamPair } = require("../shared/generateWordTeamPair");
const { rooms } = require("./rooms");

function createRoom(roomId) {
  const guide = Math.floor(Math.random() * 2);
  const words = generateWordTeamPair();
  const room = {
    players: [],
    guide,
    words,
    currentKey: {},
    activePlayer: guide,
    isOnline: {},
    guessLeft: 0,
    gameOver: false,
    win: false,
  };
  rooms[roomId] = room;
  return room;
}

module.exports = {
  createRoom,
};
