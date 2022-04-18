const { HTTPError } = require("./HTTPError");

class NotAuthorizedError extends HTTPError {
  constructor(message) {
    super(message ?? "401 Not Authorized");
    this.status = 401;
  }
}

module.exports = { NotAuthorizedError };
