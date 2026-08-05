const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');
const { Helpers } = require('../../utils');

class SubscriptionService {
  async create(userId, data) {
    const prisma = database.getClient();

    return prisma.subscription.create({
      data: {
        userId,
        planId: data.planId,
        organizationId: data.organizationId || null,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null,
        stripeSubscriptionId: data.stripeSubscriptionId || null,
        razorpaySubscriptionId: data.razorpaySubscriptionId || null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
      },
      include: { plan: true },
    });
  }

  async getByUserId(userId) {
    const prisma = database.getClient();
    return prisma.subscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id) {
    const prisma = database.getClient();
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true, invoices: { orderBy: { createdAt: 'desc' } } },
    });
    if (!sub) throw new NotFoundError('Subscription not found');
    return sub;
  }

  async update(id, data) {
    const prisma = database.getClient();
    const existing = await prisma.subscription.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Subscription not found');

    const updateData = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.trialEndDate !== undefined) updateData.trialEndDate = data.trialEndDate ? new Date(data.trialEndDate) : null;
    if (data.cancelAtPeriodEnd !== undefined) updateData.cancelAtPeriodEnd = data.cancelAtPeriodEnd;
    if (data.stripeSubscriptionId !== undefined) updateData.stripeSubscriptionId = data.stripeSubscriptionId;
    if (data.razorpaySubscriptionId !== undefined) updateData.razorpaySubscriptionId = data.razorpaySubscriptionId;

    return prisma.subscription.update({ where: { id }, data: updateData, include: { plan: true } });
  }

  async cancel(id) {
    const prisma = database.getClient();
    const existing = await prisma.subscription.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Subscription not found');

    return prisma.subscription.update({
      where: { id },
      data: { status: 'CANCELLED', cancelAtPeriodEnd: true },
      include: { plan: true },
    });
  }

  // ─── Plans ───
  async getPlans() {
    const prisma = database.getClient();
    return prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async getPlanById(planId) {
    const prisma = database.getClient();
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundError('Plan not found');
    return plan;
  }
}

module.exports = new SubscriptionService();
