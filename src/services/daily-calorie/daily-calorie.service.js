const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class DailyCalorieService {
  async upsert(userId, data) {
    const prisma = database.getClient();
    const logDate = data.date ? new Date(data.date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const record = await prisma.dailyCalorie.upsert({
      where: { userId_date: { userId, date: logDate } },
      update: {
        consumedCalories: data.consumedCalories,
        burnedCalories: data.burnedCalories,
        netCalories: (data.consumedCalories || 0) - (data.burnedCalories || 0),
        proteinG: data.proteinG, carbsG: data.carbsG, fatG: data.fatG,
        fiberG: data.fiberG, sugarG: data.sugarG,
        waterMl: data.waterMl, isComplete: data.isComplete,
      },
      create: {
        userId, date: logDate,
        goalCalories: data.goalCalories || null,
        consumedCalories: data.consumedCalories || 0,
        burnedCalories: data.burnedCalories || 0,
        netCalories: (data.consumedCalories || 0) - (data.burnedCalories || 0),
        proteinG: data.proteinG || 0, carbsG: data.carbsG || 0, fatG: data.fatG || 0,
        fiberG: data.fiberG || 0, sugarG: data.sugarG || 0,
        waterMl: data.waterMl || 0, isComplete: data.isComplete || false,
      },
    });

    return record;
  }

  async getByDate(userId, date) {
    const prisma = database.getClient();
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const record = await prisma.dailyCalorie.findUnique({
      where: { userId_date: { userId, date: dayStart } },
    });
    return record;
  }

  async getRange(userId, { startDate, endDate, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);
    const where = { userId };

    if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const [records, total] = await Promise.all([
      prisma.dailyCalorie.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
      prisma.dailyCalorie.count({ where }),
    ]);
    return { records, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async delete(id, userId) {
    const prisma = database.getClient();
    const existing = await prisma.dailyCalorie.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Daily record not found');
    await prisma.dailyCalorie.delete({ where: { id } });
  }
}

module.exports = new DailyCalorieService();
