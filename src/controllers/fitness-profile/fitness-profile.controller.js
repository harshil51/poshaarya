const fitnessProfileService = require('../../services/fitness-profile/fitness-profile.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class FitnessProfileController {
  get = asyncHandler(async (req, res) => {
    const profile = await fitnessProfileService.get(req.user.id);
    return ApiResponse.success(res, { profile });
  });

  upsert = asyncHandler(async (req, res) => {
    const profile = await fitnessProfileService.upsert(req.user.id, req.body);
    return ApiResponse.success(res, { profile }, 'Fitness profile updated');
  });
}

module.exports = new FitnessProfileController();
