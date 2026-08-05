const express = require('express');
const router = express.Router();

const weightController = require('../../controllers/weight/weight.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createWeightLogSchema,
  updateWeightLogSchema,
  getWeightLogsQuerySchema,
  paramsIdSchema,
} = require('../../validators/weight/weight.validator');

router.use(authenticate);

router.get('/latest', weightController.getLatest);
router.get('/history', weightController.getHistory);
router.get('/', validate(getWeightLogsQuerySchema, 'query'), weightController.getLogs);
router.get('/:id', validate(paramsIdSchema, 'params'), weightController.getLogById);
router.post('/', validate(createWeightLogSchema), weightController.createLog);
router.patch('/:id', validate(updateWeightLogSchema), weightController.updateLog);
router.delete('/:id', weightController.deleteLog);

module.exports = router;
