const express = require('express');
const router = express.Router();

const userPreferencesController = require('../../controllers/user-preferences/user-preferences.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { updateUserPreferencesSchema } = require('../../validators/user-preferences/user-preferences.validator');

router.use(authenticate);

router.get('/', userPreferencesController.get);
router.put('/', validate(updateUserPreferencesSchema), userPreferencesController.upsert);

module.exports = router;
