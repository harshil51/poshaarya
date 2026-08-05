const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config/environment');
const database = require('../../config/database');
const redisCache = require('../../config/redis');
const logger = require('../../logger/winston');

class TokenService {
  generateAccessToken(user) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiry,
    });
  }

  generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }

  decodeAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret);
  }

  async storeRefreshToken(userId, refreshToken, rememberMe = false) {
    const prisma = database.getClient();
    const expiry = rememberMe
      ? this._parseDurationToDate(config.jwt.rememberExpiry)
      : this._parseDurationToDate(config.jwt.refreshExpiry);

    await prisma.authRefreshToken.create({
      data: {
        id: uuidv4(),
        userId,
        token: refreshToken,
        expiresAt: expiry,
      },
    });
  }

  async rotateRefreshToken(oldToken, newToken) {
    const prisma = database.getClient();
    const result = await prisma.authRefreshToken.updateMany({
      where: { token: oldToken, isRevoked: false },
      data: {
        token: newToken,
        expiresAt: this._parseDurationToDate(config.jwt.refreshExpiry),
      },
    });
    return result.count > 0;
  }

  async revokeRefreshToken(token) {
    const prisma = database.getClient();
    await prisma.authRefreshToken.updateMany({
      where: { token, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserTokens(userId) {
    const prisma = database.getClient();
    await prisma.authRefreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async findRefreshToken(token) {
    const prisma = database.getClient();
    return prisma.authRefreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async blacklistAccessToken(token, expiry) {
    const decoded = this.decodeAccessToken(token);
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redisCache.set(`blacklist:${token}`, '1', ttl);
    }
  }

  async isTokenBlacklisted(token) {
    const result = await redisCache.get(`blacklist:${token}`);
    return result !== null;
  }

  generateEmailVerificationToken(userId, email) {
    const payload = { sub: userId, email, purpose: 'email_verification' };
    return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: '24h' });
  }

  generatePasswordResetToken(userId) {
    const payload = { sub: userId, purpose: 'password_reset' };
    return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: '1h' });
  }

  _parseDurationToDate(duration) {
    const regex = /^(\d+)\s*(s|m|h|d|w)$/;
    const match = duration.match(regex);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = {
      s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000,
    };
    return new Date(Date.now() + value * (multipliers[unit] || 86400000));
  }
}

module.exports = new TokenService();
