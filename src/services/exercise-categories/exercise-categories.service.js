const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');

class ExerciseCategoriesService {
  async create(data) {
    const prisma = database.getClient();
    const existing = await prisma.exerciseCategory.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictError('A category with this slug already exists');
    return prisma.exerciseCategory.create({ data });
  }

  async getAll() {
    const prisma = database.getClient();
    return prisma.exerciseCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async getById(id) {
    const prisma = database.getClient();
    const item = await prisma.exerciseCategory.findUnique({ where: { id } });
    if (!item) throw new NotFoundError('Exercise category not found');
    return item;
  }

  async update(id, data) {
    const prisma = database.getClient();
    const existing = await prisma.exerciseCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Exercise category not found');
    if (data.slug) {
      const slugExists = await prisma.exerciseCategory.findUnique({ where: { slug: data.slug } });
      if (slugExists && slugExists.id !== id) throw new ConflictError('A category with this slug already exists');
    }
    return prisma.exerciseCategory.update({ where: { id }, data });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.exerciseCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Exercise category not found');
    const exercises = await prisma.exercise.count({ where: { categoryId: id } });
    if (exercises > 0) throw new ConflictError('Cannot delete category with associated exercises');
    await prisma.exerciseCategory.delete({ where: { id } });
  }
}

module.exports = new ExerciseCategoriesService();
