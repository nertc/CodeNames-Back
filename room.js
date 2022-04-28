const { getWords } = require("./wordlist");
const { getTeams } = require("./teams");
const { NotAuthorizedError } = require("./Errors/NotAuthorizedError");
const { NotFoundError } = require("./Errors/NotFoundError");
const { ForbiddenError } = require("./Errors/ForbiddenError");
const { EventEmitter } = require("ws");

const WORDS_COUNT = 20;
const TEAMS = [
  {
    team: "bomb",
    count: 1,
  },
  {
    team: "neutral",
    count: 4,
  },
  {
    team: "teammate",
    count: 8,
  },
  {
    team: "enemy",
    count: 7,
  },
];

const rooms = {};
const roomUpdate = new EventEmitter();

function getWordsArray() {
  const teams = getTeams(TEAMS);
  const words = getWords(WORDS_COUNT).reduce((acc, word, index) => {
    acc.push({
      word,
      team: teams[index],
      active: false,
    });
    return acc;
  }, []);

  return words;
}

function joinRoom(roomId, userId) {
  const room = rooms[roomId];
  if (!room) {
    const guide = Math.floor(Math.random() * 2);
    const words = getWordsArray();
    rooms[roomId] = {
      players: [userId],
      guide,
      words,
      currentKey: {},
      activePlayer: guide,
      isOnline: {},
      guessLeft: 0,
      gameOver: false,
      win: false,
    };
  } else if (room.players.length === 1) {
    room.players.push(userId);
  } else {
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
}

function refreshRoom(roomId, userId) {
  const room = rooms[roomId];
  if (!room) {
    throw new NotFoundError("Room not found");
  }
  if (!room.players.includes(userId)) {
    throw new NotAuthorizedError();
  }
  if (!room.gameOver) {
    throw new ForbiddenError("Game is not over");
  }

  const guide = (room.guide + 1) % 2;
  rooms[roomId] = {
    players: room.players,
    guide,
    words: getWordsArray(),
    currentKey: {},
    activePlayer: guide,
    isOnline: room.isOnline,
    guessLeft: 0,
    gameOver: false,
    win: false,
  };
  emitRoom(roomId);
}

function getRoomInfo(roomId, userId) {
  const room = rooms[roomId];
  if (!room) {
    throw new NotFoundError("Room not found");
  }
  if (!room.players.includes(userId)) {
    throw new NotAuthorizedError();
  }
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

function updateKeys(roomId, userId, keys) {
  const room = rooms[roomId];
  if (!room) {
    throw new NotFoundError("Room not found");
  }
  if (room.gameOver) {
    throw new ForbiddenError("Game is over");
  }
  if (room.players[room.guide] !== userId) {
    throw new ForbiddenError("Source is not a guide");
  }
  if (room.activePlayer !== room.guide) {
    throw new ForbiddenError("Not source's turn");
  }
  if (keys.count <= 0) {
    throw new ForbiddenError("Key count is zero");
  }
  room.currentKey = keys;
  room.guessLeft = keys.count + 1;
  changeTurn(roomId);
  emitRoom(roomId);
}

function guessWord(roomId, userId, wordIndex) {
  const room = rooms[roomId];
  const userIndex = (room.guide + 1) % 2;
  if (!room) {
    throw new NotFoundError("Room not found");
  }
  if (room.gameOver) {
    throw new ForbiddenError("Game is over");
  }
  if (room.players[userIndex] !== userId) {
    throw new ForbiddenError("Source is not a guesser");
  }
  if (room.activePlayer !== userIndex) {
    throw new ForbiddenError("Not source's turn");
  }
  if (room.words.length <= wordIndex || wordIndex < 0) {
    throw new NotFoundError("Word not found");
  }
  if (room.words[wordIndex].active) {
    throw new ForbiddenError("Word is already active");
  }
  room.words[wordIndex].active = true;
  room.guessLeft--;
  if (room.words[wordIndex].team === "teammate" && room.guessLeft > 0) {
    checkGameOver(roomId);
    emitRoom(roomId);
    return {
      team: room.words[wordIndex].team,
      isActivePlayer: true,
    };
  }
  changeTurn(roomId);
  emitRoom(roomId);
  return {
    team: room.words[wordIndex].team,
    isActivePlayer: false,
  };
}

function changeTurn(roomId) {
  const room = rooms[roomId];
  room.activePlayer++;
  room.activePlayer %= 2;
  if (room.guide === room.activePlayer) {
    const enemies = room.words.filter(
      (word) => !word.active && word.team === "enemy"
    );
    enemies[Math.floor(Math.random() * enemies.length)].active = true;
    checkGameOver(roomId);
  }
}

function checkGameOver(roomId) {
  const room = rooms[roomId];
  if (
    !room.words.some((word) => word.team === "enemy" && !word.active) ||
    room.words.some((word) => word.team === "bomb" && word.active)
  ) {
    room.gameOver = true;
    return true;
  }
  if (room.words.every((word) => word.team !== "teammate" || word.active)) {
    room.win = true;
    room.gameOver = true;
    return true;
  }
  return false;
}

function emitRoom(roomId) {
  roomUpdate.emit(roomId);
}

function changeUserState(roomId, userId, state) {
  const room = rooms[roomId];
  if (!state) {
    if (room) {
      delete room.isOnline[userId];
      if (
        Object.getOwnPropertyNames(room.isOnline).every(
          (player) => !room.isOnline[player]
        )
      ) {
        delete rooms[roomId];
      }
    }
    return;
  }
  if (!room) {
    throw new NotFoundError("Room not found");
  }
  if (!room.players.includes(userId)) {
    throw new NotAuthorizedError();
  }
  room.isOnline[userId] = true;
}

module.exports = {
  joinRoom,
  getRoomInfo,
  updateKeys,
  guessWord,
  refreshRoom,
  changeUserState,
  roomUpdate,
};
