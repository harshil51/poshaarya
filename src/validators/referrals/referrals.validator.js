const Joi = require('joi');

const createReferralSchema = Joi.object({
  referralCode: Joi.string().trim().max(50).required(),
  referredEmail: Joi.string().trim().email().max(255).required(),
});

const redeemReferralSchema = Joi.object({
  code: Joi.string().trim().max(50).required(),
});

module.exports = { createReferralSchema, redeemReferralSchema };
