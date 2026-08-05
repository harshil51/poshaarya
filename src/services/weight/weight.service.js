const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class WeightService {
  async createLog(userId, data) {
    const prisma = database.getClient();

    const logDate = data.date ? new Date(data.date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const log = await prisma.weightLog.create({
      data: {
        userId,
        weightKg: data.weightKg,
        source: data.source || null,
        logDate,
      },
    });

    return log;
  }

  async getLogs(userId, { startDate, endDate, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { userId };

    if (startDate && endDate) {
      where.logDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [logs, total] = await Promise.all([
      prisma.weightLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { logDate: 'desc' },
      }),
      prisma.weightLog.count({ where }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { logs, pagination };
  }

  async getLogById(logId, userId) {
    const prisma = database.getClient();

    const log = await prisma.weightLog.findFirst({
      where: { id: logId, userId },
    });

    if (!log) {
      throw new NotFoundError('Weight log not found');
    }

    return log;
  }

  async updateLog(logId, userId, data) {
    const prisma = database.getClient();

    const existing = await prisma.weightLog.findFirst({
      where: { id: logId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Weight log not found');
    }

    const updateData = {};
    if (data.weightKg !== undefined) updateData.weightKg = data.weightKg;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.date) {
      const logDate = new Date(data.date);
      logDate.setHours(0, 0, 0, 0);
      updateData.logDate = logDate;
    }

    const log = await prisma.weightLog.update({
      where: { id: logId },
      data: updateData,
    });

    return log;
  }

  async deleteLog(logId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.weightLog.findFirst({
      where: { id: logId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Weight log not found');
    }

    await prisma.weightLog.delete({ where: { id: logId } });
  }

  async getLatest(userId) {
    const prisma = database.getClient();

    const log = await prisma.weightLog.findFirst({
      where: { userId },
      orderBy: { logDate: 'desc' },
    });

    return log;
  }

  async getHistory(userId, limit = 30) {
    const prisma = database.getClient();

    const logs = await prisma.weightLog.findMany({
      where: { userId },
      orderBy: { logDate: 'desc' },
      take: limit,
    });

    return logs;
  }
}

module.exports = new WeightService();
