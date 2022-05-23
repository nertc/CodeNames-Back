# ![CodeNames Back](./docs/logo.png)

Backend for CodeNames digital game with the rules of the "CodeNames: Pictures" 2-player version.

Teams arrangement:

- Enemy - 7
- Teammate - 8
- Neutral - 4
- Bomb - 1

---

## Setup

```
npm i
npm start
```

_.env file can contain PORT_

---

## Usage

You can use already hosted server (`https://codenamesback.herokuapp.com`) or host it yourself.

1. Connect to the WebSocket

   Response:

   ```json5
   {
     userId: "string",
   }
   ```

   _After that every request to the server API needs userId in the header_

2. Send to the WebSocket

   Request:

   ```json5
   {
     roomId: "number",
   }
   ```

   Response:

   ```json5
   {
     guide: "bool", // Wheter a player is a guide
     words: [
       // Array of 20 words
       {
         word: "string", // Word
         team: "TEAM", // Team: enemy | teammate | neutral | bomb; Only shown to the guide or after word has been activated (clicked)
         active: "bool", // Wheter word has been activated (clicked)
       },
       // ...
     ],
     currentKey: {
       word: "string", // Key word
       count: "number", // Key count
       // Or empty object if no key has been given (at the start of the match)
     },
     isActivePlayer: "bool", // Wheter it's a player's turn
     gameOver: "bool", // If the game is over
     win: "bool", // If the game is won
   }
   ```

   _After this, server will automatically respond with the same template on every change_

3. 1. Send to the Server (Guide) `/room/:roomId/keys`

      Request:

      ```json5
      {
        word: "string", // Key word
        count: "number", // Key count >0
      }
      ```

      Response: Empty

   2. Send to the Server (Guesser) `/room/:roomId/guess`
      Request:
      ```json5
      {
        wordIndex: "number", // Guessed word index
      }
      ```
      Response:
      ```json5
      {
        team: "TEAM", // TEAM of the guessed word
        isActivePlayer: "bool", // Wheter a player is still active
        enemyIndex: "number", // Newly opened enemy index (only shown when the turn is over)
      }
      ```

4. Send to the Server (Guesser) `/room/:roomId/endturn`

   Request: Empty

   Response:

   ```json5
   {
     enemyIndex: "number", // Newly opened enemy index
   }
   ```

5. Send to the Server `/room/:roomId/refresh`

   Request: Empty

   Response: Empty (Socket sends settings of the new room)

### Errors

Errors are sent as simple plain texts

<table>
  <thead>
    <th>Status</th>
    <th>Text</th>
  </thead>
  <tr>
    <td colspan="2">Defaults</td>
  </tr>
  <tr>
    <td>400</td>
    <td>400 Bad Request</td>
  </tr>
  <tr>
    <td>401</td>
    <td>401 Not Authorized</td>
  </tr>
  <tr>
    <td>403</td>
    <td>403 Forbidden</td>
  </tr>
  <tr>
    <td>404</td>
    <td>404 Not Found</td>
  </tr>
  <tr>
    <td>500</td>
    <td>500 Internal Server Error</td>
  </tr>
  <tr>
    <td colspan="2">Specifics</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Key count is zero</td>
  </tr>
  <tr>
    <td>400</td>
    <td>RoomId is NaN</td>
  </tr>
  <tr>
    <td>400</td>
    <td>RoomId is not different</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Word is already active</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Word not found</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Game is over</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Not source's turn</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Room is already refreshing</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Room is full</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Source is already joining a room</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Source is not a guesser</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Source is not a guide</td>
  </tr>
  <tr>
    <td>404</td>
    <td>Room not found</td>
  </tr>
</table>

## Projects using this API

- https://codehs.com/share/id/write-the-code-SFPAgo/run
