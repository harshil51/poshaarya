const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class BodyMeasurementsService {
  async create(userId, data) {
    const prisma = database.getClient();
    const logDate = data.date ? new Date(data.date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const measurement = await prisma.bodyMeasurement.create({
      data: {
        userId,
        logDate,
        chestCm: data.chestCm || null,
        waistCm: data.waistCm || null,
        hipsCm: data.hipsCm || null,
        armsCm: data.armsCm || null,
        thighsCm: data.thighsCm || null,
        bodyFatPercentage: data.bodyFatPercentage || null,
      },
    });
    return measurement;
  }

  async getAll(userId, { startDate, endDate, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { userId };
    if (startDate && endDate) {
      where.logDate = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const [items, total] = await Promise.all([
      prisma.bodyMeasurement.findMany({ where, skip, take: limit, orderBy: { logDate: 'desc' } }),
      prisma.bodyMeasurement.count({ where }),
    ]);

    return { items, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async getById(id, userId) {
    const prisma = database.getClient();
    const item = await prisma.bodyMeasurement.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundError('Body measurement not found');
    return item;
  }

  async update(id, userId, data) {
    const prisma = database.getClient();
    const existing = await prisma.bodyMeasurement.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Body measurement not found');

    const updateData = {};
    if (data.chestCm !== undefined) updateData.chestCm = data.chestCm;
    if (data.waistCm !== undefined) updateData.waistCm = data.waistCm;
    if (data.hipsCm !== undefined) updateData.hipsCm = data.hipsCm;
    if (data.armsCm !== undefined) updateData.armsCm = data.armsCm;
    if (data.thighsCm !== undefined) updateData.thighsCm = data.thighsCm;
    if (data.bodyFatPercentage !== undefined) updateData.bodyFatPercentage = data.bodyFatPercentage;
    if (data.date) {
      const d = new Date(data.date);
      d.setHours(0, 0, 0, 0);
      updateData.logDate = d;
    }

    return prisma.bodyMeasurement.update({ where: { id }, data: updateData });
  }

  async delete(id, userId) {
    const prisma = database.getClient();
    const existing = await prisma.bodyMeasurement.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Body measurement not found');
    await prisma.bodyMeasurement.delete({ where: { id } });
  }

  async getLatest(userId) {
    const prisma = database.getClient();
    return prisma.bodyMeasurement.findFirst({ where: { userId }, orderBy: { logDate: 'desc' } });
  }

  async getHistory(userId, limit = 30) {
    const prisma = database.getClient();
    return prisma.bodyMeasurement.findMany({ where: { userId }, orderBy: { logDate: 'desc' }, take: limit });
  }
}

module.exports = new BodyMeasurementsService();
