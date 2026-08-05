const Joi = require('joi');

const addFundsSchema = Joi.object({
  amount: Joi.number().positive().required().messages({ 'any.required': 'Amount is required' }),
  description: Joi.string().trim().allow('', null),
  referenceId: Joi.string().trim().allow('', null),
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = { addFundsSchema, querySchema };
