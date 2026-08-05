const subscriptionService = require('../../services/subscription/subscription.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class SubscriptionController {
  create = asyncHandler(async (req, res) => {
    const sub = await subscriptionService.create(req.user.id, req.body);
    return ApiResponse.created(res, { subscription: sub });
  });

  getMine = asyncHandler(async (req, res) => {
    const subscriptions = await subscriptionService.getByUserId(req.user.id);
    return ApiResponse.success(res, { subscriptions });
  });

  getById = asyncHandler(async (req, res) => {
    const sub = await subscriptionService.getById(req.params.id);
    return ApiResponse.success(res, { subscription: sub });
  });

  update = asyncHandler(async (req, res) => {
    const sub = await subscriptionService.update(req.params.id, req.body);
    return ApiResponse.success(res, { subscription: sub });
  });

  cancel = asyncHandler(async (req, res) => {
    const sub = await subscriptionService.cancel(req.params.id);
    return ApiResponse.success(
      res,
      { subscription: sub },
      'Subscription cancelled'
    );
  });

  getPlans = asyncHandler(async (req, res) => {
    const plans = await subscriptionService.getPlans();
    return ApiResponse.success(res, { plans });
  });

  getPlanById = asyncHandler(async (req, res) => {
    const plan = await subscriptionService.getPlanById(req.params.id);
    return ApiResponse.success(res, { plan });
  });

  // ==========================
  // Payments
  // ==========================

  getPayments = asyncHandler(async (req, res) => {
    const payments = await subscriptionService.getPayments(req.user.id);
    return ApiResponse.success(res, { payments });
  });

  createPayment = asyncHandler(async (req, res) => {
    const payment = await subscriptionService.createPayment(
      req.user.id,
      req.body
    );
    return ApiResponse.created(res, { payment });
  });
}

module.exports = new SubscriptionController();