const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { UnauthorizedError, ForbiddenError } = require('../errors');
const { asyncHandler } = require('../utils');
const redis = require('../config/redis');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Fallback to cookie for web client requests
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthorizedError('Access token is required');
  }

  const decoded = jwt.verify(token, config.jwt.accessSecret);

  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    throw new UnauthorizedError('Token has been revoked');
  }

  req.user = {
    id: decoded.sub,
    email: decoded.email,
  };

  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    next();
  };
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (token) {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      req.user = {
        id: decoded.sub,
        email: decoded.email,
      };
    }
  } catch (error) {
    req.user = null;
  }
  next();
});

module.exports = { authenticate, authorize, optionalAuth };
