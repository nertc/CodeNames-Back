class HTTPError extends Error {
  status = 500;
}

module.exports = { HTTPError };
