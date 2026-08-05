const { PrismaClient } = require('@prisma/client');
const config = require('./environment');
const logger = require('../logger/winston');

class Database {
  constructor() {
    this.client = null;
  }

  async connect() {
    try {
      this.client = new PrismaClient({
        log: config.app.isDevelopment
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
      });

      await this.client.$connect();
      logger.info('Database connected successfully');
      return this.client;
    } catch (error) {
      logger.error('Database connection failed', { error: error.message });
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.$disconnect();
      logger.info('Database disconnected');
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.client;
  }
}

module.exports = new Database();
