const Joi = require('joi');

const createWorkoutPlanSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Workout plan name is required' }),
  description: Joi.string().trim().allow('', null),
  level: Joi.string().trim().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').max(50).allow('', null),
  goal: Joi.string().trim().max(50).allow('', null),
  durationWeeks: Joi.number().integer().min(1).max(52).default(4),
  isPremium: Joi.boolean().default(false),
});

const updateWorkoutPlanSchema = Joi.object({
  name: Joi.string().trim().max(255),
  description: Joi.string().trim().allow('', null),
  level: Joi.string().trim().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').max(50).allow('', null),
  goal: Joi.string().trim().max(50).allow('', null),
  durationWeeks: Joi.number().integer().min(1).max(52),
  isPremium: Joi.boolean(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

const addWeekSchema = Joi.object({
  weekNumber: Joi.number().integer().min(1).required(),
  focus: Joi.string().trim().max(255).allow('', null),
});

const addDaySchema = Joi.object({
  dayNumber: Joi.number().integer().min(1).required(),
  isRestDay: Joi.boolean().default(false),
  title: Joi.string().trim().max(255).allow('', null),
  notes: Joi.string().trim().allow('', null),
});

const addExerciseSchema = Joi.object({
  exerciseId: Joi.string().required().messages({ 'any.required': 'Exercise ID is required' }),
  sets: Joi.number().integer().min(1).allow(null),
  reps: Joi.number().integer().min(1).allow(null),
  durationSeconds: Joi.number().integer().min(1).allow(null),
  restSeconds: Joi.number().integer().min(0).allow(null),
  notes: Joi.string().trim().allow('', null),
  sortOrder: Joi.number().integer().min(0).default(0),
});

module.exports = { createWorkoutPlanSchema, updateWorkoutPlanSchema, paramsIdSchema, addWeekSchema, addDaySchema, addExerciseSchema };
