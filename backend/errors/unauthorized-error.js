class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

// const BadRequestError = require('../errors/bad-request-error');
// const ConflictError = require('../errors/conflict-error');
// const NotFoundError = require('../errors/not-found-error');
// const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = UnauthorizedError;
