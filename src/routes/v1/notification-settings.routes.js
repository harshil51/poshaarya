const express = require('express');
const router = express.Router();

const notificationSettingsController = require('../../controllers/notification-settings/notification-settings.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { updateNotificationSettingsSchema } = require('../../validators/notification-settings/notification-settings.validator');

router.use(authenticate);

router.get('/', notificationSettingsController.get);
router.put('/', validate(updateNotificationSettingsSchema), notificationSettingsController.upsert);

module.exports = router;
