const express = require('express');
const router = express.Router();

const waterController = require('../../controllers/water/water.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createWaterLogSchema,
  updateWaterLogSchema,
  getWaterLogsQuerySchema,
  paramsIdSchema,
} = require('../../validators/water/water.validator');

router.use(authenticate);

router.get('/today', waterController.getTodayLogs);
router.get('/summary/daily', waterController.getDailySummary);
router.get('/summary/weekly', waterController.getWeeklySummary);
router.get('/', validate(getWaterLogsQuerySchema, 'query'), waterController.getLogs);
router.get('/:id', validate(paramsIdSchema, 'params'), waterController.getLogById);
router.post('/', validate(createWaterLogSchema), waterController.createLog);
router.patch('/:id', validate(updateWaterLogSchema), waterController.updateLog);
router.delete('/:id', waterController.deleteLog);

module.exports = router;
