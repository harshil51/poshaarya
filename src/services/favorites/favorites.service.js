const database = require('../../config/database');
const { NotFoundError, ConflictError } = require('../../errors');

class FavoritesService {
  async add(userId, foodId) {
    const prisma = database.getClient();
    const food = await prisma.food.findUnique({ where: { id: foodId } });
    if (!food) throw new NotFoundError('Food not found');

    const existing = await prisma.userFavoriteFood.findUnique({
      where: { userId_foodId: { userId, foodId } },
    });
    if (existing) throw new ConflictError('Food is already in favorites');

    return prisma.userFavoriteFood.create({ data: { userId, foodId } });
  }

  async remove(userId, foodId) {
    const prisma = database.getClient();
    const existing = await prisma.userFavoriteFood.findUnique({
      where: { userId_foodId: { userId, foodId } },
    });
    if (!existing) throw new NotFoundError('Favorite not found');
    await prisma.userFavoriteFood.delete({
      where: { userId_foodId: { userId, foodId } },
    });
  }

  async getAll(userId) {
    const prisma = database.getClient();
    return prisma.userFavoriteFood.findMany({
      where: { userId },
      include: { food: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new FavoritesService();
