const Joi = require('joi');

const createContactMessageSchema = Joi.object({
  name: Joi.string().required().max(255).trim(),
  email: Joi.string().email().required().trim(),
  phone: Joi.string().max(20).trim().allow('', null),
  subject: Joi.string().required().max(255).trim(),
  message: Joi.string().required().max(5000).trim(),
});

const getMessagesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

module.exports = { createContactMessageSchema, getMessagesQuerySchema, paramsIdSchema };
