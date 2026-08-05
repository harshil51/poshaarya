const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class ContactService {
  async create(data, userId) {
    const prisma = database.getClient();
    return prisma.contactMessage.create({
      data: {
        userId: userId || null,
        name: data.name, email: data.email,
        phone: data.phone || null,
        subject: data.subject, message: data.message,
      },
    });
  }

  async getAll({ page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.contactMessage.count(),
    ]);
    return { messages, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async getById(id) {
    const prisma = database.getClient();
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new NotFoundError('Message not found');
    return message;
  }

  async markRead(id) {
    const prisma = database.getClient();
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Message not found');
    return prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Message not found');
    await prisma.contactMessage.delete({ where: { id } });
  }
}

module.exports = new ContactService();
