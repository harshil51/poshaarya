const express = require('express');
const router = express.Router();

const emergencyContactsController = require('../../controllers/emergency-contacts/emergency-contacts.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createEmergencyContactSchema,
  updateEmergencyContactSchema,
  paramsIdSchema,
} = require('../../validators/emergency-contacts/emergency-contacts.validator');

router.use(authenticate);

router.get('/', emergencyContactsController.getAll);
router.get('/:id', validate(paramsIdSchema, 'params'), emergencyContactsController.getById);
router.post('/', validate(createEmergencyContactSchema), emergencyContactsController.create);
router.patch('/:id', validate(updateEmergencyContactSchema), emergencyContactsController.update);
router.delete('/:id', emergencyContactsController.delete);

module.exports = router;
