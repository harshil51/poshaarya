const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const config = require('../config/environment');

const securityHeaders = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

const allowedOrigins = (config.cors.origin || 'http://localhost:8080')
  .split(',')
  .map(s => s.trim())
  .concat(['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173']);

const corsOptions = {
  origin: (origin, callback) => {
    if (config.app.isDevelopment || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  credentials: true,
  maxAge: 86400,
};

const hppProtection = hpp({
  whitelist: ['page', 'limit', 'sort', 'order', 'search'],
});

module.exports = {
  securityHeaders,
  corsOptions,
  hppProtection,
};
