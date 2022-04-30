const { TEAMS } = require("../../teams/teams");
const { rooms } = require("../rooms");
const { validateRoomId } = require("../validate");

function showEnemy(roomId) {
  validateRoomId(roomId);

  const room = rooms[roomId];
  const enemies = room.words
    .map((word, index) => ({
      ...word,
      index,
    }))
    .filter((word) => !word.active && word.team === TEAMS.ENEMY);
  const enemy = Math.floor(Math.random() * enemies.length);
  const enemyIndex = enemies[enemy].index;
  room.words[enemyIndex].active = true;

  return enemyIndex;
}

module.exports = {
  showEnemy,
};
