const express = require('express');
const router = express.Router();

const profileController = require('../../controllers/profile/profile.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { upsertProfileSchema } = require('../../validators/profile/profile.validator');

router.use(authenticate);

router.get('/', profileController.getProfile);
router.put('/', validate(upsertProfileSchema), profileController.upsertProfile);

module.exports = router;
