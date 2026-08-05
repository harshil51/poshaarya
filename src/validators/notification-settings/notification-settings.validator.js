const Joi = require('joi');

const updateNotificationSettingsSchema = Joi.object({
  emailPromotions: Joi.boolean(),
  emailUpdates: Joi.boolean(),
  pushMeals: Joi.boolean(),
  pushWater: Joi.boolean(),
  pushWorkouts: Joi.boolean(),
  smsAlerts: Joi.boolean(),
  whatsappAlerts: Joi.boolean(),
  quietHoursStart: Joi.string().regex(/^\d{2}:\d{2}$/).allow('', null),
  quietHoursEnd: Joi.string().regex(/^\d{2}:\d{2}$/).allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

module.exports = { updateNotificationSettingsSchema };
