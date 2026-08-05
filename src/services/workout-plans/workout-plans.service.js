const database = require('../../config/database');
const { NotFoundError } = require('../../errors');

class WorkoutPlansService {
  async create(userId, data) {
    const prisma = database.getClient();
    return prisma.workoutPlan.create({
      data: {
        userId,
        name: data.name,
        description: data.description || null,
        level: data.level || null,
        goal: data.goal || null,
        durationWeeks: data.durationWeeks || 4,
        isPremium: data.isPremium || false,
      },
    });
  }

  async getAll(userId) {
    const prisma = database.getClient();
    return prisma.workoutPlan.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id, userId) {
    const prisma = database.getClient();
    const plan = await prisma.workoutPlan.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        workoutWeeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            workoutDays: {
              orderBy: { dayNumber: 'asc' },
              include: {
                workoutExercises: {
                  orderBy: { sortOrder: 'asc' },
                  include: { exercise: true },
                },
              },
            },
          },
        },
      },
    });
    if (!plan) throw new NotFoundError('Workout plan not found');
    return plan;
  }

  async update(id, userId, data) {
    const prisma = database.getClient();
    const existing = await prisma.workoutPlan.findFirst({ where: { id, userId, deletedAt: null } });
    if (!existing) throw new NotFoundError('Workout plan not found');
    return prisma.workoutPlan.update({ where: { id }, data });
  }

  async delete(id, userId) {
    const prisma = database.getClient();
    const existing = await prisma.workoutPlan.findFirst({ where: { id, userId, deletedAt: null } });
    if (!existing) throw new NotFoundError('Workout plan not found');
    await prisma.workoutPlan.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async addWeek(planId, data) {
    const prisma = database.getClient();
    return prisma.workoutWeek.create({ data: { workoutPlanId: planId, ...data } });
  }

  async updateWeek(weekId, data) {
    const prisma = database.getClient();
    const existing = await prisma.workoutWeek.findUnique({ where: { id: weekId } });
    if (!existing) throw new NotFoundError('Week not found');
    return prisma.workoutWeek.update({ where: { id: weekId }, data });
  }

  async removeWeek(weekId) {
    const prisma = database.getClient();
    const existing = await prisma.workoutWeek.findUnique({ where: { id: weekId } });
    if (!existing) throw new NotFoundError('Week not found');
    await prisma.workoutWeek.delete({ where: { id: weekId } });
  }

  async addDay(weekId, data) {
    const prisma = database.getClient();
    return prisma.workoutDay.create({ data: { workoutWeekId: weekId, ...data } });
  }

  async updateDay(dayId, data) {
    const prisma = database.getClient();
    const existing = await prisma.workoutDay.findUnique({ where: { id: dayId } });
    if (!existing) throw new NotFoundError('Day not found');
    return prisma.workoutDay.update({ where: { id: dayId }, data });
  }

  async removeDay(dayId) {
    const prisma = database.getClient();
    const existing = await prisma.workoutDay.findUnique({ where: { id: dayId } });
    if (!existing) throw new NotFoundError('Day not found');
    await prisma.workoutDay.delete({ where: { id: dayId } });
  }

  async addExercise(dayId, data) {
    const prisma = database.getClient();
    return prisma.workoutExercise.create({ data: { workoutDayId: dayId, ...data } });
  }

  async removeExercise(exerciseId) {
    const prisma = database.getClient();
    const existing = await prisma.workoutExercise.findUnique({ where: { id: exerciseId } });
    if (!existing) throw new NotFoundError('Exercise not found');
    await prisma.workoutExercise.delete({ where: { id: exerciseId } });
  }

  async getWeeks(planId) {
    const prisma = database.getClient();
    return prisma.workoutWeek.findMany({
      where: { workoutPlanId: planId },
      orderBy: { weekNumber: 'asc' },
    });
  }
}

module.exports = new WorkoutPlansService();
