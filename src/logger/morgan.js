const morgan = require('morgan');
const logger = require('./winston');

const stream = {
  write: (message) => logger.http(message.trim()),
};

const skip = (req, res) => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test' || res.statusCode < 400;
};

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

module.exports = morganMiddleware;
