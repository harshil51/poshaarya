const AppError = require('./AppError');
const HttpStatus = require('./HttpStatus');
const ErrorCodes = require('./ErrorCodes');

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND);
  }
}

class ValidationError extends AppError {
  constructor(details = null) {
    super('Validation failed', HttpStatus.UNPROCESSABLE_ENTITY, ErrorCodes.VALIDATION_ERROR, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCodes.TOKEN_MISSING);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists', errorCode = ErrorCodes.ALREADY_EXISTS) {
    super(message, HttpStatus.CONFLICT, errorCode);
  }
}

class RateLimitError extends AppError {
  constructor() {
    super('Too many requests', HttpStatus.TOO_MANY_REQUESTS, ErrorCodes.RATE_LIMIT_EXCEEDED);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request', details = null) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCodes.INVALID_INPUT, details);
  }
}

module.exports = {
  AppError,
  HttpStatus,
  ErrorCodes,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  BadRequestError,
};
