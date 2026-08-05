const Joi = require('joi');

const createRecipeSchema = Joi.object({
  title: Joi.string().required().max(255).trim(),
  description: Joi.string().max(5000).trim().allow('', null),
  ingredients: Joi.string().required().max(10000).trim(),
  instructions: Joi.string().required().max(20000).trim(),
  prepTimeMin: Joi.number().integer().min(0).allow(null),
  cookTimeMin: Joi.number().integer().min(0).allow(null),
  servings: Joi.number().integer().min(1).allow(null),
  caloriesPerServing: Joi.number().positive().allow(null),
  proteinG: Joi.number().positive().allow(null),
  carbsG: Joi.number().positive().allow(null),
  fatG: Joi.number().positive().allow(null),
  fiberG: Joi.number().positive().allow(null),
  sugarG: Joi.number().positive().allow(null),
  imageUrl: Joi.string().uri().allow('', null),
  dietType: Joi.string().max(50).trim().allow('', null),
  mealType: Joi.string().max(50).trim().allow('', null),
  difficulty: Joi.string().max(50).trim().allow('', null),
  isIndian: Joi.boolean().default(false),
  isPublished: Joi.boolean().default(false),
});

const updateRecipeSchema = Joi.object({
  title: Joi.string().max(255).trim(),
  description: Joi.string().max(5000).trim().allow('', null),
  ingredients: Joi.string().max(10000).trim(),
  instructions: Joi.string().max(20000).trim(),
  prepTimeMin: Joi.number().integer().min(0).allow(null),
  cookTimeMin: Joi.number().integer().min(0).allow(null),
  servings: Joi.number().integer().min(1).allow(null),
  caloriesPerServing: Joi.number().positive().allow(null),
  proteinG: Joi.number().positive().allow(null),
  carbsG: Joi.number().positive().allow(null),
  fatG: Joi.number().positive().allow(null),
  fiberG: Joi.number().positive().allow(null),
  sugarG: Joi.number().positive().allow(null),
  imageUrl: Joi.string().uri().allow('', null),
  dietType: Joi.string().max(50).trim().allow('', null),
  mealType: Joi.string().max(50).trim().allow('', null),
  difficulty: Joi.string().max(50).trim().allow('', null),
  isIndian: Joi.boolean(),
  isPublished: Joi.boolean(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const searchRecipeSchema = Joi.object({
  query: Joi.string().trim().max(100).allow('', null),
  dietType: Joi.string().max(50).allow('', null),
  mealType: Joi.string().max(50).allow('', null),
  difficulty: Joi.string().max(50).allow('', null),
  isIndian: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

module.exports = { createRecipeSchema, updateRecipeSchema, searchRecipeSchema, paramsIdSchema };
