const database = require('../../config/database');

class HealthProfileService {
  async get(userId) {
    const prisma = database.getClient();
    return prisma.healthProfile.findUnique({ where: { userId } });
  }

  async upsert(userId, data) {
    const prisma = database.getClient();

    const payload = { userId };
    if (data.medicalConditions !== undefined) payload.medicalConditions = data.medicalConditions;
    if (data.allergies !== undefined) payload.allergies = data.allergies;
    if (data.medications !== undefined) payload.medications = data.medications;
    if (data.bloodGroup !== undefined) payload.bloodGroup = data.bloodGroup;
    if (data.dietaryPreferences !== undefined) payload.dietaryPreferences = data.dietaryPreferences;

    return prisma.healthProfile.upsert({
      where: { userId },
      create: payload,
      update: payload,
    });
  }
}

module.exports = new HealthProfileService();
