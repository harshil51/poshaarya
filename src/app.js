const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const morganMiddleware = require('./logger/morgan');
const { securityHeaders, corsOptions, hppProtection } = require('./middlewares/security');
const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config/environment');
const routes = require('./routes');
const webRoutes = require('./web');
const logger = require('./logger/winston');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(hppProtection);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use(morganMiddleware);

// Static files
app.use(express.static('frontend'));

// Web routes
app.use(webRoutes);

// API routes
app.use(config.app.apiPrefix, apiLimiter, routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Poshaarya API is running',
    environment: config.app.env,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  if (req.accepts('html')) {
    const path = require('path');
    return res.status(404).sendFile(path.join(__dirname, '../frontend/static/404.html'), (err) => {
      if (err) res.status(404).send('<h1>404 - Page Not Found</h1><a href="/">Go Home</a>');
    });
  }
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: { code: 'NOT_FOUND' },
  });
});

// Error handler
app.use(errorHandler);

// Unhandled rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { error: reason.message, stack: reason.stack });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

module.exports = app;
