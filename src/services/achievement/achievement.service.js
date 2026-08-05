const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');
const { Helpers } = require('../../utils');

class AchievementService {
  async create(data) {
    const prisma = database.getClient();
    const slug = Helpers.generateSlug(data.name);

    const existing = await prisma.achievement.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Achievement with this name already exists');

    return prisma.achievement.create({
      data: {
        name: data.name, slug,
        description: data.description || null,
        iconUrl: data.iconUrl || null,
        category: data.category,
        criteria: data.criteria || null,
        points: data.points || 0,
      },
    });
  }

  async getAll({ category, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);
    const where = {};
    if (category) where.category = category;

    const [achievements, total] = await Promise.all([
      prisma.achievement.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      prisma.achievement.count({ where }),
    ]);
    return { achievements, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async getById(id) {
    const prisma = database.getClient();
    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) throw new NotFoundError('Achievement not found');
    return achievement;
  }

  async update(id, data) {
    const prisma = database.getClient();
    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Achievement not found');

    const updateData = {};
    if (data.name) updateData.slug = Helpers.generateSlug(data.name);
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.criteria !== undefined) updateData.criteria = data.criteria;
    if (data.points !== undefined) updateData.points = data.points;

    return prisma.achievement.update({ where: { id }, data: updateData });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Achievement not found');
    await prisma.achievement.delete({ where: { id } });
  }

  // ─── User Achievement Progress ───

  async getUserAchievements(userId) {
    const prisma = database.getClient();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { createdAt: 'desc' },
    });
    return userAchievements;
  }

  async updateProgress(userId, achievementId, progress) {
    const prisma = database.getClient();

    const achievement = await prisma.achievement.findUnique({ where: { id: achievementId } });
    if (!achievement) throw new NotFoundError('Achievement not found');

    const isAchieved = progress >= 100;

    const userAchievement = await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId, achievementId } },
      update: {
        progress,
        isAchieved,
        achievedAt: isAchieved ? new Date() : null,
      },
      create: {
        userId, achievementId, progress, isAchieved,
        achievedAt: isAchieved ? new Date() : null,
      },
      include: { achievement: true },
    });

    return userAchievement;
  }

  async getUnlocked(userId) {
    const prisma = database.getClient();
    return prisma.userAchievement.findMany({
      where: { userId, isAchieved: true },
      include: { achievement: true },
      orderBy: { achievedAt: 'desc' },
    });
  }
}

module.exports = new AchievementService();
