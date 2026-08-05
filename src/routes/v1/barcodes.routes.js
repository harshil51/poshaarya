const express = require('express');
const router = express.Router();

const barcodesController = require('../../controllers/barcodes/barcodes.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createBarcodeSchema,
  paramsIdSchema,
  lookupSchema,
} = require('../../validators/barcodes/barcodes.validator');

router.get('/:barcode', barcodesController.lookup);

router.use(authenticate);
router.post('/', validate(createBarcodeSchema), barcodesController.create);
router.delete('/:id', validate(paramsIdSchema, 'params'), barcodesController.delete);

module.exports = router;
