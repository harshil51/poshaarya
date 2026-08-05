const Joi = require('joi');

const createWaterLogSchema = Joi.object({
  amountMl: Joi.number().integer().min(1).max(5000).default(200).messages({
    'number.min': 'Amount must be at least 1 ml',
    'number.max': 'Amount cannot exceed 5000 ml',
  }),
  date: Joi.date().iso().allow(null),
});

const updateWaterLogSchema = Joi.object({
  amountMl: Joi.number().integer().min(1).max(5000),
  date: Joi.date().iso(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const getWaterLogsQuerySchema = Joi.object({
  date: Joi.date().iso().allow('', null),
  startDate: Joi.date().iso().allow('', null),
  endDate: Joi.date().iso().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  createWaterLogSchema,
  updateWaterLogSchema,
  getWaterLogsQuerySchema,
  paramsIdSchema,
};
