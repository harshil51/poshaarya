const database = require('../../config/database');
const redisCache = require('../../config/redis');
const { NotFoundError, ConflictError } = require('../../errors');
const { Helpers } = require('../../utils');
const config = require('../../config/environment');

class FoodService {
  async searchFoods({ query, categoryId, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { isVerified: true, deletedAt: null };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { brandName: { contains: query } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [foods, total] = await Promise.all([
      prisma.food.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          foodVersions: {
            where: { version: 1 },
            take: 1,
            include: { nutritionalInfo: true },
          },
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.food.count({ where }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { foods, pagination };
  }

  async getFoodById(foodId) {
    const prisma = database.getClient();
    const cacheKey = `food:${foodId}`;

    if (config.cache.enabled) {
      const cached = await redisCache.get(cacheKey);
      if (cached) return cached;
    }

    const food = await prisma.food.findUnique({
      where: { id: foodId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        foodVersions: {
          orderBy: { version: 'desc' },
          take: 1,
          include: { nutritionalInfo: true },
        },
      },
    });

    if (!food) {
      throw new NotFoundError('Food not found');
    }

    if (config.cache.enabled) {
      await redisCache.set(cacheKey, food);
    }

    return food;
  }

  async createFood(data, userId) {
    const prisma = database.getClient();

    const food = await prisma.food.create({
      data: {
        name: data.name,
        brandName: data.brandName || null,
        foodType: data.foodType || 'GENERIC',
        categoryId: data.categoryId || null,
        servingSize: data.servingSize || 100,
        servingUnit: data.servingUnit || 'g',
        imageUrl: data.imageUrl || null,
        userId: userId,
        createdBy: userId,
        foodVersions: {
          create: {
            version: 1,
            name: data.name,
            brandName: data.brandName || null,
            servingSize: data.servingSize || 100,
            servingUnit: data.servingUnit || 'g',
            nutritionalInfo: data.nutrition
              ? {
                  create: {
                    calories: data.nutrition.calories || 0,
                    protein: data.nutrition.protein || 0,
                    carbs: data.nutrition.carbs || 0,
                    fat: data.nutrition.fat || 0,
                    fiber: data.nutrition.fiber || null,
                    sugar: data.nutrition.sugar || null,
                    cholesterol: data.nutrition.cholesterol || null,
                    sodium: data.nutrition.sodium || null,
                    potassium: data.nutrition.potassium || null,
                    calcium: data.nutrition.calcium || null,
                    iron: data.nutrition.iron || null,
                  },
                }
              : undefined,
          },
        },
      },
      include: {
        category: true,
        foodVersions: { include: { nutritionalInfo: true } },
      },
    });

    if (config.cache.enabled) {
      await redisCache.delPattern('food:*');
    }

    return food;
  }

  async updateFood(foodId, data, userId) {
    const prisma = database.getClient();
    const existing = await prisma.food.findUnique({ where: { id: foodId } });

    if (!existing) {
      throw new NotFoundError('Food not found');
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.brandName !== undefined) updateData.brandName = data.brandName;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.servingSize !== undefined) updateData.servingSize = data.servingSize;
    if (data.servingUnit !== undefined) updateData.servingUnit = data.servingUnit;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.foodType !== undefined) updateData.foodType = data.foodType;
    updateData.updatedBy = userId;

    const food = await prisma.food.update({
      where: { id: foodId },
      data: updateData,
      include: {
        category: true,
        foodVersions: {
          orderBy: { version: 'desc' },
          take: 1,
          include: { nutritionalInfo: true },
        },
      },
    });

    if (config.cache.enabled) {
      await redisCache.del(`food:${foodId}`);
    }

    return food;
  }

  async deleteFood(foodId) {
    const prisma = database.getClient();
    const existing = await prisma.food.findUnique({ where: { id: foodId } });

    if (!existing) {
      throw new NotFoundError('Food not found');
    }

    // Soft delete
    await prisma.food.update({
      where: { id: foodId },
      data: { deletedAt: new Date() },
    });

    if (config.cache.enabled) {
      await redisCache.del(`food:${foodId}`);
    }
  }

  async getCategories() {
    const prisma = database.getClient();

    const categories = await prisma.foodCategory.findMany({
      where: { parentId: null },
      include: {
        _count: { select: { foods: true } },
        children: {
          include: { _count: { select: { foods: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  }

  async getCategoryById(categoryId) {
    const prisma = database.getClient();
    const category = await prisma.foodCategory.findUnique({
      where: { id: categoryId },
      include: {
        foods: {
          where: { isVerified: true, deletedAt: null },
          take: 50,
          orderBy: { name: 'asc' },
        },
        children: {
          include: { _count: { select: { foods: true } } },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  async getRecentFoods(userId, limit = 10) {
    const prisma = database.getClient();
    const recentMealItems = await prisma.mealItem.findMany({
      where: {
        meal: { userId },
        foodVersionId: { not: null },
      },
      include: {
        foodVersion: {
          include: { food: true, nutritionalInfo: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      distinct: ['foodVersionId'],
    });

    return recentMealItems
      .map((item) => item.foodVersion?.food)
      .filter(Boolean);
  }
}

module.exports = new FoodService();
