const referralsService = require('../../services/referrals/referrals.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class ReferralsController {
  getCode = asyncHandler(async (req, res) => {
    const referral = await referralsService.getOrCreateCode(req.user.id);
    return ApiResponse.success(res, { referralCode: referral.referralCode });
  });

  getStats = asyncHandler(async (req, res) => {
    const stats = await referralsService.getStats(req.user.id);
    return ApiResponse.success(res, { stats });
  });

  getHistory = asyncHandler(async (req, res) => {
    const history = await referralsService.getHistory(req.user.id);
    return ApiResponse.success(res, { history });
  });

  redeem = asyncHandler(async (req, res) => {
    const result = await referralsService.redeem(req.body.code, req.user.id);
    return ApiResponse.success(res, { result }, 'Referral code redeemed');
  });
}

module.exports = new ReferralsController();
