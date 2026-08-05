const Joi = require('joi');

const upsertFitnessProfileSchema = Joi.object({
  currentHeightCm: Joi.number().min(20).max(300).allow(null),
  currentWeightKg: Joi.number().min(1).max(500).allow(null),
  targetWeightKg: Joi.number().min(1).max(500).allow(null),
  activityLevel: Joi.string().trim().valid('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE').allow('', null),
  fitnessGoals: Joi.array().items(Joi.string().trim()).allow(null),
  bmr: Joi.number().positive().allow(null),
  tdee: Joi.number().positive().allow(null),
});

module.exports = { upsertFitnessProfileSchema };
