const Joi = require('joi');

const achievementCategories = ['LOGIN_STREAK','MEAL_TRACKED','WATER_GOAL','EXERCISE_COMPLETED','WEIGHT_MILESTONE','CALORIE_GOAL','PROTEIN_GOAL','PERFECT_WEEK','PERFECT_MONTH','FIRST_MEAL','FIRST_EXERCISE'];

const createAchievementSchema = Joi.object({
  name: Joi.string().required().max(255).trim(),
  description: Joi.string().max(5000).trim().allow('', null),
  iconUrl: Joi.string().uri().allow('', null),
  category: Joi.string().valid(...achievementCategories).required(),
  criteria: Joi.string().max(2000).trim().allow('', null),
  points: Joi.number().integer().min(0).default(0),
});

const updateAchievementSchema = Joi.object({
  name: Joi.string().max(255).trim(),
  description: Joi.string().max(5000).trim().allow('', null),
  iconUrl: Joi.string().uri().allow('', null),
  category: Joi.string().valid(...achievementCategories),
  criteria: Joi.string().max(2000).trim().allow('', null),
  points: Joi.number().integer().min(0),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

const updateProgressSchema = Joi.object({
  progress: Joi.number().min(0).max(100).required(),
});

module.exports = {
  createAchievementSchema,
  updateAchievementSchema,
  paramsIdSchema,
  updateProgressSchema,
};
