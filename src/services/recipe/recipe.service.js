const database = require('../../config/database');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');

class RecipeService {
  async create(data, userId) {
    const prisma = database.getClient();

    return prisma.recipe.create({
      data: {
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        prepTimeMinutes: data.prepTimeMinutes || null,
        cookTimeMinutes: data.cookTimeMinutes || null,
        servings: data.servings || 1,
        userId: userId,
        createdBy: userId,
        recipeVersions: {
          create: {
            version: 1,
            name: data.name,
            description: data.description || null,
            prepTimeMinutes: data.prepTimeMinutes || null,
            cookTimeMinutes: data.cookTimeMinutes || null,
            servings: data.servings || 1,
          },
        },
      },
      include: { recipeVersions: true },
    });
  }

  async search({ query, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);
    const where = { deletedAt: null };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
      ];
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.recipe.count({ where }),
    ]);
    return { recipes, pagination: Helpers.buildPaginationMeta(total, page, limit) };
  }

  async getById(id) {
    const prisma = database.getClient();
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        recipeVersions: {
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            recipeIngredients: {
              include: { foodVersion: { include: { food: true, nutritionalInfo: true } } },
              orderBy: { sortOrder: 'asc' },
            },
            recipeSteps: { orderBy: { stepNumber: 'asc' } },
          },
        },
      },
    });
    if (!recipe) throw new NotFoundError('Recipe not found');
    return recipe;
  }

  async update(id, data) {
    const prisma = database.getClient();
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Recipe not found');

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.prepTimeMinutes !== undefined) updateData.prepTimeMinutes = data.prepTimeMinutes;
    if (data.cookTimeMinutes !== undefined) updateData.cookTimeMinutes = data.cookTimeMinutes;
    if (data.servings !== undefined) updateData.servings = data.servings;
    if (data.isVerified !== undefined) updateData.isVerified = data.isVerified;

    return prisma.recipe.update({ where: { id }, data: updateData });
  }

  async delete(id) {
    const prisma = database.getClient();
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Recipe not found');
    // Soft delete
    await prisma.recipe.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

module.exports = new RecipeService();
