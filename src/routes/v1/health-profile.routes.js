const express = require('express');
const router = express.Router();

const healthProfileController = require('../../controllers/health-profile/health-profile.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { upsertHealthProfileSchema } = require('../../validators/health-profile/health-profile.validator');

router.use(authenticate);

router.get('/', healthProfileController.get);
router.put('/', validate(upsertHealthProfileSchema), healthProfileController.upsert);

module.exports = router;
