const Joi = require('joi');

const upsertDailyCalorieSchema = Joi.object({
  date: Joi.date().iso().allow(null),
  goalCalories: Joi.number().integer().min(0).allow(null),
  consumedCalories: Joi.number().min(0),
  burnedCalories: Joi.number().min(0),
  proteinG: Joi.number().min(0),
  carbsG: Joi.number().min(0),
  fatG: Joi.number().min(0),
  fiberG: Joi.number().min(0),
  sugarG: Joi.number().min(0),
  waterMl: Joi.number().integer().min(0),
  isComplete: Joi.boolean(),
});

const dateQuerySchema = Joi.object({
  date: Joi.date().iso().allow('', null),
  startDate: Joi.date().iso().allow('', null),
  endDate: Joi.date().iso().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

module.exports = { upsertDailyCalorieSchema, dateQuerySchema, paramsIdSchema };
