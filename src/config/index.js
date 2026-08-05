const environment = require('./environment');
const database = require('./database');
const redis = require('./redis');
const logger = require('../logger/winston');

module.exports = {
  config: environment,
  database,
  redis,
  logger,
};
