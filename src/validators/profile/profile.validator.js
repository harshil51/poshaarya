const Joi = require('joi');

const upsertProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(100),
  lastName: Joi.string().trim().max(100).allow('', null),
  dateOfBirth: Joi.date().iso().allow(null),
  gender: Joi.string().trim().valid('MALE', 'FEMALE', 'OTHER').max(50).allow('', null),
  bio: Joi.string().trim().max(2000).allow('', null),
  phoneCode: Joi.string().trim().max(10).allow('', null),
  phoneNumber: Joi.string().trim().max(20).allow('', null),
  addressLine1: Joi.string().trim().max(255).allow('', null),
  addressLine2: Joi.string().trim().max(255).allow('', null),
  city: Joi.string().trim().max(100).allow('', null),
  state: Joi.string().trim().max(100).allow('', null),
  country: Joi.string().trim().max(100).allow('', null),
  zipCode: Joi.string().trim().max(20).allow('', null),
  languages: Joi.array().items(Joi.string().trim()).allow(null),
});

module.exports = { upsertProfileSchema };
