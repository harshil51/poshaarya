const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('../../config/environment');
const database = require('../../config/database');
const { BadRequestError, NotFoundError } = require('../../errors');
const { v4: uuidv4 } = require('uuid');

class OTPService {
  generateOTP() {
    const digits = config.otp.digits || 6;
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const otp = crypto.randomInt(min, max + 1).toString();
    return otp;
  }

  async createOTP(email, type = 'EMAIL_VERIFICATION', userId = null) {
    const prisma = database.getClient();
    const otp = this.generateOTP();
    const expiresAt = new Date(
      Date.now() + (config.otp.expiryMinutes || 10) * 60 * 1000
    );

    // Store OTP hash for security (the DB column is otp_hash)
    const otpHash = await bcrypt.hash(otp, 6);

    await prisma.authOtp.create({
      data: {
        id: uuidv4(),
        userId,
        identifier: email,
        otpHash,
        purpose: type,
        expiresAt,
      },
    });

    return otp;
  }

  async verifyOTP(email, otp, type = 'EMAIL_VERIFICATION') {
    const prisma = database.getClient();

    // Find recent unused OTPs for this identifier and purpose
    const records = await prisma.authOtp.findMany({
      where: {
        identifier: email,
        purpose: type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (records.length === 0) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    // Check OTP hash against each record
    let matchedRecord = null;
    for (const record of records) {
      const isMatch = await bcrypt.compare(otp, record.otpHash);
      if (isMatch) {
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord) {
      throw new BadRequestError('Invalid or expired OTP');
    }

    await prisma.authOtp.update({
      where: { id: matchedRecord.id },
      data: { isUsed: true },
    });

    return matchedRecord;
  }

  async invalidatePreviousOTPs(email, type) {
    const prisma = database.getClient();
    await prisma.authOtp.updateMany({
      where: {
        identifier: email,
        purpose: type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      data: { isUsed: true },
    });
  }
}

module.exports = new OTPService();
