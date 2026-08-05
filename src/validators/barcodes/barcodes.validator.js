const Joi = require('joi');

const createBarcodeSchema = Joi.object({
  foodId: Joi.string().required().messages({ 'any.required': 'Food ID is required' }),
  barcode: Joi.string().trim().max(255).required().messages({ 'any.required': 'Barcode is required' }),
  format: Joi.string().trim().max(50).default('EAN-13'),
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

const lookupSchema = Joi.object({
  barcode: Joi.string().trim().required(),
});

module.exports = { createBarcodeSchema, paramsIdSchema, lookupSchema };
