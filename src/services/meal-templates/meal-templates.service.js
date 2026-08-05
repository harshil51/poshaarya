const database = require('../../config/database');
const { NotFoundError } = require('../../errors');

class MealTemplatesService {
  async create(userId, data) {
    const prisma = database.getClient();
    return prisma.mealTemplate.create({ data: { userId, ...data } });
  }

  async getAll(userId) {
    const prisma = database.getClient();
    return prisma.mealTemplate.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async getById(id, userId) {
    const prisma = database.getClient();
    const item = await prisma.mealTemplate.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundError('Meal template not found');
    return item;
  }

  async update(id, userId, data) {
    const prisma = database.getClient();
    const existing = await prisma.mealTemplate.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Meal template not found');
    return prisma.mealTemplate.update({ where: { id }, data });
  }

  async delete(id, userId) {
    const prisma = database.getClient();
    const existing = await prisma.mealTemplate.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Meal template not found');
    await prisma.mealTemplate.delete({ where: { id } });
  }
}

module.exports = new MealTemplatesService();
