const { HTTPError } = require("./HTTPError");

class ForbiddenError extends HTTPError {
  constructor(message) {
    super(message ? message : "403 Forbidden", 403);
  }
}

module.exports = { ForbiddenError };
