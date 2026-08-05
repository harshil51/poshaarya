const Joi = require('joi');

const subscriptionPlans = ['FREE','BASIC','PREMIUM','ENTERPRISE'];
const subscriptionStatuses = ['ACTIVE','CANCELLED','EXPIRED','PAUSED','TRIAL'];
const paymentStatuses = ['PENDING','COMPLETED','FAILED','REFUNDED','CANCELLED'];

const createSubscriptionSchema = Joi.object({
  plan: Joi.string().valid(...subscriptionPlans).required(),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
  trialEndDate: Joi.date().iso().allow(null),
  autoRenew: Joi.boolean().default(true),
  stripeCustomerId: Joi.string().allow('', null),
  stripeSubId: Joi.string().allow('', null),
});

const updateSubscriptionSchema = Joi.object({
  plan: Joi.string().valid(...subscriptionPlans),
  status: Joi.string().valid(...subscriptionStatuses),
  endDate: Joi.date().iso().allow(null),
  trialEndDate: Joi.date().iso().allow(null),
  autoRenew: Joi.boolean(),
  stripeCustomerId: Joi.string().allow('', null),
  stripeSubId: Joi.string().allow('', null),
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

const createPaymentSchema = Joi.object({
  subscriptionId: Joi.string().allow('', null),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('INR'),
  status: Joi.string().valid(...paymentStatuses).default('PENDING'),
  method: Joi.string().allow('', null),
  transactionId: Joi.string().allow('', null),
  invoiceUrl: Joi.string().uri().allow('', null),
  description: Joi.string().max(2000).trim().allow('', null),
});

const paramsIdSchema = Joi.object({ id: Joi.string().required() });

module.exports = {
  createSubscriptionSchema, updateSubscriptionSchema, createPaymentSchema, paramsIdSchema,
};
