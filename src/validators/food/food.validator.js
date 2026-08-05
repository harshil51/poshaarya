const Joi = require('joi');

const searchFoodSchema = Joi.object({
  query: Joi.string().trim().max(100).allow('', null),
  categoryId: Joi.string().allow('', null),
  isIndian: Joi.boolean().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const createFoodSchema = Joi.object({
  name: Joi.string().required().max(255).trim().messages({
    'any.required': 'Food name is required',
    'string.max': 'Food name must be under 255 characters',
  }),
  description: Joi.string().max(1000).trim().allow('', null),
  barcode: Joi.string().max(100).trim().allow('', null),
  categoryId: Joi.string().allow('', null),
  brand: Joi.string().max(200).trim().allow('', null),
  servingSize: Joi.number().positive().allow(null),
  servingUnit: Joi.string().max(50).trim().allow('', null),
  servingSizeGrams: Joi.number().positive().allow(null),
  isIndian: Joi.boolean().default(false),
  imageUrl: Joi.string().uri().allow('', null),

  nutrition: Joi.object({
    calories: Joi.number().min(0).default(0),
    proteinG: Joi.number().min(0).default(0),
    carbsG: Joi.number().min(0).default(0),
    fatG: Joi.number().min(0).default(0),
    fiberG: Joi.number().min(0).default(0),
    sugarG: Joi.number().min(0).default(0),
    saturatedFatG: Joi.number().min(0).default(0),
    transFatG: Joi.number().min(0).default(0),
    cholesterolMg: Joi.number().min(0).default(0),
    sodiumMg: Joi.number().min(0).default(0),
    potassiumMg: Joi.number().min(0).default(0),
    calciumMg: Joi.number().min(0).default(0),
    ironMg: Joi.number().min(0).default(0),
    vitaminAIu: Joi.number().min(0).default(0),
    vitaminCMg: Joi.number().min(0).default(0),
    vitaminDIu: Joi.number().min(0).default(0),
  }).allow(null),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().max(255).trim(),
  description: Joi.string().max(1000).trim().allow('', null),
  categoryId: Joi.string().allow('', null),
  brand: Joi.string().max(200).trim().allow('', null),
  servingSize: Joi.number().positive().allow(null),
  servingUnit: Joi.string().max(50).trim().allow('', null),
  servingSizeGrams: Joi.number().positive().allow(null),
  imageUrl: Joi.string().uri().allow('', null),
  nutrition: Joi.object({
    calories: Joi.number().min(0),
    proteinG: Joi.number().min(0),
    carbsG: Joi.number().min(0),
    fatG: Joi.number().min(0),
    fiberG: Joi.number().min(0),
    sugarG: Joi.number().min(0),
    saturatedFatG: Joi.number().min(0),
    transFatG: Joi.number().min(0),
    cholesterolMg: Joi.number().min(0),
    sodiumMg: Joi.number().min(0),
    potassiumMg: Joi.number().min(0),
    calciumMg: Joi.number().min(0),
    ironMg: Joi.number().min(0),
    vitaminAIu: Joi.number().min(0),
    vitaminCMg: Joi.number().min(0),
    vitaminDIu: Joi.number().min(0),
  }).allow(null),
}).min(1).messages({
  'object.min': 'At least one field must be provided',
});

const getFoodParamsSchema = Joi.object({
  id: Joi.string().required(),
});

const barcodeQuerySchema = Joi.object({
  barcode: Joi.string().required().max(100).messages({
    'any.required': 'Barcode is required',
  }),
});

module.exports = {
  searchFoodSchema,
  createFoodSchema,
  updateFoodSchema,
  getFoodParamsSchema,
  barcodeQuerySchema,
};
