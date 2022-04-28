const { EventEmitter } = require("ws");

const rooms = {};
const roomUpdate$ = new EventEmitter();

module.exports = {
  rooms,
  roomUpdate$,
};
