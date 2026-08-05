const Joi = require('joi');

const createMealTemplateSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Template name is required' }),
  description: Joi.string().trim().allow('', null),
});

const updateMealTemplateSchema = Joi.object({
  name: Joi.string().trim().max(255),
  description: Joi.string().trim().allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createMealTemplateSchema, updateMealTemplateSchema, paramsIdSchema };
