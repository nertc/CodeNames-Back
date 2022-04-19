const { HTTPError } = require("./HTTPError");

class InternalServerError extends HTTPError {
  constructor(message) {
    super(message ? message : "500 Internal Server Error", 500);
  }
}

module.exports = { InternalServerError };
