const Joi = require('joi');

const createFoodCategorySchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Category name is required' }),
  slug: Joi.string().trim().max(255).required(),
  parentId: Joi.string().trim().allow('', null),
  iconUrl: Joi.string().trim().uri().max(1000).allow('', null),
});

const updateFoodCategorySchema = Joi.object({
  name: Joi.string().trim().max(255),
  slug: Joi.string().trim().max(255),
  parentId: Joi.string().trim().allow('', null),
  iconUrl: Joi.string().trim().uri().max(1000).allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createFoodCategorySchema, updateFoodCategorySchema, paramsIdSchema };
