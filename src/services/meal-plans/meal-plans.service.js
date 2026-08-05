const database = require('../../config/database');
const { NotFoundError } = require('../../errors');

class MealPlansService {
  async create(userId, data) {
    const prisma = database.getClient();
    const plan = await prisma.mealPlan.create({
      data: {
        userId,
        name: data.name,
        description: data.description || null,
        durationDays: data.durationDays,
        targetCalories: data.targetCalories || null,
        isPremium: data.isPremium || false,
        mealPlanVersions: {
          create: { version: 1 },
        },
      },
      include: { mealPlanVersions: true },
    });
    return plan;
  }

  async getAll(userId) {
    const prisma = database.getClient();
    return prisma.mealPlan.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id, userId) {
    const prisma = database.getClient();
    const plan = await prisma.mealPlan.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        mealPlanVersions: {
          orderBy: { version: 'desc' },
          include: {
            mealPlanDays: {
              orderBy: { dayNumber: 'asc' },
              include: {
                mealPlanItems: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
      },
    });
    if (!plan) throw new NotFoundError('Meal plan not found');
    return plan;
  }

  async update(id, userId, data) {
    const prisma = database.getClient();
    const existing = await prisma.mealPlan.findFirst({ where: { id, userId, deletedAt: null } });
    if (!existing) throw new NotFoundError('Meal plan not found');
    return prisma.mealPlan.update({ where: { id }, data });
  }

  async delete(id, userId) {
    const prisma = database.getClient();
    const existing = await prisma.mealPlan.findFirst({ where: { id, userId, deletedAt: null } });
    if (!existing) throw new NotFoundError('Meal plan not found');
    await prisma.mealPlan.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async createVersion(planId, userId, data) {
    const prisma = database.getClient();
    const plan = await prisma.mealPlan.findFirst({ where: { id: planId, userId, deletedAt: null } });
    if (!plan) throw new NotFoundError('Meal plan not found');

    const currentVersion = plan.currentVersion;
    const version = await prisma.mealPlanVersion.create({
      data: {
        mealPlanId: planId,
        version: currentVersion + 1,
        changeReason: data.changeReason || null,
      },
    });

    await prisma.mealPlan.update({ where: { id: planId }, data: { currentVersion: currentVersion + 1 } });
    return version;
  }

  async addDay(versionId, data) {
    const prisma = database.getClient();
    return prisma.mealPlanDay.create({ data: { mealPlanVersionId: versionId, ...data } });
  }

  async updateDay(dayId, data) {
    const prisma = database.getClient();
    const existing = await prisma.mealPlanDay.findUnique({ where: { id: dayId } });
    if (!existing) throw new NotFoundError('Day not found');
    return prisma.mealPlanDay.update({ where: { id: dayId }, data });
  }

  async removeDay(dayId) {
    const prisma = database.getClient();
    const existing = await prisma.mealPlanDay.findUnique({ where: { id: dayId } });
    if (!existing) throw new NotFoundError('Day not found');
    await prisma.mealPlanDay.delete({ where: { id: dayId } });
  }

  async addItem(dayId, data) {
    const prisma = database.getClient();
    return prisma.mealPlanItem.create({ data: { mealPlanDayId: dayId, ...data } });
  }

  async removeItem(itemId) {
    const prisma = database.getClient();
    const existing = await prisma.mealPlanItem.findUnique({ where: { id: itemId } });
    if (!existing) throw new NotFoundError('Item not found');
    await prisma.mealPlanItem.delete({ where: { id: itemId } });
  }

  async getVersions(planId, userId) {
    const prisma = database.getClient();
    const plan = await prisma.mealPlan.findFirst({ where: { id: planId, userId, deletedAt: null } });
    if (!plan) throw new NotFoundError('Meal plan not found');
    return prisma.mealPlanVersion.findMany({
      where: { mealPlanId: planId },
      orderBy: { version: 'desc' },
    });
  }

  async getVersionDays(versionId) {
    const prisma = database.getClient();
    const version = await prisma.mealPlanVersion.findUnique({
      where: { id: versionId },
      include: { mealPlan: { select: { userId: true } } },
    });
    if (!version) throw new NotFoundError('Version not found');
    return prisma.mealPlanDay.findMany({
      where: { mealPlanVersionId: versionId },
      orderBy: { dayNumber: 'asc' },
      include: { mealPlanItems: { orderBy: { sortOrder: 'asc' } } },
    });
  }
}

module.exports = new MealPlansService();
