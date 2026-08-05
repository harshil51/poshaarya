const express = require('express');
const router = express.Router();

const walletController = require('../../controllers/wallet/wallet.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { addFundsSchema, querySchema } = require('../../validators/wallet/wallet.validator');

router.use(authenticate);

router.get('/balance', walletController.getBalance);
router.get('/transactions', validate(querySchema, 'query'), walletController.getTransactions);
router.post('/add-funds', validate(addFundsSchema), walletController.addFunds);

module.exports = router;
