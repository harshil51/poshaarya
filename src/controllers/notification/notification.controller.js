const notificationService = require('../../services/notification/notification.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class NotificationController {
  create = asyncHandler(async (req, res) => {
    const notification = await notificationService.create(req.user.id, req.body);
    return ApiResponse.created(res, { notification }, 'Notification created');
  });

  getNotifications = asyncHandler(async (req, res) => {
    const { isRead, type, page, limit } = req.query;
    const isReadBool = isRead !== undefined ? isRead === 'true' : undefined;
    const result = await notificationService.getNotifications(req.user.id, {
      isRead: isReadBool, type, page, limit,
    });
    return ApiResponse.paginated(res, result.notifications, result.pagination, undefined, { unreadCount: result.unreadCount });
  });

  markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return ApiResponse.success(res, { notification }, 'Notification marked as read');
  });

  markAllAsRead = asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user.id);
    return ApiResponse.success(res, result);
  });

  deleteNotification = asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Notification deleted');
  });

  getUnreadCount = asyncHandler(async (req, res) => {
    const result = await notificationService.getUnreadCount(req.user.id);
    return ApiResponse.success(res, result);
  });
}

module.exports = new NotificationController();
