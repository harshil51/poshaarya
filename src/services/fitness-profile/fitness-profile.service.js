const database = require('../../config/database');

class FitnessProfileService {
  async get(userId) {
    const prisma = database.getClient();
    return prisma.fitnessProfile.findUnique({ where: { userId } });
  }

  async upsert(userId, data) {
    const prisma = database.getClient();

    const payload = { userId };
    if (data.currentHeightCm !== undefined) payload.currentHeightCm = data.currentHeightCm;
    if (data.currentWeightKg !== undefined) payload.currentWeightKg = data.currentWeightKg;
    if (data.targetWeightKg !== undefined) payload.targetWeightKg = data.targetWeightKg;
    if (data.activityLevel !== undefined) payload.activityLevel = data.activityLevel;
    if (data.fitnessGoals !== undefined) payload.fitnessGoals = data.fitnessGoals;
    if (data.bmr !== undefined) payload.bmr = data.bmr;
    if (data.tdee !== undefined) payload.tdee = data.tdee;

    return prisma.fitnessProfile.upsert({
      where: { userId },
      create: payload,
      update: payload,
    });
  }
}

module.exports = new FitnessProfileService();
