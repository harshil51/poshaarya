const notificationSettingsService = require('../../services/notification-settings/notification-settings.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class NotificationSettingsController {
  get = asyncHandler(async (req, res) => {
    const settings = await notificationSettingsService.get(req.user.id);
    return ApiResponse.success(res, { settings });
  });

  upsert = asyncHandler(async (req, res) => {
    const settings = await notificationSettingsService.upsert(req.user.id, req.body);
    return ApiResponse.success(res, { settings }, 'Notification settings updated');
  });
}

module.exports = new NotificationSettingsController();
