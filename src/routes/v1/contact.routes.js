const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/contact/contact.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { createContactMessageSchema, getMessagesQuerySchema, paramsIdSchema } = require('../../validators/contact/contact.validator');

router.post('/', validate(createContactMessageSchema), ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.patch('/:id/read', ctrl.markRead);
router.delete('/:id', ctrl.delete);

module.exports = router;
