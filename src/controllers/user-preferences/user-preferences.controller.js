const userPreferencesService = require('../../services/user-preferences/user-preferences.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class UserPreferencesController {
  get = asyncHandler(async (req, res) => {
    const preferences = await userPreferencesService.get(req.user.id);
    return ApiResponse.success(res, { preferences });
  });

  upsert = asyncHandler(async (req, res) => {
    const preferences = await userPreferencesService.upsert(req.user.id, req.body);
    return ApiResponse.success(res, { preferences }, 'Preferences updated');
  });
}

module.exports = new UserPreferencesController();
