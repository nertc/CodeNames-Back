const { HTTPError } = require("./httpError");

class NotFoundError extends HTTPError {
  constructor(message) {
    super(message ? message : "404 Not Found", 404);
  }
}

module.exports = { NotFoundError };
