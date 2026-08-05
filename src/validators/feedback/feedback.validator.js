const Joi = require('joi');

const createFeedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).default(5),
  subject: Joi.string().max(255).trim().allow('', null),
  message: Joi.string().required().max(5000).trim(),
  category: Joi.string().max(100).trim().allow('', null),
});

const updateFeedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  subject: Joi.string().max(255).trim().allow('', null),
  message: Joi.string().max(5000).trim(),
  category: Joi.string().max(100).trim().allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const getFeedbackQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

module.exports = { createFeedbackSchema, updateFeedbackSchema, getFeedbackQuerySchema, paramsIdSchema };
