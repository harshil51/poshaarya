const Joi = require('joi');

const createTagSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Tag name is required' }),
  slug: Joi.string().trim().max(255).required().messages({ 'any.required': 'Tag slug is required' }),
});

const updateTagSchema = Joi.object({
  name: Joi.string().trim().max(255),
  slug: Joi.string().trim().max(255),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createTagSchema, updateTagSchema, paramsIdSchema };
