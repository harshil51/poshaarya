const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/daily-calorie/daily-calorie.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { upsertDailyCalorieSchema, dateQuerySchema, paramsIdSchema } = require('../../validators/daily-calorie/daily-calorie.validator');

router.use(authenticate);

router.get('/daily', validate(dateQuerySchema, 'query'), ctrl.getByDate);
router.get('/range', validate(dateQuerySchema, 'query'), ctrl.getRange);
router.put('/upsert', validate(upsertDailyCalorieSchema), ctrl.upsert);
router.delete('/:id', validate(paramsIdSchema, 'params'), ctrl.delete);

module.exports = router;
