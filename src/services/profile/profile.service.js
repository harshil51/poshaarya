const database = require('../../config/database');
const { NotFoundError } = require('../../errors');

class ProfileService {
  async getProfile(userId) {
    const prisma = database.getClient();
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return profile;
  }

  async upsertProfile(userId, data) {
    const prisma = database.getClient();
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
    return profile;
  }
}

module.exports = new ProfileService();
