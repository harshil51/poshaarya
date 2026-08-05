const app = require('./app');
const config = require('./config/environment');
const database = require('./config/database');
const redisCache = require('./config/redis');
const logger = require('./logger/winston');

let server;

async function initDatabase() {
  try {
    await database.connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', { error: error.message });
    throw error;
  }
}

async function initRedis() {
  try {
    await redisCache.connect();
  } catch (error) {
    logger.warn('Redis connection failed, continuing without cache', {
      error: error.message,
    });
  }
}

async function startServer() {
  return new Promise((resolve, reject) => {
    server = app.listen(config.app.port, () => {
      const url = config.app.url || `http://localhost:${config.app.port}`;
      logger.info(`${config.app.name} server started`, {
        port: config.app.port,
        environment: config.app.env,
        url,
        apiPrefix: config.app.apiPrefix,
      });
      console.log(`\n  🚀  ${config.app.name} running at ${url}\n`);
      resolve(server);
    });

    server.on('error', (error) => {
      logger.error('Server failed to start', { error: error.message });
      reject(error);
    });

    server.timeout = 120000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
  });
}

async function gracefulShutdown(signal) {
  logger.info(`${signal} signal received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await database.disconnect();
        logger.info('Database connection closed');
      } catch (error) {
        logger.error('Error closing database', { error: error.message });
      }

      try {
        await redisCache.disconnect();
        logger.info('Redis connection closed');
      } catch (error) {
        logger.error('Error closing Redis', { error: error.message });
      }

      logger.info('Graceful shutdown complete');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000).unref();
  } else {
    process.exit(0);
  }
}

async function main() {
  try {
    logger.info(`Starting ${config.app.name} in ${config.app.env} mode...`);

    await initDatabase();
    await initRedis();
    await startServer();

    logger.info(`${config.app.name} is ready to accept requests`);
  } catch (error) {
    logger.error('Failed to start application', {
      error: error.message,
      stack: config.app.isDevelopment ? error.stack : undefined,
    });
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise: promise.toString(),
    error: reason?.message || reason,
    stack: reason?.stack,
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown('uncaughtException');
});

main();

module.exports = app;
