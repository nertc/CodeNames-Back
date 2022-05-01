const { generateWordTeamPair } = require("../shared/generateWordTeamPair");
const { rooms } = require("./rooms");

async function createRoom(roomId) {
  const guide = Math.floor(Math.random() * 2);
  const words = await generateWordTeamPair();
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
