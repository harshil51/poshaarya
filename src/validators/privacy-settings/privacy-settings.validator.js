const Joi = require('joi');

const updatePrivacySettingsSchema = Joi.object({
  profileVisibility: Joi.string().trim().valid('PUBLIC', 'PRIVATE', 'FRIENDS').max(50),
  showWeight: Joi.boolean(),
  showMeals: Joi.boolean(),
  showWorkouts: Joi.boolean(),
  allowSearch: Joi.boolean(),
  shareDataWithAi: Joi.boolean(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

module.exports = { updatePrivacySettingsSchema };
