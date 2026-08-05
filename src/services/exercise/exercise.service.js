const database = require('../../config/database');
const redisCache = require('../../config/redis');
const { NotFoundError, ConflictError } = require('../../errors');
const { Helpers } = require('../../utils');
const config = require('../../config/environment');

class ExerciseService {
  async searchExercises({ query, categoryId, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { isVerified: true, deletedAt: null };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.exercise.count({ where }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { exercises, pagination };
  }

  async getExerciseById(exerciseId) {
    const prisma = database.getClient();
    const cacheKey = `exercise:${exerciseId}`;

    if (config.cache.enabled) {
      const cached = await redisCache.get(cacheKey);
      if (cached) return cached;
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { category: true },
    });

    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }

    if (config.cache.enabled) {
      await redisCache.set(cacheKey, exercise);
    }

    return exercise;
  }

  async createExercise(data, userId) {
    const prisma = database.getClient();

    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId || null,
        targetMuscleGroup: data.targetMuscleGroup || null,
        equipmentNeeded: data.equipmentNeeded || null,
        trackingType: data.trackingType || 'REPS_WEIGHT',
        videoUrl: data.videoUrl || null,
        imageUrl: data.imageUrl || null,
        userId: userId,
      },
      include: { category: true },
    });

    if (config.cache.enabled) {
      await redisCache.delPattern('exercise:*');
    }

    return exercise;
  }

  async updateExercise(exerciseId, data) {
    const prisma = database.getClient();

    const existing = await prisma.exercise.findUnique({ where: { id: exerciseId } });
    if (!existing) {
      throw new NotFoundError('Exercise not found');
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.targetMuscleGroup !== undefined) updateData.targetMuscleGroup = data.targetMuscleGroup;
    if (data.equipmentNeeded !== undefined) updateData.equipmentNeeded = data.equipmentNeeded;
    if (data.trackingType !== undefined) updateData.trackingType = data.trackingType;
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    const exercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: updateData,
      include: { category: true },
    });

    if (config.cache.enabled) {
      await redisCache.del(`exercise:${exerciseId}`);
    }

    return exercise;
  }

  async deleteExercise(exerciseId) {
    const prisma = database.getClient();

    const existing = await prisma.exercise.findUnique({ where: { id: exerciseId } });
    if (!existing) {
      throw new NotFoundError('Exercise not found');
    }

    // Soft delete
    await prisma.exercise.update({
      where: { id: exerciseId },
      data: { deletedAt: new Date() },
    });

    if (config.cache.enabled) {
      await redisCache.del(`exercise:${exerciseId}`);
    }
  }

  async getCategories() {
    const prisma = database.getClient();
    return prisma.exerciseCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { exercises: true } } },
    });
  }

  // ─── Exercise Logs ───

  async createLog(userId, data) {
    const prisma = database.getClient();

    const exercise = await prisma.exercise.findUnique({
      where: { id: data.exerciseId },
    });
    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }

    const logDate = data.date ? new Date(data.date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const log = await prisma.exerciseLog.create({
      data: {
        userId,
        exerciseId: data.exerciseId,
        logDate,
        sets: data.sets || null,
        reps: data.reps || null,
        weightKg: data.weightKg || null,
        durationSeconds: data.durationSeconds || null,
        distanceKm: data.distanceKm || null,
        caloriesBurned: data.caloriesBurned || null,
        notes: data.notes || null,
      },
      include: { exercise: true },
    });

    return log;
  }

  async getLogs(userId, { date, startDate, endDate, exerciseId, page = 1, limit = 20 }) {
    const prisma = database.getClient();
    const { skip } = Helpers.calculatePagination(page, limit);

    const where = { userId };

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      where.logDate = { gte: dayStart, lt: dayEnd };
    } else if (startDate && endDate) {
      where.logDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (exerciseId) {
      where.exerciseId = exerciseId;
    }

    const [logs, total] = await Promise.all([
      prisma.exerciseLog.findMany({
        where,
        include: { exercise: true },
        skip,
        take: limit,
        orderBy: { logDate: 'desc' },
      }),
      prisma.exerciseLog.count({ where }),
    ]);

    const pagination = Helpers.buildPaginationMeta(total, page, limit);
    return { logs, pagination };
  }

  async getLogById(logId, userId) {
    const prisma = database.getClient();

    const log = await prisma.exerciseLog.findFirst({
      where: { id: logId, userId },
      include: { exercise: true },
    });

    if (!log) {
      throw new NotFoundError('Exercise log not found');
    }

    return log;
  }

  async updateLog(logId, userId, data) {
    const prisma = database.getClient();

    const existing = await prisma.exerciseLog.findFirst({
      where: { id: logId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Exercise log not found');
    }

    const updateData = {};
    if (data.sets !== undefined) updateData.sets = data.sets;
    if (data.reps !== undefined) updateData.reps = data.reps;
    if (data.weightKg !== undefined) updateData.weightKg = data.weightKg;
    if (data.durationSeconds !== undefined) updateData.durationSeconds = data.durationSeconds;
    if (data.distanceKm !== undefined) updateData.distanceKm = data.distanceKm;
    if (data.caloriesBurned !== undefined) updateData.caloriesBurned = data.caloriesBurned;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.date) {
      const logDate = new Date(data.date);
      logDate.setHours(0, 0, 0, 0);
      updateData.logDate = logDate;
    }

    const log = await prisma.exerciseLog.update({
      where: { id: logId },
      data: updateData,
      include: { exercise: true },
    });

    return log;
  }

  async deleteLog(logId, userId) {
    const prisma = database.getClient();

    const existing = await prisma.exerciseLog.findFirst({
      where: { id: logId, userId },
    });
    if (!existing) {
      throw new NotFoundError('Exercise log not found');
    }

    await prisma.exerciseLog.delete({ where: { id: logId } });
  }

  async getDailySummary(userId, date) {
    const prisma = database.getClient();

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const logs = await prisma.exerciseLog.findMany({
      where: { userId, logDate: { gte: dayStart, lt: dayEnd } },
      include: { exercise: true },
      orderBy: { createdAt: 'asc' },
    });

    const summary = {
      date: dayStart.toISOString(),
      totalLogs: logs.length,
      totalDurationSeconds: 0,
      totalCaloriesBurned: 0,
      totalDistanceKm: 0,
      exercises: [],
    };

    for (const log of logs) {
      if (log.durationSeconds) summary.totalDurationSeconds += log.durationSeconds;
      if (log.caloriesBurned) summary.totalCaloriesBurned += Number(log.caloriesBurned);
      if (log.distanceKm) summary.totalDistanceKm += Number(log.distanceKm);

      summary.exercises.push({
        id: log.id,
        exerciseId: log.exerciseId,
        exerciseName: log.exercise.name,
        sets: log.sets,
        reps: log.reps,
        weightKg: log.weightKg,
        durationSeconds: log.durationSeconds,
        caloriesBurned: log.caloriesBurned,
        distanceKm: log.distanceKm,
      });
    }

    return summary;
  }

  async getWeeklySummary(userId, endDate) {
    const prisma = database.getClient();

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const logs = await prisma.exerciseLog.findMany({
      where: { userId, logDate: { gte: start, lte: end } },
      include: { exercise: true },
      orderBy: { logDate: 'asc' },
    });

    const dailyBreakdown = {};
    let totalCalories = 0;
    let totalDuration = 0;
    let totalDistance = 0;
    let activeDays = new Set();

    for (const log of logs) {
      const dayKey = log.logDate.toISOString().split('T')[0];
      if (!dailyBreakdown[dayKey]) {
        dailyBreakdown[dayKey] = { date: dayKey, durationSeconds: 0, caloriesBurned: 0, distanceKm: 0, logCount: 0 };
      }

      if (log.durationSeconds) dailyBreakdown[dayKey].durationSeconds += log.durationSeconds;
      if (log.caloriesBurned) dailyBreakdown[dayKey].caloriesBurned += Number(log.caloriesBurned);
      if (log.distanceKm) dailyBreakdown[dayKey].distanceKm += Number(log.distanceKm);
      dailyBreakdown[dayKey].logCount++;

      if (log.caloriesBurned) totalCalories += Number(log.caloriesBurned);
      if (log.durationSeconds) totalDuration += log.durationSeconds;
      if (log.distanceKm) totalDistance += Number(log.distanceKm);
      activeDays.add(dayKey);
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      totalCaloriesBurned: totalCalories,
      totalDurationSeconds: totalDuration,
      totalDistanceKm: totalDistance,
      activeDays: activeDays.size,
      dailyBreakdown: Object.values(dailyBreakdown),
    };
  }
}

module.exports = new ExerciseService();
