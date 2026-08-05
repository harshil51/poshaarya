const database = require('../../config/database');
const { NotFoundError, ConflictError, ForbiddenError } = require('../../errors');

class FamilyService {
  async createGroup(userId, data) {
    const prisma = database.getClient();
    const group = await prisma.familyGroup.create({
      data: {
        billingOwnerId: userId,
        name: data.name,
        familyMembers: {
          create: { userId, role: 'PARENT' },
        },
      },
      include: { familyMembers: true },
    });
    return group;
  }

  async getMyGroups(userId) {
    const prisma = database.getClient();
    return prisma.familyGroup.findMany({
      where: {
        familyMembers: { some: { userId } },
      },
      include: {
        familyMembers: {
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        },
      },
    });
  }

  async getGroupById(id, userId) {
    const prisma = database.getClient();
    const group = await prisma.familyGroup.findUnique({
      where: { id },
      include: {
        familyMembers: {
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        },
      },
    });
    if (!group) throw new NotFoundError('Family group not found');
    const isMember = group.familyMembers.some(m => m.userId === userId);
    if (!isMember) throw new ForbiddenError('You are not a member of this family group');
    return group;
  }

  async updateGroup(id, userId, data) {
    const prisma = database.getClient();
    const group = await prisma.familyGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundError('Family group not found');
    if (group.billingOwnerId !== userId) throw new ForbiddenError('Only the billing owner can update the group');
    return prisma.familyGroup.update({ where: { id }, data });
  }

  async deleteGroup(id, userId) {
    const prisma = database.getClient();
    const group = await prisma.familyGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundError('Family group not found');
    if (group.billingOwnerId !== userId) throw new ForbiddenError('Only the billing owner can delete the group');
    await prisma.familyGroup.delete({ where: { id } });
  }

  async addMember(groupId, userId, data) {
    const prisma = database.getClient();
    const group = await prisma.familyGroup.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundError('Family group not found');

    const existing = await prisma.familyMember.findUnique({
      where: { familyGroupId_userId: { familyGroupId: groupId, userId: data.userId } },
    });
    if (existing) throw new ConflictError('User is already a member of this group');

    return prisma.familyMember.create({
      data: {
        familyGroupId: groupId,
        userId: data.userId,
        role: data.role || 'MEMBER',
      },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
  }

  async removeMember(groupId, userId, memberUserId) {
    const prisma = database.getClient();
    const group = await prisma.familyGroup.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundError('Family group not found');
    if (group.billingOwnerId === memberUserId) throw new ConflictError('Cannot remove the billing owner');

    const member = await prisma.familyMember.findUnique({
      where: { familyGroupId_userId: { familyGroupId: groupId, userId: memberUserId } },
    });
    if (!member) throw new NotFoundError('Member not found in this group');

    await prisma.familyMember.delete({
      where: { familyGroupId_userId: { familyGroupId: groupId, userId: memberUserId } },
    });
  }

  async getMembers(groupId, userId) {
    const prisma = database.getClient();
    const group = await prisma.familyGroup.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundError('Family group not found');
    const isMember = await prisma.familyMember.findUnique({
      where: { familyGroupId_userId: { familyGroupId: groupId, userId } },
    });
    if (!isMember) throw new ForbiddenError('You are not a member of this family group');

    return prisma.familyMember.findMany({
      where: { familyGroupId: groupId },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
  }
}

module.exports = new FamilyService();
