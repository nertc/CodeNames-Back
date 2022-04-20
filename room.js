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

function joinRoom(roomId, userId) {
  const room = rooms[roomId];
  if (!room) {
    const guide = Math.floor(Math.random() * 2);
    const teams = getTeams(TEAMS);
    const words = getWords(WORDS_COUNT).reduce((acc, word, index) => {
      acc.push({
        word,
        team: teams[index],
        active: false,
      });
      return acc;
    }, []);
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

function getRoomInfo(roomId, userId) {
  const currentRoom = rooms[roomId];
  if (!currentRoom) {
    throw new NotFoundError("Room not found");
  }
  if (!currentRoom.players.includes(userId)) {
    throw new NotAuthorizedError();
  }
  currentRoom.lastActivity[userId] = new Date();
  const guide = currentRoom.players[currentRoom.guide] === userId;
  return {
    guide,
    words: currentRoom.words.map(word => {
      if(guide || word.active) {
        return word;
      } else {
        return {
          word: word.word,
          active: word.active          
        };
      }
    }),
    currentKey: currentRoom.currentKey,
    isActivePlayer: currentRoom.players[currentRoom.activePlayer] === userId,
  };
}

function updateKeys(roomId, userId, keys) {
  const room = rooms[roomId];
  if (!room) {
    throw new NotFoundError("Room not found");
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
}

function guessWord(roomId, userId, wordIndex) {
  const room = rooms[roomId];
  const userIndex = (room.guide + 1) % 2;
  if (!room) {
    throw new NotFoundError("Room not found");
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
  room.words[wordIndex].active = true;
  room.guessLeft--;
  if (room.words[wordIndex].team === "teammate" && room.guessLeft > 0) {
    return true;
  }
  changeTurn(roomId);
  return false;
}

function changeTurn(roomId) {
  const room = rooms[roomId];
  room.activePlayer++;
  room.activePlayer %= 2;
}

module.exports = {
  joinRoom,
  getRoomInfo,
  updateKeys,
  guessWord,
};
