const Redis = require('ioredis');
const config = require('./environment');
const logger = require('../logger/winston');

class RedisCache {
  constructor() {
    this.client = null;
    this.enabled = config.cache.enabled;
  }

  async connect() {
    if (!this.enabled) {
      logger.info('Redis caching is disabled');
      return null;
    }

    try {
      this.client = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined,
        keyPrefix: config.redis.prefix,
        retryStrategy: () => null,
        maxRetriesPerRequest: 1,
        reconnectOnError: () => false,
        lazyConnect: true,
      });

      this.client.on('error', (err) => {
        logger.warn('Redis connection error', { error: err.message });
      });

      await this.client.connect();
      logger.info('Redis connected successfully');
      return this.client;
    } catch (error) {
      logger.warn('Redis connection failed, caching disabled', {
        error: error.message,
      });
      this.enabled = false;
      this.client = null;
      return null;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      logger.info('Redis disconnected');
    }
  }

  async get(key) {
    if (!this.enabled || !this.client) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Redis get error', { error: error.message, key });
      return null;
    }
  }

  async set(key, value, ttlSeconds = config.cache.ttlSeconds) {
    if (!this.enabled || !this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      logger.error('Redis set error', { error: error.message, key });
    }
  }

  async del(key) {
    if (!this.enabled || !this.client) return;
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis del error', { error: error.message, key });
    }
  }

  async delPattern(pattern) {
    if (!this.enabled || !this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      logger.error('Redis delPattern error', { error: error.message, pattern });
    }
  }

  async flush() {
    if (!this.enabled || !this.client) return;
    try {
      await this.client.flushdb();
      logger.info('Redis cache flushed');
    } catch (error) {
      logger.error('Redis flush error', { error: error.message });
    }
  }
}

module.exports = new RedisCache();
