const express = require('express');
const router = express.Router();

const privacySettingsController = require('../../controllers/privacy-settings/privacy-settings.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { updatePrivacySettingsSchema } = require('../../validators/privacy-settings/privacy-settings.validator');

router.use(authenticate);

router.get('/', privacySettingsController.get);
router.put('/', validate(updatePrivacySettingsSchema), privacySettingsController.upsert);

module.exports = router;
