const Joi = require('joi');

const createMealPlanSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Meal plan name is required' }),
  description: Joi.string().trim().allow('', null),
  durationDays: Joi.number().integer().min(1).max(365).required(),
  targetCalories: Joi.number().positive().allow(null),
  isPremium: Joi.boolean().default(false),
});

const updateMealPlanSchema = Joi.object({
  name: Joi.string().trim().max(255),
  description: Joi.string().trim().allow('', null),
  durationDays: Joi.number().integer().min(1).max(365),
  targetCalories: Joi.number().positive().allow(null),
  isPremium: Joi.boolean(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

const createVersionSchema = Joi.object({
  changeReason: Joi.string().trim().allow('', null),
});

const addDaySchema = Joi.object({
  dayNumber: Joi.number().integer().min(1).required(),
  title: Joi.string().trim().max(255).allow('', null),
  notes: Joi.string().trim().allow('', null),
});

const updateDaySchema = Joi.object({
  title: Joi.string().trim().max(255).allow('', null),
  notes: Joi.string().trim().allow('', null),
  isRestDay: Joi.boolean(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const addItemSchema = Joi.object({
  mealType: Joi.string().trim().max(50).required().messages({ 'any.required': 'Meal type is required' }),
  foodVersionId: Joi.string().allow('', null),
  recipeVersionId: Joi.string().allow('', null),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().trim().max(50).required(),
  sortOrder: Joi.number().integer().min(0).default(0),
});

module.exports = { createMealPlanSchema, updateMealPlanSchema, paramsIdSchema, createVersionSchema, addDaySchema, updateDaySchema, addItemSchema };
