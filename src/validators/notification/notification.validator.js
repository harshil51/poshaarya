const Joi = require('joi');

const notificationTypes = [
  'GOAL_ACHIEVED', 'STREAK_MILESTONE', 'MEAL_REMINDER', 'WATER_REMINDER',
  'EXERCISE_REMINDER', 'BADGE_EARNED', 'WEIGHT_UPDATE', 'DAILY_SUMMARY',
  'WEEKLY_REPORT', 'ACHIEVEMENT_UNLOCKED',
];

const getNotificationsQuerySchema = Joi.object({
  isRead: Joi.boolean(),
  type: Joi.string().valid(...notificationTypes).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const createNotificationSchema = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string().valid(...notificationTypes).required(),
  title: Joi.string().required().max(255).trim(),
  message: Joi.string().max(5000).trim().allow('', null),
  data: Joi.string().allow('', null),
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  getNotificationsQuerySchema,
  createNotificationSchema,
  paramsIdSchema,
};
