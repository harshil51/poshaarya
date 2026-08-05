const Joi = require('joi');

const createProgressPhotoSchema = Joi.object({
  imageUrl: Joi.string().uri().required(),
  category: Joi.string().trim().max(50).allow('', null),
  notes: Joi.string().max(2000).trim().allow('', null),
  date: Joi.date().iso().allow(null),
});

const updateProgressPhotoSchema = Joi.object({
  imageUrl: Joi.string().uri(),
  category: Joi.string().trim().max(50).allow('', null),
  notes: Joi.string().max(2000).trim().allow('', null),
  date: Joi.date().iso(),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const getPhotosQuerySchema = Joi.object({
  category: Joi.string().trim().max(50).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

module.exports = {
  createProgressPhotoSchema, updateProgressPhotoSchema, getPhotosQuerySchema, paramsIdSchema,
};
