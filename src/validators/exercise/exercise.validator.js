const Joi = require('joi');

const exerciseCategories = ['CARDIO', 'STRENGTH', 'FLEXIBILITY', 'HIIT', 'SPORTS', 'YOGA', 'WALKING', 'RUNNING', 'CYCLING', 'SWIMMING'];
const intensityLevels = ['low', 'medium', 'high', 'very_high'];

const searchExerciseSchema = Joi.object({
  query: Joi.string().trim().max(100).allow('', null),
  category: Joi.string().valid(...exerciseCategories).allow('', null),
  intensity: Joi.string().valid(...intensityLevels).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const createExerciseSchema = Joi.object({
  name: Joi.string().required().max(255).trim().messages({
    'any.required': 'Exercise name is required',
  }),
  description: Joi.string().max(2000).trim().allow('', null),
  category: Joi.string().valid(...exerciseCategories).default('CARDIO'),
  intensity: Joi.string().valid(...intensityLevels).allow(null),
  caloriesPerHour: Joi.number().positive().allow(null),
  metValue: Joi.number().positive().allow(null),
  imageUrl: Joi.string().uri().allow('', null),
});

const updateExerciseSchema = Joi.object({
  name: Joi.string().max(255).trim(),
  description: Joi.string().max(2000).trim().allow('', null),
  category: Joi.string().valid(...exerciseCategories),
  intensity: Joi.string().valid(...intensityLevels).allow(null),
  caloriesPerHour: Joi.number().positive().allow(null),
  metValue: Joi.number().positive().allow(null),
  imageUrl: Joi.string().uri().allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

const getLogsQuerySchema = Joi.object({
  date: Joi.date().iso().allow('', null),
  startDate: Joi.date().iso().allow('', null),
  endDate: Joi.date().iso().allow('', null),
  exerciseId: Joi.string().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const createLogSchema = Joi.object({
  exerciseId: Joi.string().required().messages({
    'any.required': 'Exercise ID is required',
  }),
  durationMinutes: Joi.number().integer().min(0).default(0),
  intensity: Joi.string().valid(...intensityLevels).allow(null),
  distanceKm: Joi.number().min(0).allow(null),
  reps: Joi.number().integer().min(0).allow(null),
  sets: Joi.number().integer().min(0).allow(null),
  weightKg: Joi.number().min(0).allow(null),
  caloriesBurned: Joi.number().min(0).allow(null),
  notes: Joi.string().max(2000).trim().allow('', null),
  date: Joi.date().iso().allow(null),
});

const updateLogSchema = Joi.object({
  durationMinutes: Joi.number().integer().min(0),
  intensity: Joi.string().valid(...intensityLevels).allow(null),
  distanceKm: Joi.number().min(0).allow(null),
  reps: Joi.number().integer().min(0).allow(null),
  sets: Joi.number().integer().min(0).allow(null),
  weightKg: Joi.number().min(0).allow(null),
  caloriesBurned: Joi.number().min(0).allow(null),
  notes: Joi.string().max(2000).trim().allow('', null),
  date: Joi.date().iso(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

module.exports = {
  searchExerciseSchema,
  createExerciseSchema,
  updateExerciseSchema,
  paramsIdSchema,
  getLogsQuerySchema,
  createLogSchema,
  updateLogSchema,
};
