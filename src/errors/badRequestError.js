const { HTTPError } = require("./httpError");

class BadRequestError extends HTTPError {
  constructor(message) {
    super(message ? message : "400 Bad Request", 400);
  }
}

module.exports = { BadRequestError };
