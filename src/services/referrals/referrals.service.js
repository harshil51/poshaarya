const crypto = require('crypto');
const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');

class ReferralsService {
  async getOrCreateCode(userId) {
    const prisma = database.getClient();
    let referral = await prisma.referral.findUnique({ where: { userId } });
    if (!referral) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      referral = await prisma.referral.create({
        data: { userId, referralCode: code },
      });
    }
    return referral;
  }

  async getStats(userId) {
    const prisma = database.getClient();
    const referral = await prisma.referral.findUnique({
      where: { userId },
      include: {
        referralHistory: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!referral) {
      return { referralCode: null, totalReferred: 0, totalRewardsEarned: 0, history: [] };
    }
    return referral;
  }

  async redeem(code, referredUserId) {
    const prisma = database.getClient();
    const referral = await prisma.referral.findUnique({ where: { referralCode: code } });
    if (!referral) throw new NotFoundError('Invalid referral code');
    if (referral.userId === referredUserId) throw new ConflictError('Cannot refer yourself');

    const existing = await prisma.referralHistory.findUnique({
      where: { referredUserId },
    });
    if (existing) throw new ConflictError('User has already been referred');

    const history = await prisma.referralHistory.create({
      data: {
        referralId: referral.id,
        referredUserId,
        freePremiumDays: 7,
        status: 'PENDING',
      },
    });

    await prisma.referral.update({
      where: { id: referral.id },
      data: { totalReferred: { increment: 1 } },
    });

    return history;
  }

  async getHistory(userId) {
    const prisma = database.getClient();
    const referral = await prisma.referral.findUnique({ where: { userId } });
    if (!referral) return [];
    return prisma.referralHistory.findMany({
      where: { referralId: referral.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new ReferralsService();
