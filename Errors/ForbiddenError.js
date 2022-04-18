const { HTTPError } = require("./HTTPError");

class ForbiddenError extends HTTPError {
  constructor(message) {
    super(message ?? "403 Forbidden");
    this.status = 403;
  }
}

module.exports = { ForbiddenError };
