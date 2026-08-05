const waterService = require('../../services/water/water.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class WaterController {
  createLog = asyncHandler(async (req, res) => {
    const log = await waterService.createLog(req.user.id, req.body);
    return ApiResponse.created(res, { log }, 'Water log created');
  });

  getLogs = asyncHandler(async (req, res) => {
    const { date, startDate, endDate, page, limit } = req.query;
    const result = await waterService.getLogs(req.user.id, { date, startDate, endDate, page, limit });
    return ApiResponse.paginated(res, result.logs, result.pagination);
  });

  getLogById = asyncHandler(async (req, res) => {
    const log = await waterService.getLogById(req.params.id, req.user.id);
    return ApiResponse.success(res, { log });
  });

  updateLog = asyncHandler(async (req, res) => {
    const log = await waterService.updateLog(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { log }, 'Water log updated');
  });

  deleteLog = asyncHandler(async (req, res) => {
    await waterService.deleteLog(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Water log deleted');
  });

  getDailySummary = asyncHandler(async (req, res) => {
    const date = req.query.date || new Date().toISOString();
    const summary = await waterService.getDailySummary(req.user.id, date);
    return ApiResponse.success(res, { summary });
  });

  getWeeklySummary = asyncHandler(async (req, res) => {
    const date = req.query.date || new Date().toISOString();
    const summary = await waterService.getWeeklySummary(req.user.id, date);
    return ApiResponse.success(res, { summary });
  });

  getTodayLogs = asyncHandler(async (req, res) => {
    const today = new Date().toISOString();
    const summary = await waterService.getDailySummary(req.user.id, today);
    return ApiResponse.success(res, { summary });
  });
}

module.exports = new WaterController();
