const bcrypt = require('bcryptjs');
const config = require('../../config/environment');
const database = require('../../config/database');
const tokenService = require('./token.service');
const otpService = require('./otp.service');
const emailService = require('./email.service');
const logger = require('../../logger/winston');
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} = require('../../errors');
const { Helpers } = require('../../utils');

class AuthService {
  async register({ firstName, lastName, email, password, phone }) {
    const prisma = database.getClient();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    if (phone) {
      const existingPhone = await prisma.user.findFirst({ where: { phoneNumber: phone } });
      if (existingPhone) {
        throw new ConflictError('An account with this phone number already exists');
      }
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phoneNumber: phone || null,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    const otp = await otpService.createOTP(email, 'EMAIL_VERIFICATION', user.id);

    try {
      await emailService.sendVerificationOTP(email, otp);
    } catch (error) {
      logger.warn('Failed to send verification email', {
        userId: user.id,
        error: error.message,
      });
    }

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken();
    await tokenService.storeRefreshToken(user.id, refreshToken);

    try {
      await emailService.sendWelcomeEmail(email, firstName);
    } catch (error) {
      logger.warn('Failed to send welcome email', {
        userId: user.id,
        error: error.message,
      });
    }

    return {
      user: this._sanitizeUser(user),
      tokens: { accessToken, refreshToken },
    };
  }

  async login({ email, password, rememberMe = false }) {
    const prisma = database.getClient();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'ACTIVE' || user.deletedAt) {
      throw new UnauthorizedError(
        'Your account has been disabled. Please contact support.'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken();
    await tokenService.storeRefreshToken(user.id, refreshToken, rememberMe);

    return {
      user: this._sanitizeUser(user),
      tokens: { accessToken, refreshToken },
    };
  }

  async logout(userId, accessToken, refreshToken) {
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }

    if (accessToken) {
      try {
        await tokenService.blacklistAccessToken(accessToken);
      } catch (error) {
        logger.warn('Failed to blacklist access token', { error: error.message });
      }
    }
  }

  async logoutAllDevices(userId, currentAccessToken) {
    await tokenService.revokeAllUserTokens(userId);

    if (currentAccessToken) {
      try {
        await tokenService.blacklistAccessToken(currentAccessToken);
      } catch (error) {
        logger.warn('Failed to blacklist access token', { error: error.message });
      }
    }
  }

  async refreshAccessToken(refreshToken) {
    const storedToken = await tokenService.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (storedToken.isRevoked) {
      await tokenService.revokeAllUserTokens(storedToken.userId);
      throw new UnauthorizedError('Refresh token has been revoked');
    }

    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedError('Refresh token has expired');
    }

    const newRefreshToken = tokenService.generateRefreshToken();
    const rotated = await tokenService.rotateRefreshToken(
      refreshToken,
      newRefreshToken
    );

    if (!rotated) {
      throw new UnauthorizedError('Failed to rotate refresh token');
    }

    const accessToken = tokenService.generateAccessToken(storedToken.user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifyEmail(email, otp) {
    await otpService.verifyOTP(email, otp, 'EMAIL_VERIFICATION');

    const prisma = database.getClient();
    const user = await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    return this._sanitizeUser(user);
  }

  async resendVerificationOTP(email) {
    const prisma = database.getClient();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestError('Email is already verified');
    }

    await otpService.invalidatePreviousOTPs(email, 'EMAIL_VERIFICATION');

    const otp = await otpService.createOTP(email, 'EMAIL_VERIFICATION', user.id);

    try {
      await emailService.sendVerificationOTP(email, otp);
    } catch (error) {
      logger.error('Failed to resend verification OTP', { email, error: error.message });
      throw new BadRequestError('Failed to send verification email');
    }
  }

  async forgotPassword(email) {
    const prisma = database.getClient();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'If the account exists, a reset OTP has been sent.' };
    }

    await otpService.invalidatePreviousOTPs(email, 'PASSWORD_RESET');

    const otp = await otpService.createOTP(email, 'PASSWORD_RESET', user.id);

    try {
      await emailService.sendPasswordResetOTP(email, otp);
    } catch (error) {
      logger.error('Failed to send password reset email', { email, error: error.message });
      throw new BadRequestError('Failed to send password reset email');
    }

    return { message: 'If the account exists, a reset OTP has been sent.' };
  }

  async resetPassword(email, otp, newPassword) {
    await otpService.verifyOTP(email, otp, 'PASSWORD_RESET');

    const prisma = database.getClient();
    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    const user = await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    await tokenService.revokeAllUserTokens(user.id);

    return { message: 'Password has been reset successfully' };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const prisma = database.getClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestError('New password must be different from current password');
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await tokenService.revokeAllUserTokens(userId);
  }

  async getCurrentUser(userId) {
    const prisma = database.getClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this._sanitizeUser(user);
  }

  async updateProfile(userId, profileData) {
    const prisma = database.getClient();
    const allowedFields = [
      'firstName', 'lastName', 'dateOfBirth', 'gender', 'bio',
      'addressLine1', 'addressLine2', 'city', 'state', 'country', 'zipCode',
      'languages',
    ];

    const profileFields = {};
    const userFields = {};
    for (const field of allowedFields) {
      if (profileData[field] !== undefined) {
        if (field === 'firstName' || field === 'lastName') {
          userFields[field] = profileData[field];
        } else {
          profileFields[field] = profileData[field];
        }
      }
    }

    if (Object.keys(userFields).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: userFields });
    }

    if (Object.keys(profileFields).length > 0) {
      await prisma.profile.upsert({
        where: { userId },
        create: { userId, ...profileFields },
        update: profileFields,
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    return this._sanitizeUser(user);
  }

  async deleteAccount(userId, password) {
    const prisma = database.getClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestError('Password is incorrect');
    }

    await tokenService.revokeAllUserTokens(userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'DISABLED',
        deletedAt: new Date(),
      },
    });
  }

  async updateEmail(userId, newEmail, password) {
    const prisma = database.getClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestError('Password is incorrect');
    }

    const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictError('Email is already in use');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail, isEmailVerified: false },
    });

    const otp = await otpService.createOTP(newEmail, 'EMAIL_VERIFICATION', userId);

    try {
      await emailService.sendVerificationOTP(newEmail, otp);
    } catch (error) {
      logger.warn('Failed to send verification email for new email', {
        userId,
        error: error.message,
      });
    }
  }

  async getProfile(userId) {
    const prisma = database.getClient();
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return profile || {};
  }

  _sanitizeUser(user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}

module.exports = new AuthService();
