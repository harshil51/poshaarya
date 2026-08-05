const bodyMeasurementsService = require('../../services/body-measurements/body-measurements.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class BodyMeasurementsController {
  create = asyncHandler(async (req, res) => {
    const item = await bodyMeasurementsService.create(req.user.id, req.body);
    return ApiResponse.created(res, { measurement: item }, 'Body measurement created');
  });

  getAll = asyncHandler(async (req, res) => {
    const { startDate, endDate, page, limit } = req.query;
    const result = await bodyMeasurementsService.getAll(req.user.id, { startDate, endDate, page, limit });
    return ApiResponse.paginated(res, result.items, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const item = await bodyMeasurementsService.getById(req.params.id, req.user.id);
    return ApiResponse.success(res, { measurement: item });
  });

  update = asyncHandler(async (req, res) => {
    const item = await bodyMeasurementsService.update(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { measurement: item }, 'Body measurement updated');
  });

  delete = asyncHandler(async (req, res) => {
    await bodyMeasurementsService.delete(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Body measurement deleted');
  });

  getLatest = asyncHandler(async (req, res) => {
    const item = await bodyMeasurementsService.getLatest(req.user.id);
    return ApiResponse.success(res, { measurement: item });
  });

  getHistory = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 30;
    const items = await bodyMeasurementsService.getHistory(req.user.id, limit);
    return ApiResponse.success(res, { measurements: items });
  });
}

module.exports = new BodyMeasurementsController();
