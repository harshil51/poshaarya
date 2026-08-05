const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class WaterService {
  async createLog(userId, data) {
    const prisma = database.getClient();

    const logDate = data.date ? new Date(data.date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const log = await prisma.waterLog.create({
      data: {
        userId,
        amountMl: data.amountMl || 200,
        date: logDate,
      },
    });

    return log;
  }

  async getLogs(userId, { date, startDate, endDate, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { userId };

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      where.date = { gte: dayStart, lt: dayEnd };
    } else if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [logs, total] = await Promise.all([
      prisma.waterLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.waterLog.count({ where }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { logs, pagination };
  }

  async getLogById(logId, userId) {
    const prisma = database.getClient();

    const log = await prisma.waterLog.findFirst({
      where: { id: logId, userId },
    });

    if (!log) {
      throw new NotFoundError('Water log not found');
    }

    return log;
  }

  async updateLog(logId, userId, data) {
    const prisma = database.getClient();

    const existing = await prisma.waterLog.findFirst({
      where: { id: logId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Water log not found');
    }

    const updateData = {};
    if (data.amountMl !== undefined) updateData.amountMl = data.amountMl;
    if (data.date) {
      const logDate = new Date(data.date);
      logDate.setHours(0, 0, 0, 0);
      updateData.date = logDate;
    }

    const log = await prisma.waterLog.update({
      where: { id: logId },
      data: updateData,
    });

    return log;
  }

  async deleteLog(logId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.waterLog.findFirst({
      where: { id: logId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Water log not found');
    }

    await prisma.waterLog.delete({ where: { id: logId } });
  }

  async getDailySummary(userId, date) {
    const prisma = database.getClient();

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const logs = await prisma.waterLog.findMany({
      where: { userId, date: { gte: dayStart, lt: dayEnd } },
      orderBy: { createdAt: 'asc' },
    });

    const totalMl = logs.reduce((sum, log) => sum + log.amountMl, 0);

    return {
      date: dayStart.toISOString(),
      totalMl,
      totalLiters: Math.round((totalMl / 1000) * 100) / 100,
      logs: logs.length,
      entries: logs,
    };
  }

  async getWeeklySummary(userId, endDate) {
    const prisma = database.getClient();

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const logs = await prisma.waterLog.findMany({
      where: { userId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    });

    const dailyBreakdown = {};
    let totalMl = 0;

    for (const log of logs) {
      const dayKey = log.date.toISOString().split('T')[0];
      if (!dailyBreakdown[dayKey]) {
        dailyBreakdown[dayKey] = { date: dayKey, totalMl: 0, entries: 0 };
      }
      dailyBreakdown[dayKey].totalMl += log.amountMl;
      dailyBreakdown[dayKey].entries++;
      totalMl += log.amountMl;
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      totalMl,
      totalLiters: Math.round((totalMl / 1000) * 100) / 100,
      averageDailyMl: logs.length > 0 ? Math.round(totalMl / 7) : 0,
      dailyBreakdown: Object.values(dailyBreakdown),
    };
  }
}

module.exports = new WaterService();
