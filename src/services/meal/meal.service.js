const database = require('../../config/database');
const redisCache = require('../../config/redis');
const { NotFoundError } = require('../../errors');
const { Helpers } = require('../../utils');
const config = require('../../config/environment');

class MealService {
  _calculateMealTotals(items) {
    return items.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + Number(item.calories || 0),
        totalProtein: acc.totalProtein + Number(item.protein || 0),
        totalCarbs: acc.totalCarbs + Number(item.carbs || 0),
        totalFat: acc.totalFat + Number(item.fat || 0),
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
  }

  async getMeals(userId, { date, startDate, endDate, mealType, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { userId, deletedAt: null };

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      where.mealDate = { gte: dayStart, lt: dayEnd };
    } else if (startDate && endDate) {
      where.mealDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (mealType) {
      where.mealType = mealType;
    }

    const [meals, total] = await Promise.all([
      prisma.meal.findMany({
        where,
        include: {
          mealItems: {
            include: {
              foodVersion: {
                include: { nutritionalInfo: true, food: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        skip,
        take: limit,
        orderBy: { mealDate: 'desc' },
      }),
      prisma.meal.count({ where }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { meals, pagination };
  }

  async getMealById(mealId, userId) {
    const prisma = database.getClient();

    const meal = await prisma.meal.findFirst({
      where: { id: mealId, userId, deletedAt: null },
      include: {
        mealItems: {
          include: {
            foodVersion: {
              include: { nutritionalInfo: true, food: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!meal) {
      throw new NotFoundError('Meal not found');
    }

    return meal;
  }

  async createMeal(userId, data) {
    const prisma = database.getClient();

    const mealDate = data.date ? new Date(data.date) : new Date();
    mealDate.setHours(0, 0, 0, 0);

    let mealItemsData = [];
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

    if (data.items && data.items.length > 0) {
      for (const itemData of data.items) {
        const calories = itemData.calories || 0;
        const protein = itemData.protein || 0;
        const carbs = itemData.carbs || 0;
        const fat = itemData.fat || 0;

        mealItemsData.push({
          foodVersionId: itemData.foodVersionId || null,
          recipeVersionId: itemData.recipeVersionId || null,
          quantity: itemData.quantity || 1,
          unit: itemData.unit || 'g',
          calories,
          protein,
          carbs,
          fat,
        });

        totalCalories += calories;
        totalProtein += protein;
        totalCarbs += carbs;
        totalFat += fat;
      }
    }

    const meal = await prisma.meal.create({
      data: {
        userId,
        mealType: data.mealType,
        mealDate,
        notes: data.notes || null,
        imageUrl: data.imageUrl || null,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        mealItems: mealItemsData.length > 0 ? { create: mealItemsData } : undefined,
      },
      include: {
        mealItems: {
          include: {
            foodVersion: {
              include: { nutritionalInfo: true, food: true },
            },
          },
        },
      },
    });

    if (config.cache.enabled) {
      await redisCache.delPattern('meal:*');
    }

    return meal;
  }

  async updateMeal(mealId, userId, data) {
    const prisma = database.getClient();

    const existing = await prisma.meal.findFirst({
      where: { id: mealId, userId, deletedAt: null },
      include: { mealItems: true },
    });

    if (!existing) {
      throw new NotFoundError('Meal not found');
    }

    const updateData = {};
    if (data.mealType !== undefined) updateData.mealType = data.mealType;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    if (data.date) {
      const mealDate = new Date(data.date);
      mealDate.setHours(0, 0, 0, 0);
      updateData.mealDate = mealDate;
    }

    if (data.items) {
      await prisma.mealItem.deleteMany({ where: { mealId } });

      if (data.items.length > 0) {
        const newItems = data.items.map((item) => ({
          mealId,
          foodVersionId: item.foodVersionId || null,
          recipeVersionId: item.recipeVersionId || null,
          quantity: item.quantity || 1,
          unit: item.unit || 'g',
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
        }));

        await prisma.mealItem.createMany({ data: newItems });
      }

      await this._recalculateMealTotals(mealId);
    }

    const meal = await prisma.meal.update({
      where: { id: mealId },
      data: updateData,
      include: {
        mealItems: {
          include: {
            foodVersion: {
              include: { nutritionalInfo: true, food: true },
            },
          },
        },
      },
    });

    if (config.cache.enabled) {
      await redisCache.delPattern('meal:*');
    }

    return meal;
  }

  async deleteMeal(mealId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.meal.findFirst({
      where: { id: mealId, userId, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundError('Meal not found');
    }

    // Soft delete
    await prisma.meal.update({
      where: { id: mealId },
      data: { deletedAt: new Date() },
    });

    if (config.cache.enabled) {
      await redisCache.delPattern('meal:*');
    }
  }

  async addItemToMeal(mealId, userId, data) {
    const prisma = database.getClient();

    const meal = await prisma.meal.findFirst({
      where: { id: mealId, userId, deletedAt: null },
    });

    if (!meal) {
      throw new NotFoundError('Meal not found');
    }

    const item = await prisma.mealItem.create({
      data: {
        mealId,
        foodVersionId: data.foodVersionId || null,
        recipeVersionId: data.recipeVersionId || null,
        quantity: data.quantity || 1,
        unit: data.unit || 'g',
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
      },
      include: {
        foodVersion: {
          include: { nutritionalInfo: true, food: true },
        },
      },
    });

    await this._recalculateMealTotals(mealId);

    return item;
  }

  async removeItemFromMeal(mealId, itemId, userId) {
    const prisma = database.getClient();

    const meal = await prisma.meal.findFirst({
      where: { id: mealId, userId, deletedAt: null },
    });

    if (!meal) {
      throw new NotFoundError('Meal not found');
    }

    const existingItem = await prisma.mealItem.findFirst({
      where: { id: itemId, mealId },
    });

    if (!existingItem) {
      throw new NotFoundError('Meal item not found');
    }

    await prisma.mealItem.delete({ where: { id: itemId } });

    await this._recalculateMealTotals(mealId);
  }

  async _recalculateMealTotals(mealId) {
    const prisma = database.getClient();

    const items = await prisma.mealItem.findMany({ where: { mealId } });
    const totals = this._calculateMealTotals(items);

    await prisma.meal.update({
      where: { id: mealId },
      data: totals,
    });

    if (config.cache.enabled) {
      await redisCache.del(`meal:${mealId}`);
    }
  }

  async getDailySummary(userId, date) {
    const prisma = database.getClient();

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const meals = await prisma.meal.findMany({
      where: { userId, mealDate: { gte: dayStart, lt: dayEnd }, deletedAt: null },
      include: {
        mealItems: {
          include: {
            foodVersion: { include: { nutritionalInfo: true, food: true } },
          },
        },
      },
      orderBy: { mealDate: 'asc' },
    });

    const summary = {
      date: dayStart.toISOString(),
      totalMeals: meals.length,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      mealsByType: {},
    };

    for (const meal of meals) {
      summary.totalCalories += Number(meal.totalCalories || 0);
      summary.totalProtein += Number(meal.totalProtein || 0);
      summary.totalCarbs += Number(meal.totalCarbs || 0);
      summary.totalFat += Number(meal.totalFat || 0);

      if (!summary.mealsByType[meal.mealType]) {
        summary.mealsByType[meal.mealType] = [];
      }
      summary.mealsByType[meal.mealType].push({
        id: meal.id,
        totalCalories: Number(meal.totalCalories || 0),
        totalProtein: Number(meal.totalProtein || 0),
        totalCarbs: Number(meal.totalCarbs || 0),
        totalFat: Number(meal.totalFat || 0),
        itemCount: meal.mealItems.length,
      });
    }

    return summary;
  }

  async getTodayMeals(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await this.getMeals(userId, { date: today.toISOString(), page: 1, limit: 50 });
    return result.meals;
  }

  async duplicateMeal(mealId, userId, targetDate) {
    const prisma = database.getClient();

    const source = await prisma.meal.findFirst({
      where: { id: mealId, userId, deletedAt: null },
      include: { mealItems: true },
    });

    if (!source) {
      throw new NotFoundError('Meal not found');
    }

    const mealDate = targetDate ? new Date(targetDate) : new Date();
    mealDate.setHours(0, 0, 0, 0);

    const meal = await prisma.meal.create({
      data: {
        userId,
        mealType: source.mealType,
        mealDate,
        notes: source.notes,
        imageUrl: source.imageUrl,
        totalCalories: source.totalCalories,
        totalProtein: source.totalProtein,
        totalCarbs: source.totalCarbs,
        totalFat: source.totalFat,
        mealItems: {
          create: source.mealItems.map((item) => ({
            foodVersionId: item.foodVersionId,
            recipeVersionId: item.recipeVersionId,
            quantity: item.quantity,
            unit: item.unit,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
          })),
        },
      },
      include: {
        mealItems: {
          include: {
            foodVersion: {
              include: { nutritionalInfo: true, food: true },
            },
          },
        },
      },
    });

    return meal;
  }
}

module.exports = new MealService();
