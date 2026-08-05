const Joi = require('joi');

const createEmergencyContactSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Name is required' }),
  relationship: Joi.string().trim().max(100).allow('', null),
  phoneCode: Joi.string().trim().max(10).allow('', null),
  phoneNumber: Joi.string().trim().max(20).required().messages({ 'any.required': 'Phone number is required' }),
  email: Joi.string().trim().email().max(255).allow('', null),
});

const updateEmergencyContactSchema = Joi.object({
  name: Joi.string().trim().max(255),
  relationship: Joi.string().trim().max(100).allow('', null),
  phoneCode: Joi.string().trim().max(10).allow('', null),
  phoneNumber: Joi.string().trim().max(20),
  email: Joi.string().trim().email().max(255).allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { createEmergencyContactSchema, updateEmergencyContactSchema, paramsIdSchema };
