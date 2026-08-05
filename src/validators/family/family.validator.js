const Joi = require('joi');

const createFamilyGroupSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({ 'any.required': 'Family group name is required' }),
});

const updateFamilyGroupSchema = Joi.object({
  name: Joi.string().trim().max(255),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const addFamilyMemberSchema = Joi.object({
  userId: Joi.string().required().messages({ 'any.required': 'User ID is required' }),
  role: Joi.string().trim().valid('MEMBER', 'CHILD', 'PARENT', 'GUARDIAN').max(50).default('MEMBER'),
});

const paramsIdSchema = Joi.object({
  id: Joi.string().required(),
});

const removeMemberParamsSchema = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { createFamilyGroupSchema, updateFamilyGroupSchema, addFamilyMemberSchema, paramsIdSchema, removeMemberParamsSchema };
