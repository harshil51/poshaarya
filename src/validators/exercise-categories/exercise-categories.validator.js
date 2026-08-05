const Joi = require('joi');

const createExerciseCategorySchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Category name is required' }),
  slug: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().allow('', null),
});

const updateExerciseCategorySchema = Joi.object({
  name: Joi.string().trim().max(255),
  slug: Joi.string().trim().max(255),
  description: Joi.string().trim().allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createExerciseCategorySchema, updateExerciseCategorySchema, paramsIdSchema };
