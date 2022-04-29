const { ForbiddenError } = require("../errors/forbiddenError");
const { changeOnlineState } = require("./changeOnlineState");
const { createRoom } = require("./create");
const { rooms } = require("./rooms");

function joinRoom(roomId, userId) {
  const room = rooms[roomId];

  if (!room) {
    joinEmptyRoom(roomId, userId);
  } else if (room.players.length === 1) {
    joinNotFullRoom(roomId, userId);
  } else {
    joinFullRoom(roomId, userId);
  }
}

function joinEmptyRoom(roomId, userId) {
  const room = createRoom(roomId);
  room.players.push(userId);
  changeOnlineState(roomId, userId, true);
}

function joinNotFullRoom(roomId, userId) {
  const room = rooms[roomId];
  room.players.push(userId);
  changeOnlineState(roomId, userId, true);
}

function joinFullRoom(roomId, userId) {
  const room = rooms[roomId];

  const offlinePlayerIndex = room.players.findIndex(
    (player) => !room.isOnline[player]
  );
  if (offlinePlayerIndex !== -1) {
    const offlinePlayer = room.players[offlinePlayerIndex];
    changeOnlineState(roomId, offlinePlayer, false);
    room.players[offlinePlayerIndex] = userId;
    changeOnlineState(roomId, userId, true);
    return;
  }

  throw new ForbiddenError("Room is full");
}

module.exports = {
  joinRoom,
};
