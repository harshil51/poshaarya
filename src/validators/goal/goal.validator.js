const Joi = require('joi');

const goalTypes = ['weight_loss', 'weight_gain', 'maintain_weight', 'build_muscle', 'improve_endurance', 'general_fitness'];

const createGoalSchema = Joi.object({
  goalType: Joi.string().valid(...goalTypes).required().messages({
    'any.required': 'Goal type is required',
    'any.only': 'Invalid goal type',
  }),
  targetValue: Joi.number().positive().allow(null),
  currentValue: Joi.number().min(0).default(0),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
  notes: Joi.string().max(2000).trim().allow('', null),
});

const updateGoalSchema = Joi.object({
  goalType: Joi.string().valid(...goalTypes),
  targetValue: Joi.number().positive().allow(null),
  currentValue: Joi.number().min(0),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().allow(null),
  isAchieved: Joi.boolean(),
  isActive: Joi.boolean(),
  notes: Joi.string().max(2000).trim().allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const getGoalsQuerySchema = Joi.object({
  goalType: Joi.string().valid(...goalTypes).allow('', null),
  isActive: Joi.boolean(),
  isAchieved: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  createGoalSchema,
  updateGoalSchema,
  getGoalsQuerySchema,
  paramsIdSchema,
};
