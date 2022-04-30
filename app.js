const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const { generateUserId } = require("./src/userId/generate");
const { leaveRoom } = require("./src/room/leave");
const { changeUserState } = require("./src/userId/changeState");
const { joinRoom } = require("./src/room/join");
const { getRoomInfo } = require("./src/room/getRoomInfo");
const { updateKeys } = require("./src/room/interaction/updateKeys");
const { guessWord } = require("./src/room/interaction/guessWord");
const { refreshRoom } = require("./src/room/refresh");
const { generateWords } = require("./src/wordlist/generate");
const { roomUpdate$ } = require("./src/room/rooms");
const { HTTPError } = require("./src/errors/httpError");
const { InternalServerError } = require("./src/errors/internalServerError");
const { BadRequestError } = require("./src/errors/badRequestError");

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const corsAllowedKeywords = ["codehs"];

const corsPass = (req, callback) => {
  const corsPassOptions = {
    origin: corsAllowedKeywords.some(
      (keyword) =>
        typeof req.header("Origin") === "string" &&
        req.header("Origin").includes(keyword)
    ),
  };
  callback(null, corsPassOptions);
};

app.use(express.json());
app.use(cors(corsPass));

wss.on("connection", (ws) => {
  let roomId = null;
  const userId = generateUserId();
  const ping = setInterval(() => ws.ping(), 10000);

  const sendRoomInfo = () => {
    ws.send(JSON.stringify(getRoomInfo(roomId, userId)));
  };

  ws.on("message", (data, isBinary) => {
    const newRoomId = JSON.parse(isBinary ? data : data.toString()).roomId;
    if (typeof newRoomId !== "number" || roomId === newRoomId) {
      ws.send(
        JSON.stringify(
          new BadRequestError("RoomId is NaN or not different").message
        )
      );
      return;
    }
    if (typeof roomId === "number") {
      roomUpdate$.off(roomId, sendRoomInfo);
      leaveRoom(roomId, userId);
    }
    roomId = newRoomId;
    try {
      joinRoom(roomId, userId);
      roomUpdate$.on(roomId, sendRoomInfo);
      sendRoomInfo();
    } catch (err) {
      ws.send(JSON.stringify(getError(err).message));
    }
  });

  ws.on("close", () => {
    clearInterval(ping);
    if (roomId !== null) {
      roomUpdate$.off(roomId, sendRoomInfo);
      leaveRoom(roomId, userId);
      changeUserState(userId, false);
    }
  });

  ws.send(
    JSON.stringify({
      userId,
    })
  );
});

app.post("/room/:roomId/keys", (req, res, next) => {
  const roomId = req.params.roomId;
  const { userid: userId } = req.headers;
  const { word, count } = req.body;
  try {
    updateKeys(roomId, userId, { word, count });
    res.send();
  } catch (err) {
    next(err);
  }
});

app.post("/room/:roomId/guess", (req, res, next) => {
  const { roomId } = req.params;
  const { userid: userId } = req.headers;
  const { wordIndex } = req.body;
  try {
    const guess = guessWord(roomId, userId, wordIndex);
    res.json(guess);
  } catch (err) {
    next(err);
  }
});

app.post("/room/:roomId/refresh", (req, res, next) => {
  const { roomId } = req.params;
  const { userid: userId } = req.headers;
  try {
    refreshRoom(roomId, userId);
    res.send();
  } catch (err) {
    next(err);
  }
});

function getError(err) {
  if (!(err instanceof HTTPError)) {
    console.error(err);
    err = new InternalServerError();
  }
  return err;
}

app.use((err, req, res, next) => {
  err = getError(err);
  res.status(err.status).send(err.message);
});

server.listen(port, () => {
  console.log(`CodeNames app listening on http://localhost:${port}`);
});
