const weightService = require('../../services/weight/weight.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class WeightController {
  createLog = asyncHandler(async (req, res) => {
    const log = await weightService.createLog(req.user.id, req.body);
    return ApiResponse.created(res, { log }, 'Weight log created');
  });

  getLogs = asyncHandler(async (req, res) => {
    const { startDate, endDate, page, limit } = req.query;
    const result = await weightService.getLogs(req.user.id, { startDate, endDate, page, limit });
    return ApiResponse.paginated(res, result.logs, result.pagination);
  });

  getLogById = asyncHandler(async (req, res) => {
    const log = await weightService.getLogById(req.params.id, req.user.id);
    return ApiResponse.success(res, { log });
  });

  updateLog = asyncHandler(async (req, res) => {
    const log = await weightService.updateLog(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { log }, 'Weight log updated');
  });

  deleteLog = asyncHandler(async (req, res) => {
    await weightService.deleteLog(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Weight log deleted');
  });

  getLatest = asyncHandler(async (req, res) => {
    const log = await weightService.getLatest(req.user.id);
    return ApiResponse.success(res, { log });
  });

  getHistory = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 30;
    const logs = await weightService.getHistory(req.user.id, limit);
    return ApiResponse.success(res, { logs });
  });
}

module.exports = new WeightController();
