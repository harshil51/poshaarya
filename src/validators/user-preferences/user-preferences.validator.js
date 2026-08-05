const Joi = require('joi');

const updateUserPreferencesSchema = Joi.object({
  timezone: Joi.string().trim().max(100),
  dateFormat: Joi.string().trim().max(20),
  timeFormat: Joi.string().trim().valid('12h', '24h').max(10),
  weightUnit: Joi.string().trim().valid('kg', 'lbs').max(10),
  heightUnit: Joi.string().trim().valid('cm', 'ft', 'm').max(10),
  waterUnit: Joi.string().trim().valid('ml', 'l', 'oz').max(10),
  energyUnit: Joi.string().trim().valid('kcal', 'kJ').max(10),
  theme: Joi.string().trim().valid('light', 'dark', 'system').max(20),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

module.exports = { updateUserPreferencesSchema };
