const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');

class TagsService {
  async create(data) {
    const prisma = database.getClient();
    const existing = await prisma.tag.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictError('A tag with this slug already exists');
    return prisma.tag.create({ data });
  }

  async getAll() {
    const prisma = database.getClient();
    return prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async getById(id) {
    const prisma = database.getClient();
    const item = await prisma.tag.findUnique({ where: { id } });
    if (!item) throw new NotFoundError('Tag not found');
    return item;
  }

  async update(id, data) {
    const prisma = database.getClient();
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Tag not found');
    if (data.slug) {
      const slugExists = await prisma.tag.findUnique({ where: { slug: data.slug } });
      if (slugExists && slugExists.id !== id) throw new ConflictError('A tag with this slug already exists');
    }
    return prisma.tag.update({ where: { id }, data });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Tag not found');
    await prisma.tag.delete({ where: { id } });
  }
}

module.exports = new TagsService();
