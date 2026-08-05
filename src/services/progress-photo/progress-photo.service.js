const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class ProgressPhotoService {
  async create(userId, data) {
    const prisma = database.getClient();
    const logDate = data.date ? new Date(data.date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    return prisma.progressPhoto.create({
      data: {
        userId, photoUrl: data.imageUrl || data.photoUrl,
        photoType: data.category || data.photoType || 'FRONT',
        notes: data.notes || null,
        weightKg: data.weightKg || null,
        logDate,
      },
    });
  }

  async getAll(userId, { category, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);
    const where = { userId };
    if (category) where.photoType = category;

    const [photos, total] = await Promise.all([
      prisma.progressPhoto.findMany({ where, skip, take: limit, orderBy: { logDate: 'desc' } }),
      prisma.progressPhoto.count({ where }),
    ]);
    return { photos, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async getById(photoId, userId) {
    const prisma = database.getClient();
    const photo = await prisma.progressPhoto.findFirst({ where: { id: photoId, userId } });
    if (!photo) throw new NotFoundError('Photo not found');
    return photo;
  }

  async update(photoId, userId, data) {
    const prisma = database.getClient();
    const existing = await prisma.progressPhoto.findFirst({ where: { id: photoId, userId } });
    if (!existing) throw new NotFoundError('Photo not found');

    const updateData = {};
    if (data.imageUrl !== undefined || data.photoUrl !== undefined) updateData.photoUrl = data.imageUrl || data.photoUrl;
    if (data.category !== undefined || data.photoType !== undefined) updateData.photoType = data.category || data.photoType;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.weightKg !== undefined) updateData.weightKg = data.weightKg;
    if (data.date) { const d = new Date(data.date); d.setHours(0, 0, 0, 0); updateData.logDate = d; }

    return prisma.progressPhoto.update({ where: { id: photoId }, data: updateData });
  }

  async delete(photoId, userId) {
    const prisma = database.getClient();
    const existing = await prisma.progressPhoto.findFirst({ where: { id: photoId, userId } });
    if (!existing) throw new NotFoundError('Photo not found');
    await prisma.progressPhoto.delete({ where: { id: photoId } });
  }
}

module.exports = new ProgressPhotoService();
