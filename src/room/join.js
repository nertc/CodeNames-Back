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

  const offlinePlayer = room.players.findIndex(
    (player) => !room.isOnline[player]
  );
  if (offlinePlayer !== -1) {
    delete room.isOnline[room.players[offlinePlayer]];
    room.players[offlinePlayer] = userId;
    return;
  }

  throw new ForbiddenError("Room is full");
}

module.exports = {
  joinRoom,
};
