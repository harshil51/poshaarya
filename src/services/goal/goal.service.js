const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class GoalService {
  async create(userId, data) {
    const prisma = database.getClient();

    const goal = await prisma.goal.create({
      data: {
        userId,
        goalType: data.goalType,
        targetValue: data.targetValue || null,
        currentValue: data.currentValue || 0,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        notes: data.notes || null,
      },
    });

    return goal;
  }

  async getGoals(userId, { goalType, isActive, isAchieved, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { userId };
    if (goalType) where.goalType = goalType;
    if (isActive !== undefined) where.isActive = isActive;
    if (isAchieved !== undefined) where.isAchieved = isAchieved;

    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
      }),
      prisma.goal.count({ where }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { goals, pagination };
  }

  async getGoalById(goalId, userId) {
    const prisma = database.getClient();

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundError('Goal not found');
    }

    return goal;
  }

  async updateGoal(goalId, userId, data) {
    const prisma = database.getClient();

    const existing = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Goal not found');
    }

    const updateData = {};
    if (data.goalType !== undefined) updateData.goalType = data.goalType;
    if (data.targetValue !== undefined) updateData.targetValue = data.targetValue;
    if (data.currentValue !== undefined) updateData.currentValue = data.currentValue;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.isAchieved !== undefined) {
      updateData.isAchieved = data.isAchieved;
      if (data.isAchieved) updateData.achievedAt = new Date();
      else updateData.achievedAt = null;
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
    });

    return goal;
  }

  async deleteGoal(goalId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Goal not found');
    }

    await prisma.goal.delete({ where: { id: goalId } });
  }

  async getActiveGoals(userId) {
    const prisma = database.getClient();

    const goals = await prisma.goal.findMany({
      where: { userId, isActive: true, isAchieved: false },
      orderBy: { startDate: 'desc' },
    });

    return goals;
  }

  async markAchieved(goalId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Goal not found');
    }

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: { isAchieved: true, achievedAt: new Date() },
    });

    return goal;
  }
}

module.exports = new GoalService();
