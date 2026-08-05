const exerciseCategoriesService = require('../../services/exercise-categories/exercise-categories.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class ExerciseCategoriesController {
  create = asyncHandler(async (req, res) => {
    const category = await exerciseCategoriesService.create(req.body);
    return ApiResponse.created(res, { category }, 'Exercise category created');
  });

  getAll = asyncHandler(async (req, res) => {
    const categories = await exerciseCategoriesService.getAll();
    return ApiResponse.success(res, { categories });
  });

  getById = asyncHandler(async (req, res) => {
    const category = await exerciseCategoriesService.getById(req.params.id);
    return ApiResponse.success(res, { category });
  });

  update = asyncHandler(async (req, res) => {
    const category = await exerciseCategoriesService.update(req.params.id, req.body);
    return ApiResponse.success(res, { category }, 'Exercise category updated');
  });

  delete = asyncHandler(async (req, res) => {
    await exerciseCategoriesService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Exercise category deleted');
  });
}

module.exports = new ExerciseCategoriesController();
