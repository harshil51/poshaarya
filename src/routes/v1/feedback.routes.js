const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/feedback/feedback.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { createFeedbackSchema, getFeedbackQuerySchema, paramsIdSchema } = require('../../validators/feedback/feedback.validator');

router.post('/', authenticate, validate(createFeedbackSchema), ctrl.create);
router.get('/mine', authenticate, validate(getFeedbackQuerySchema, 'query'), ctrl.getMyFeedback);
router.get('/', ctrl.getAll);
router.patch('/:id/read', ctrl.markRead);

module.exports = router;
