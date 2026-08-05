const exerciseService = require('../../services/exercise/exercise.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class ExerciseController {
  searchExercises = asyncHandler(async (req, res) => {
    const { query, categoryId, page, limit } = req.query;
    const result = await exerciseService.searchExercises({ query, categoryId, page, limit });
    return ApiResponse.paginated(res, result.exercises, result.pagination);
  });

  getExerciseById = asyncHandler(async (req, res) => {
    const exercise = await exerciseService.getExerciseById(req.params.id);
    return ApiResponse.success(res, { exercise });
  });

  createExercise = asyncHandler(async (req, res) => {
    const exercise = await exerciseService.createExercise(req.body, req.user.id);
    return ApiResponse.created(res, { exercise }, 'Exercise created successfully');
  });

  updateExercise = asyncHandler(async (req, res) => {
    const exercise = await exerciseService.updateExercise(req.params.id, req.body);
    return ApiResponse.success(res, { exercise }, 'Exercise updated successfully');
  });

  deleteExercise = asyncHandler(async (req, res) => {
    await exerciseService.deleteExercise(req.params.id);
    return ApiResponse.success(res, null, 'Exercise deleted successfully');
  });

  getCategories = asyncHandler(async (req, res) => {
    const categories = await exerciseService.getCategories();
    return ApiResponse.success(res, { categories });
  });

  createLog = asyncHandler(async (req, res) => {
    const log = await exerciseService.createLog(req.user.id, req.body);
    return ApiResponse.created(res, { log }, 'Exercise log created');
  });

  getLogs = asyncHandler(async (req, res) => {
    const { date, startDate, endDate, exerciseId, page, limit } = req.query;
    const result = await exerciseService.getLogs(req.user.id, {
      date, startDate, endDate, exerciseId, page, limit,
    });
    return ApiResponse.paginated(res, result.logs, result.pagination);
  });

  getLogById = asyncHandler(async (req, res) => {
    const log = await exerciseService.getLogById(req.params.id, req.user.id);
    return ApiResponse.success(res, { log });
  });

  updateLog = asyncHandler(async (req, res) => {
    const log = await exerciseService.updateLog(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { log }, 'Exercise log updated');
  });

  deleteLog = asyncHandler(async (req, res) => {
    await exerciseService.deleteLog(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Exercise log deleted');
  });

  getDailySummary = asyncHandler(async (req, res) => {
    const date = req.query.date || new Date().toISOString();
    const summary = await exerciseService.getDailySummary(req.user.id, date);
    return ApiResponse.success(res, { summary });
  });

  getWeeklySummary = asyncHandler(async (req, res) => {
    const date = req.query.date || new Date().toISOString();
    const summary = await exerciseService.getWeeklySummary(req.user.id, date);
    return ApiResponse.success(res, { summary });
  });
}

module.exports = new ExerciseController();
