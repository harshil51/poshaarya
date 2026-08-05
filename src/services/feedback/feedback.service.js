const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class FeedbackService {
  async create(userId, data) {
    const prisma = database.getClient();
    return prisma.feedback.create({
      data: {
        userId, rating: data.rating || 5,
        subject: data.subject || null, message: data.message,
        category: data.category || null,
      },
    });
  }

  async getAll({ page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } } },
      }),
      prisma.feedback.count(),
    ]);
    return { feedback, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async getMyFeedback(userId, { page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);
    const where = { userId };

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.feedback.count({ where }),
    ]);
    return { feedback, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async markRead(id) {
    const prisma = database.getClient();
    const existing = await prisma.feedback.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Feedback not found');
    return prisma.feedback.update({ where: { id }, data: { isRead: true } });
  }
}

module.exports = new FeedbackService();
