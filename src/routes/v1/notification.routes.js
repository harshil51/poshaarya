const express = require('express');
const router = express.Router();

const notificationController = require('../../controllers/notification/notification.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  getNotificationsQuerySchema,
  createNotificationSchema,
  paramsIdSchema,
} = require('../../validators/notification/notification.validator');

router.use(authenticate);

router.get('/unread-count', notificationController.getUnreadCount);
router.get('/', validate(getNotificationsQuerySchema, 'query'), notificationController.getNotifications);
router.post('/', validate(createNotificationSchema), notificationController.create);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
