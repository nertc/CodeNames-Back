const { generateUserId } = require("./id");
const {
  getRoomInfo,
  joinRoom,
  updateKeys,
  guessWord,
  refreshRoom,
  changeUserState,
  roomUpdate,
} = require("./room");
const { getWords } = require("./wordlist");
const { HTTPError } = require("./Errors/HTTPError");
const { InternalServerError } = require("./Errors/InternalServerError");

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

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

app.post("/room/:roomId/join", (req, res, next) => {
  const { roomId } = req.params;
  const userId = generateUserId();
  try {
    joinRoom(roomId, userId);
    res.json({ userId });
  } catch (err) {
    next(err);
  }
});

app.get("/room/:roomId", (req, res, next) => {
  const { roomId } = req.params;
  const { userid: userId } = req.headers;
  try {
    const room = getRoomInfo(roomId, userId);
    res.json(room);
  } catch (err) {
    next(err);
  }
});

wss.on("connection", (ws) => {
  let roomId, userId;
  const sendRoomInfo = () => {
    ws.send(JSON.stringify(getRoomInfo(roomId, userId)));
  };

  ws.on("message", (data, isBinary) => {
    const { roomId: newRoomId, userId: newUserId } = JSON.parse(
      isBinary ? data : data.toString()
    );
    roomUpdate.off(roomId, sendRoomInfo);
    changeUserState(roomId, userId, false);
    roomId = newRoomId;
    userId = newUserId;
    try {
      changeUserState(roomId, userId, true);
      roomUpdate.on(roomId, sendRoomInfo);
    } catch (err) {
      ws.send(getError(err).message);
    }
  });

  ws.on("close", () => {
    roomUpdate.off(roomId, sendRoomInfo);
    changeUserState(roomId, userId, false);
  });
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
  console.log(`Example app listening on http://localhost:${port}`);
});

getWords();
