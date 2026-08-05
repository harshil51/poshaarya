const rateLimit = require('express-rate-limit');
const config = require('../config/environment');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later',
      error: { code: 'RATE_LIMIT_EXCEEDED' },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const apiLimiter = createRateLimiter(
  config.rateLimit.windowMs,
  config.rateLimit.maxRequests,
  'Too many requests, please try again later'
);

const authLimiter = createRateLimiter(
  config.rateLimit.windowMs,
  config.rateLimit.authMax,
  'Too many authentication attempts, please try again later'
);

const otpLimiter = createRateLimiter(
  60000,
  3,
  'Too many OTP requests, please try again after a minute'
);

const uploadLimiter = createRateLimiter(
  60000,
  10,
  'Too many upload requests, please try again later'
);

module.exports = {
  apiLimiter,
  authLimiter,
  otpLimiter,
  uploadLimiter,
};
