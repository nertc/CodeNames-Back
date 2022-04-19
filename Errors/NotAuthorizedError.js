const { HTTPError } = require("./HTTPError");

class NotAuthorizedError extends HTTPError {
  constructor(message) {
    super(message ? message : "401 Not Authorized", 401);
  }
}

module.exports = { NotAuthorizedError };
