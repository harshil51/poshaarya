const Joi = require('joi');

const upsertHealthProfileSchema = Joi.object({
  medicalConditions: Joi.array().items(Joi.string().trim()).allow(null),
  allergies: Joi.array().items(Joi.string().trim()).allow(null),
  medications: Joi.array().items(Joi.object({
    name: Joi.string().trim().required(),
    dosage: Joi.string().trim().allow('', null),
    frequency: Joi.string().trim().allow('', null),
  })).allow(null),
  bloodGroup: Joi.string().trim().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').allow('', null),
  dietaryPreferences: Joi.array().items(Joi.string().trim()).allow(null),
});

module.exports = { upsertHealthProfileSchema };
