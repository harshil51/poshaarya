const profileService = require('../../services/profile/profile.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class ProfileController {
  getProfile = asyncHandler(async (req, res) => {
    const profile = await profileService.getProfile(req.user.id);
    return ApiResponse.success(res, { profile });
  });

  upsertProfile = asyncHandler(async (req, res) => {
    const profile = await profileService.upsertProfile(req.user.id, req.body);
    return ApiResponse.success(res, { profile }, 'Profile updated');
  });
}

module.exports = new ProfileController();
