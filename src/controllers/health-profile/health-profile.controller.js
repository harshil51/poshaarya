const healthProfileService = require('../../services/health-profile/health-profile.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class HealthProfileController {
  get = asyncHandler(async (req, res) => {
    const profile = await healthProfileService.get(req.user.id);
    return ApiResponse.success(res, { profile });
  });

  upsert = asyncHandler(async (req, res) => {
    const profile = await healthProfileService.upsert(req.user.id, req.body);
    return ApiResponse.success(res, { profile }, 'Health profile updated');
  });
}

module.exports = new HealthProfileController();
