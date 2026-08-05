const walletService = require('../../services/wallet/wallet.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class WalletController {
  getBalance = asyncHandler(async (req, res) => {
    const wallet = await walletService.getBalance(req.user.id);
    return ApiResponse.success(res, { wallet });
  });

  getTransactions = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await walletService.getTransactions(req.user.id, { page, limit });
    return ApiResponse.paginated(res, result.transactions, result.pagination);
  });

  addFunds = asyncHandler(async (req, res) => {
    const transaction = await walletService.addFunds(req.user.id, req.body);
    return ApiResponse.success(res, { transaction }, 'Funds added');
  });
}

module.exports = new WalletController();
