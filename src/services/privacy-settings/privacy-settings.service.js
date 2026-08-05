const database = require('../../config/database');

class PrivacySettingsService {
  async get(userId) {
    const prisma = database.getClient();
    return prisma.privacySetting.findUnique({ where: { userId } });
  }

  async upsert(userId, data) {
    const prisma = database.getClient();
    return prisma.privacySetting.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}

module.exports = new PrivacySettingsService();
