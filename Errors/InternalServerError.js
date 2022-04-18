const { HTTPError } = require("./HTTPError");

class InternalServerError extends HTTPError {
  constructor(message) {
    super(message ?? "500 Internal Server Error");
    this.status = 500;
  }
}

module.exports = { InternalServerError };
