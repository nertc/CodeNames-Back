const { generateUserId } = require("./id");
const { getRoomInfo, joinRoom, updateKeys, guessWord } = require("./room");
const { getWords } = require("./wordlist");
const { HTTPError } = require("./Errors/HTTPError");
const { InternalServerError } = require("./Errors/InternalServerError");

const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/room/:roomId/join", (req, res, next) => {
  const { roomId } = req.params;
  const userId = generateUserId();
  try {
    joinRoom(roomId, userId);
    res.send(userId);
  } catch (err) {
    next(err);
  }
});

app.get("/room/:roomId", (req, res, next) => {
  const { roomId } = req.params;
  const { userId } = req.body;
  try {
    const room = getRoomInfo(roomId, userId);
    res.send(room);
  } catch (err) {
    next(err);
  }
});

app.post("/room/:roomId/keys", (req, res, next) => {
  const roomId = req.params.roomId;
  const { word, count, userId } = req.body;
  try {
    updateKeys(roomId, userId, { word, count });
    res.send();
  } catch (err) {
    next(err);
  }
});

app.post("/room/:roomId/guess", (req, res, next) => {
  const { roomId } = req.params;
  const { wordIndex, userId } = req.body;
  try {
    guessWord(roomId, userId, wordIndex);
    res.send();
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (!(err instanceof HTTPError)) {
    console.error(err);
    err = new InternalServerError();
  }
  res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

getWords();
