const { HTTPError } = require("./HTTPError");

class NotFoundError extends HTTPError {
  constructor(message) {
    super(message ?? "404 Not Found");
    this.status = 404;
  }
}

module.exports = { NotFoundError };
