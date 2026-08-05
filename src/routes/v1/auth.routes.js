const express = require('express');
const router = express.Router();

const authController = require('../../controllers/auth/auth.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { authLimiter, otpLimiter } = require('../../middlewares/rateLimiter');
const {
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
} = require('../../validators/auth/auth.validator');

// ─── Public Routes ─────────────────────────────────────────

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/verify-email',
  otpLimiter,
  validate(verifyEmailSchema),
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  otpLimiter,
  validate(resendVerificationSchema),
  authController.resendVerificationOTP
);

router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  otpLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ─── Protected Routes ──────────────────────────────────────

router.post('/logout', authenticate, authController.logout);

router.post(
  '/logout-all',
  authenticate,
  authController.logoutAllDevices
);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

router.get('/me', authenticate, authController.getCurrentUser);

router.get('/profile', authenticate, authController.getProfile);

router.patch(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile
);

router.post(
  '/update-email',
  authenticate,
  validate(updateEmailSchema),
  authController.updateEmail
);

router.delete(
  '/account',
  authenticate,
  validate(deleteAccountSchema),
  authController.deleteAccount
);

module.exports = router;