const { generateUserId } = require("./id");
const { getRoomInfo, joinRoom, updateKeys, guessWord } = require("./room");
const { getWords } = require("./wordlist");
const { HTTPError } = require("./Errors/HTTPError");
const { InternalServerError } = require("./Errors/InternalServerError");

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const corsAllowedUrls = ["https://codehs.com"];

const corsPass = (req, callback) => {
  const corsPassOptions = {
    origin: corsAllowedUrls.includes(req.header("Origin")),
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
