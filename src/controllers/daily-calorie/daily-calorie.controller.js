const dailyCalorieService = require('../../services/daily-calorie/daily-calorie.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class DailyCalorieController {
  upsert = asyncHandler(async (req, res) => {
    const record = await dailyCalorieService.upsert(req.user.id, req.body);
    return ApiResponse.success(res, { record });
  });

  getByDate = asyncHandler(async (req, res) => {
    const date = req.query.date || new Date().toISOString();
    const record = await dailyCalorieService.getByDate(req.user.id, date);
    return ApiResponse.success(res, { record });
  });

  getRange = asyncHandler(async (req, res) => {
    const { startDate, endDate, page, limit } = req.query;
    const result = await dailyCalorieService.getRange(req.user.id, { startDate, endDate, page, limit });
    return ApiResponse.paginated(res, result.records, result.pagination);
  });

  delete = asyncHandler(async (req, res) => {
    await dailyCalorieService.delete(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Record deleted');
  });
}

module.exports = new DailyCalorieController();
