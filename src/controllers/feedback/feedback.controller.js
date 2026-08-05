const feedbackService = require('../../services/feedback/feedback.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class FeedbackController {
  create = asyncHandler(async (req, res) => {
    const feedback = await feedbackService.create(req.user.id, req.body);
    return ApiResponse.created(res, { feedback }, 'Feedback submitted');
  });

  getAll = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await feedbackService.getAll({ page, limit });
    return ApiResponse.paginated(res, result.feedback, result.pagination);
  });

  getMyFeedback = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await feedbackService.getMyFeedback(req.user.id, { page, limit });
    return ApiResponse.paginated(res, result.feedback, result.pagination);
  });

  markRead = asyncHandler(async (req, res) => {
    const feedback = await feedbackService.markRead(req.params.id);
    return ApiResponse.success(res, { feedback });
  });
}

module.exports = new FeedbackController();
