const familyService = require('../../services/family/family.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class FamilyController {
  createGroup = asyncHandler(async (req, res) => {
    const group = await familyService.createGroup(req.user.id, req.body);
    return ApiResponse.created(res, { group }, 'Family group created');
  });

  getMyGroups = asyncHandler(async (req, res) => {
    const groups = await familyService.getMyGroups(req.user.id);
    return ApiResponse.success(res, { groups });
  });

  getGroupById = asyncHandler(async (req, res) => {
    const group = await familyService.getGroupById(req.params.id, req.user.id);
    return ApiResponse.success(res, { group });
  });

  updateGroup = asyncHandler(async (req, res) => {
    const group = await familyService.updateGroup(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { group }, 'Family group updated');
  });

  deleteGroup = asyncHandler(async (req, res) => {
    await familyService.deleteGroup(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Family group deleted');
  });

  addMember = asyncHandler(async (req, res) => {
    const member = await familyService.addMember(req.params.id, req.user.id, req.body);
    return ApiResponse.created(res, { member }, 'Member added');
  });

  removeMember = asyncHandler(async (req, res) => {
    await familyService.removeMember(req.params.id, req.user.id, req.params.userId);
    return ApiResponse.success(res, null, 'Member removed');
  });

  getMembers = asyncHandler(async (req, res) => {
    const members = await familyService.getMembers(req.params.id, req.user.id);
    return ApiResponse.success(res, { members });
  });
}

module.exports = new FamilyController();
