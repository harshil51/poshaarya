const express = require('express');
const router = express.Router();

const bodyMeasurementsController = require('../../controllers/body-measurements/body-measurements.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createBodyMeasurementSchema,
  updateBodyMeasurementSchema,
  querySchema,
  paramsIdSchema,
} = require('../../validators/body-measurements/body-measurements.validator');

router.use(authenticate);

router.get('/latest', bodyMeasurementsController.getLatest);
router.get('/history', bodyMeasurementsController.getHistory);
router.get('/', validate(querySchema, 'query'), bodyMeasurementsController.getAll);
router.get('/:id', validate(paramsIdSchema, 'params'), bodyMeasurementsController.getById);
router.post('/', validate(createBodyMeasurementSchema), bodyMeasurementsController.create);
router.patch('/:id', validate(updateBodyMeasurementSchema), bodyMeasurementsController.update);
router.delete('/:id', bodyMeasurementsController.delete);

module.exports = router;
