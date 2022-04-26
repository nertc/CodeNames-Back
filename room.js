const { getWords } = require("./wordlist");
const { getTeams } = require("./teams");
const { NotAuthorizedError } = require("./Errors/NotAuthorizedError");
const { NotFoundError } = require("./Errors/NotFoundError");
const { ForbiddenError } = require("./Errors/ForbiddenError");

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
      lastActivity: {
        [userId]: new Date(),
      },
      guessLeft: 0,
      gameOver: false,
    };
  } else if (room.players.length === 1) {
    room.players.push(userId);
    room.lastActivity[userId] = new Date();
  } else {
    const player1Time = room.lastActivity[room.players[0]];
    player1Time.setSeconds(player1Time.getSeconds() + 30);
    if (player1Time < Date.now()) {
      delete room.lastActivity[room.players[0]];
      room.players[0] = userId;
      room.lastActivity[userId] = new Date();
      return;
    }
    const player2Time = room.lastActivity[room.players[1]];
    player2Time.setSeconds(player2Time.getSeconds() + 30);
    if (player2Time < Date.now()) {
      delete room.lastActivity[room.players[1]];
      room.players[1] = userId;
      room.lastActivity[userId] = new Date();
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
    lastActivity: room.lastActivity,
    guessLeft: 0,
    gameOver: false,
  };
}

function getRoomInfo(roomId, userId) {
  const room = rooms[roomId];
  if (!room) {
    throw new NotFoundError("Room not found");
  }
  if (!room.players.includes(userId)) {
    throw new NotAuthorizedError();
  }
  updateActivity(roomId, userId);
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
  updateActivity(roomId, userId);
  room.currentKey = keys;
  room.guessLeft = keys.count + 1;
  changeTurn(roomId);
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
  if (room.words.length <= wordIndex) {
    throw new NotFoundError("Word not found");
  }
  if (room.words[wordIndex].active) {
    throw new ForbiddenError("Word is already active");
  }
  updateActivity(roomId, userId);
  room.words[wordIndex].active = true;
  room.guessLeft--;
  if (room.words[wordIndex].team === "teammate" && room.guessLeft > 0) {
    return {
      team: room.words[wordIndex].team,
      isActivePlayer: true,
    };
  }
  changeTurn(roomId);
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
  if (!room.words.some((word) => word.word === "enemy" && !word.active)) {
    room.gameOver = true;
    return true;
  }
  return false;
}

function updateActivity(roomId, userId) {
  const room = rooms[roomId];
  room.lastActivity[userId] = new Date();
}

module.exports = {
  joinRoom,
  getRoomInfo,
  updateKeys,
  guessWord,
  refreshRoom,
};
