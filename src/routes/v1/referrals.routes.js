const express = require('express');
const router = express.Router();

const referralsController = require('../../controllers/referrals/referrals.controller');
const { authenticate, optionalAuth } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { redeemReferralSchema } = require('../../validators/referrals/referrals.validator');

router.post('/redeem', optionalAuth, validate(redeemReferralSchema), referralsController.redeem);

router.use(authenticate);

router.get('/code', referralsController.getCode);
router.get('/stats', referralsController.getStats);
router.get('/history', referralsController.getHistory);

module.exports = router;
