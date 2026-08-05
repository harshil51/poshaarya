const database = require('../../config/database');

class NotificationSettingsService {
  async get(userId) {
    const prisma = database.getClient();
    return prisma.notificationSetting.findUnique({ where: { userId } });
  }

  async upsert(userId, data) {
    const prisma = database.getClient();
    return prisma.notificationSetting.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}

module.exports = new NotificationSettingsService();
