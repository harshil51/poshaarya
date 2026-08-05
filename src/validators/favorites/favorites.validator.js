const Joi = require('joi');

const addFavoriteSchema = Joi.object({
  foodId: Joi.string().required().messages({ 'any.required': 'Food ID is required' }),
});

const paramsFoodIdSchema = Joi.object({
  foodId: Joi.string().required(),
});

module.exports = { addFavoriteSchema, paramsFoodIdSchema };
