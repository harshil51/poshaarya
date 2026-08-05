const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class NotificationService {
  async create(userId, data) {
    const prisma = database.getClient();

    const notification = await prisma.notification.create({
      data: {
        userId: data.userId || userId,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl || null,
      },
    });

    return notification;
  }

  async getNotifications(userId, { isRead, type, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { userId };
    if (isRead !== undefined) {
      where.status = isRead ? 'READ' : 'UNREAD';
    }
    if (type) where.type = type;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, status: 'UNREAD' } }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { notifications, pagination, unreadCount };
  }

  async markAsRead(notificationId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Notification not found');
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'READ' },
    });

    return notification;
  }

  async markAllAsRead(userId) {
    const prisma = database.getClient();

    await prisma.notification.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ' },
    });

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Notification not found');
    }

    await prisma.notification.delete({ where: { id: notificationId } });
  }

  async getUnreadCount(userId) {
    const prisma = database.getClient();

    const count = await prisma.notification.count({
      where: { userId, status: 'UNREAD' },
    });

    return { unreadCount: count };
  }
}

module.exports = new NotificationService();
