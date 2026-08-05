const express = require('express');
const router = express.Router();

const fitnessProfileController = require('../../controllers/fitness-profile/fitness-profile.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { upsertFitnessProfileSchema } = require('../../validators/fitness-profile/fitness-profile.validator');

router.use(authenticate);

router.get('/', fitnessProfileController.get);
router.put('/', validate(upsertFitnessProfileSchema), fitnessProfileController.upsert);

module.exports = router;
