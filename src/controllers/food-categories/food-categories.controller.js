const foodCategoriesService = require('../../services/food-categories/food-categories.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class FoodCategoriesController {
  create = asyncHandler(async (req, res) => {
    const category = await foodCategoriesService.create(req.body);
    return ApiResponse.created(res, { category }, 'Food category created');
  });

  getAll = asyncHandler(async (req, res) => {
    const categories = await foodCategoriesService.getAll();
    return ApiResponse.success(res, { categories });
  });

  getTree = asyncHandler(async (req, res) => {
    const tree = await foodCategoriesService.getTree();
    return ApiResponse.success(res, { categories: tree });
  });

  getById = asyncHandler(async (req, res) => {
    const category = await foodCategoriesService.getById(req.params.id);
    return ApiResponse.success(res, { category });
  });

  update = asyncHandler(async (req, res) => {
    const category = await foodCategoriesService.update(req.params.id, req.body);
    return ApiResponse.success(res, { category }, 'Food category updated');
  });

  delete = asyncHandler(async (req, res) => {
    await foodCategoriesService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Food category deleted');
  });
}

module.exports = new FoodCategoriesController();
