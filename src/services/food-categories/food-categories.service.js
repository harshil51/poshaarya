const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');

class FoodCategoriesService {
  async create(data) {
    const prisma = database.getClient();
    const existing = await prisma.foodCategory.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictError('A category with this slug already exists');
    return prisma.foodCategory.create({ data });
  }

  async getAll() {
    const prisma = database.getClient();
    return prisma.foodCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async getTree() {
    const prisma = database.getClient();
    const all = await prisma.foodCategory.findMany({ orderBy: { name: 'asc' } });
    const map = {};
    const roots = [];
    all.forEach(c => { map[c.id] = { ...c, children: [] }; });
    all.forEach(c => {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].children.push(map[c.id]);
      } else if (!c.parentId) {
        roots.push(map[c.id]);
      }
    });
    return roots;
  }

  async getById(id) {
    const prisma = database.getClient();
    const item = await prisma.foodCategory.findUnique({ where: { id } });
    if (!item) throw new NotFoundError('Food category not found');
    return item;
  }

  async update(id, data) {
    const prisma = database.getClient();
    const existing = await prisma.foodCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Food category not found');
    if (data.slug) {
      const slugExists = await prisma.foodCategory.findUnique({ where: { slug: data.slug } });
      if (slugExists && slugExists.id !== id) throw new ConflictError('A category with this slug already exists');
    }
    return prisma.foodCategory.update({ where: { id }, data });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.foodCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Food category not found');
    const children = await prisma.foodCategory.count({ where: { parentId: id } });
    if (children > 0) throw new ConflictError('Cannot delete category with subcategories');
    await prisma.foodCategory.delete({ where: { id } });
  }
}

module.exports = new FoodCategoriesService();
