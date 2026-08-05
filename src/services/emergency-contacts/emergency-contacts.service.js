const database = require('../../config/database');
const { NotFoundError } = require('../../errors');

class EmergencyContactsService {
  async create(userId, data) {
    const prisma = database.getClient();
    return prisma.emergencyContact.create({
      data: { userId, ...data },
    });
  }

  async getAll(userId) {
    const prisma = database.getClient();
    return prisma.emergencyContact.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async getById(id, userId) {
    const prisma = database.getClient();
    const item = await prisma.emergencyContact.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundError('Emergency contact not found');
    return item;
  }

  async update(id, userId, data) {
    const prisma = database.getClient();
    const existing = await prisma.emergencyContact.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Emergency contact not found');
    return prisma.emergencyContact.update({ where: { id }, data });
  }

  async delete(id, userId) {
    const prisma = database.getClient();
    const existing = await prisma.emergencyContact.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Emergency contact not found');
    await prisma.emergencyContact.delete({ where: { id } });
  }
}

module.exports = new EmergencyContactsService();
