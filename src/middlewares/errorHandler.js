const config = require('../config/environment');
const logger = require('../logger/winston');
const { AppError, HttpStatus, ErrorCodes } = require('../errors');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal server error';
    const errorCode = error.errorCode || ErrorCodes.INTERNAL_ERROR;

    if (error.code === 'P2002') {
      error = new AppError(
        'Resource already exists with this value',
        HttpStatus.CONFLICT,
        ErrorCodes.DB_UNIQUE_CONSTRAINT
      );
    } else if (error.code === 'P2025') {
      error = new AppError(
        'Resource not found',
        HttpStatus.NOT_FOUND,
        ErrorCodes.NOT_FOUND
      );
    } else if (error.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token', HttpStatus.UNAUTHORIZED, ErrorCodes.TOKEN_INVALID);
    } else if (error.name === 'TokenExpiredError') {
      error = new AppError('Token expired', HttpStatus.UNAUTHORIZED, ErrorCodes.TOKEN_EXPIRED);
    } else if (error.name === 'ValidationError') {
      error = new AppError(error.message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorCodes.VALIDATION_ERROR);
    } else if (error.type === 'entity.parse.failed') {
      error = new AppError('Invalid JSON in request body', HttpStatus.BAD_REQUEST, ErrorCodes.INVALID_INPUT);
    } else {
      error = new AppError(message, statusCode, errorCode);
    }
  }

  if (!config.app.isProduction) {
    logger.error('Error:', {
      message: error.message,
      stack: error.stack,
      code: error.errorCode,
      statusCode: error.statusCode,
      url: req.originalUrl,
      method: req.method,
    });
  }

  if (error.statusCode >= 500) {
    logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  const response = {
    success: false,
    message: error.isOperational || !config.app.isProduction ? error.message : 'Something went wrong',
    error: {
      code: error.errorCode,
      ...(error.details && { details: error.details }),
    },
    timestamp: error.timestamp || new Date().toISOString(),
  };

  if (config.app.isDevelopment) {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
