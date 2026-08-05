const Joi = require('joi');

const createBlogSchema = Joi.object({
  title: Joi.string().required().max(255).trim(),
  excerpt: Joi.string().max(1000).trim().allow('', null),
  content: Joi.string().required().max(50000).trim(),
  coverImage: Joi.string().uri().allow('', null),
  category: Joi.string().max(100).trim().allow('', null),
  tags: Joi.string().max(1000).trim().allow('', null),
  isPublished: Joi.boolean().default(false),
  readTimeMin: Joi.number().integer().min(1).allow(null),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().max(255).trim(),
  excerpt: Joi.string().max(1000).trim().allow('', null),
  content: Joi.string().max(50000).trim(),
  coverImage: Joi.string().uri().allow('', null),
  category: Joi.string().max(100).trim().allow('', null),
  tags: Joi.string().max(1000).trim().allow('', null),
  isPublished: Joi.boolean(),
  readTimeMin: Joi.number().integer().min(1).allow(null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const searchBlogSchema = Joi.object({
  query: Joi.string().trim().max(100).allow('', null),
  category: Joi.string().max(100).allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

module.exports = { createBlogSchema, updateBlogSchema, searchBlogSchema, paramsIdSchema };
