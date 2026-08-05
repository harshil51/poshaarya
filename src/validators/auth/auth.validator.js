const Joi = require('joi');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phonePattern = /^\+?[\d\s-]{10,15}$/;
const namePattern = /^[a-zA-Z\s'-]{2,50}$/;

const registerSchema = Joi.object({
  firstName: Joi.string().pattern(namePattern).required().messages({
    'string.pattern.base': 'First name must be 2-50 letters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().pattern(namePattern).allow('', null).messages({
    'string.pattern.base': 'Last name must be 2-50 letters',
  }),
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password',
  }),
  phone: Joi.string().pattern(phonePattern).allow('', null).messages({
    'string.pattern.base': 'Please provide a valid phone number',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
  rememberMe: Joi.boolean().default(false),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be exactly 6 digits',
    'any.required': 'OTP is required',
  }),
});

const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be exactly 6 digits',
    'any.required': 'OTP is required',
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    'any.required': 'New password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your new password',
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    'any.required': 'New password is required',
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your new password',
  }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().pattern(namePattern).messages({
    'string.pattern.base': 'First name must be 2-50 letters',
  }),
  lastName: Joi.string().pattern(namePattern).allow('', null).messages({
    'string.pattern.base': 'Last name must be 2-50 letters',
  }),
  bio: Joi.string().max(2000).trim().allow('', null),
  dateOfBirth: Joi.date().iso().max('now').allow(null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').allow(null),
  addressLine1: Joi.string().trim().max(255).allow('', null),
  addressLine2: Joi.string().trim().max(255).allow('', null),
  city: Joi.string().trim().max(100).allow('', null),
  state: Joi.string().trim().max(100).allow('', null),
  country: Joi.string().trim().max(100).allow('', null),
  zipCode: Joi.string().trim().max(20).allow('', null),
  languages: Joi.array().items(Joi.string().trim()).allow(null),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const updateEmailSchema = Joi.object({
  newEmail: Joi.string().email().required().lowercase().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'New email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required for security',
  }),
});

const deleteAccountSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required to delete your account',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  updateProfileSchema,
  updateEmailSchema,
  deleteAccountSchema,
};
