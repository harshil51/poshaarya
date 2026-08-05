const Joi = require('joi');

const mealItemSchema = Joi.object({
  foodId: Joi.string().required().messages({
    'any.required': 'Food ID is required',
  }),
  quantity: Joi.number().positive().default(1),
  servingSize: Joi.number().positive().allow(null),
  servingUnit: Joi.string().max(50).trim().allow('', null),
});

const createMealSchema = Joi.object({
  name: Joi.string().max(255).trim().default('Meal'),
  mealType: Joi.string()
    .valid('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')
    .required()
    .messages({
      'any.required': 'Meal type is required',
      'any.only': 'Meal type must be one of: breakfast, lunch, dinner, snack, pre_workout, post_workout',
    }),
  date: Joi.date().iso().allow(null),
  notes: Joi.string().max(2000).trim().allow('', null),
  items: Joi.array().items(mealItemSchema).min(0),
});

const updateMealSchema = Joi.object({
  name: Joi.string().max(255).trim(),
  mealType: Joi.string().valid(
    'breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'
  ),
  date: Joi.date().iso(),
  notes: Joi.string().max(2000).trim().allow('', null),
  items: Joi.array().items(mealItemSchema).min(0),
}).min(1).messages({
  'object.min': 'At least one field must be provided',
});

const getMealsQuerySchema = Joi.object({
  date: Joi.date().iso().allow('', null),
  startDate: Joi.date().iso().allow('', null),
  endDate: Joi.date().iso().allow('', null),
  mealType: Joi.string().valid(
    'breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'
  ).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const addItemSchema = Joi.object({
  foodId: Joi.string().required().messages({
    'any.required': 'Food ID is required',
  }),
  quantity: Joi.number().positive().default(1),
  servingSize: Joi.number().positive().allow(null),
  servingUnit: Joi.string().max(50).trim().allow('', null),
});

const updateItemSchema = Joi.object({
  quantity: Joi.number().positive(),
  servingSize: Joi.number().positive().allow(null),
  servingUnit: Joi.string().max(50).trim().allow('', null),
}).min(1).messages({
  'object.min': 'At least one field must be provided',
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

const itemParamsSchema = Joi.object({
  id: Joi.string().required(),
  itemId: Joi.string().required(),
});

const duplicateMealQuerySchema = Joi.object({
  date: Joi.date().iso().allow('', null),
});

module.exports = {
  createMealSchema,
  updateMealSchema,
  getMealsQuerySchema,
  addItemSchema,
  updateItemSchema,
  paramsIdSchema,
  itemParamsSchema,
  duplicateMealQuerySchema,
};
