const Joi = require('joi');

const createBodyMeasurementSchema = Joi.object({
  date: Joi.date().iso().allow(null),
  chestCm: Joi.number().min(0).max(300).allow(null),
  waistCm: Joi.number().min(0).max(300).allow(null),
  hipsCm: Joi.number().min(0).max(300).allow(null),
  armsCm: Joi.number().min(0).max(200).allow(null),
  thighsCm: Joi.number().min(0).max(200).allow(null),
  bodyFatPercentage: Joi.number().min(0).max(100).allow(null),
});

const updateBodyMeasurementSchema = Joi.object({
  date: Joi.date().iso(),
  chestCm: Joi.number().min(0).max(300).allow(null),
  waistCm: Joi.number().min(0).max(300).allow(null),
  hipsCm: Joi.number().min(0).max(300).allow(null),
  armsCm: Joi.number().min(0).max(200).allow(null),
  thighsCm: Joi.number().min(0).max(200).allow(null),
  bodyFatPercentage: Joi.number().min(0).max(100).allow(null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const querySchema = Joi.object({
  startDate: Joi.date().iso().allow('', null),
  endDate: Joi.date().iso().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createBodyMeasurementSchema, updateBodyMeasurementSchema, querySchema, paramsIdSchema };
