const database = require('../../config/database');

class UserPreferencesService {
  async get(userId) {
    const prisma = database.getClient();
    return prisma.userPreference.findUnique({ where: { userId } });
  }

  async upsert(userId, data) {
    const prisma = database.getClient();
    return prisma.userPreference.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}

module.exports = new UserPreferencesService();
