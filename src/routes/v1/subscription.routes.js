const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/subscription/subscription.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');

const {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  createPaymentSchema,
  paramsIdSchema,
} = require('../../validators/subscription/subscription.validator');

router.use(authenticate);

// Subscription
router.get('/mine', ctrl.getMine);
router.post('/', validate(createSubscriptionSchema), ctrl.create);

// Payments
router.get('/payments/mine', ctrl.getPayments);
router.post('/payments', validate(createPaymentSchema), ctrl.createPayment);

// By ID (keep LAST)
router.get('/:id', validate(paramsIdSchema, 'params'), ctrl.getById);
router.patch('/:id', validate(updateSubscriptionSchema), ctrl.update);
router.post('/:id/cancel', ctrl.cancel);

module.exports = router;