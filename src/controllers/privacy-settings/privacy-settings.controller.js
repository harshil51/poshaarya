const privacySettingsService = require('../../services/privacy-settings/privacy-settings.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class PrivacySettingsController {
  get = asyncHandler(async (req, res) => {
    const settings = await privacySettingsService.get(req.user.id);
    return ApiResponse.success(res, { settings });
  });

  upsert = asyncHandler(async (req, res) => {
    const settings = await privacySettingsService.upsert(req.user.id, req.body);
    return ApiResponse.success(res, { settings }, 'Privacy settings updated');
  });
}

module.exports = new PrivacySettingsController();
