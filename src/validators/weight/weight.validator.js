const Joi = require('joi');

const createWeightLogSchema = Joi.object({
  weightKg: Joi.number().positive().required().messages({
    'any.required': 'Weight is required',
    'number.positive': 'Weight must be a positive number',
  }),
  bodyFatPercentage: Joi.number().min(0).max(100).allow(null),
  bmi: Joi.number().positive().allow(null),
  source: Joi.string().trim().max(50).allow('', null),
  notes: Joi.string().max(2000).trim().allow('', null),
  date: Joi.date().iso().allow(null),
});

const updateWeightLogSchema = Joi.object({
  weightKg: Joi.number().positive(),
  bodyFatPercentage: Joi.number().min(0).max(100).allow(null),
  bmi: Joi.number().positive().allow(null),
  source: Joi.string().trim().max(50).allow('', null),
  notes: Joi.string().max(2000).trim().allow('', null),
  date: Joi.date().iso(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const getWeightLogsQuerySchema = Joi.object({
  startDate: Joi.date().iso().allow('', null),
  endDate: Joi.date().iso().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  createWeightLogSchema,
  updateWeightLogSchema,
  getWeightLogsQuerySchema,
  paramsIdSchema,
};
