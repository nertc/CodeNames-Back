const { BadRequestError } = require("../errors/BadRequestError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { NotAuthorizedError } = require("../errors/NotAuthorizedError");
const { NotFoundError } = require("../errors/notFoundError");
const { rooms } = require("./rooms");

function validateRoomId(roomId) {
  const room = rooms[roomId];

  if (!room) {
    throw new NotFoundError("Room not found");
  }
}

function validateUserId(roomId, userId) {
  validateRoomId(roomId);

  const room = rooms[roomId];

  if (!room.players.includes(userId)) {
    throw new NotAuthorizedError();
  }
}

function validateTurn(roomId, userId, guide) {
  validateUserId(roomId, userId);

  const room = rooms[roomId];

  if (room.gameOver) {
    throw new ForbiddenError("Game is over");
  }

  const permissionId = room.players[(room.guide + (guide ? 0 : 1)) % 2];
  if (userId !== permissionId) {
    throw new ForbiddenError(`Source is not a ${guide ? "guide" : "guesser"}`);
  }

  const turnId = room.players[room.activePlayer];
  if (userId !== turnId) {
    throw new ForbiddenError("Not source's turn");
  }
}

function validateKeys(roomId, userId, keys) {
  validateTurn(roomId, userId, true);

  if (keys.count <= 0) {
    throw new BadRequestError("Key count is zero");
  }
}

function validateWord(roomId, userId, wordIndex) {
  validateTurn(roomId, userId, false);

  const room = rooms[roomId];
  if (room.words.length <= wordIndex || wordIndex < 0) {
    throw new BadRequestError("Word not found");
  }
  if (room.words[wordIndex].active) {
    throw new BadRequestError("Word is already active");
  }
}

module.exports = {
  validateRoomId,
  validateUserId,
  validateTurn,
  validateKeys,
  validateWord,
};
