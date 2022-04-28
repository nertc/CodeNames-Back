const { emitRoom } = require("../emitRoom");
const { rooms } = require("../rooms");
const { validateKeys } = require("../validate");
const { changeTurn } = require("./changeTurn");

function updateKeys(roomId, userId, keys) {
  validateKeys(roomId, userId, keys);

  const room = rooms[roomId];
  room.currentKey = keys;
  room.guessLeft = keys.count + 1;
  changeTurn(roomId);
  emitRoom(roomId);
}

module.exports = {
  updateKeys,
};
