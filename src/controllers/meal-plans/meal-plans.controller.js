const mealPlansService = require('../../services/meal-plans/meal-plans.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class MealPlansController {
  create = asyncHandler(async (req, res) => {
    const plan = await mealPlansService.create(req.user.id, req.body);
    return ApiResponse.created(res, { plan }, 'Meal plan created');
  });

  getAll = asyncHandler(async (req, res) => {
    const plans = await mealPlansService.getAll(req.user.id);
    return ApiResponse.success(res, { plans });
  });

  getById = asyncHandler(async (req, res) => {
    const plan = await mealPlansService.getById(req.params.id, req.user.id);
    return ApiResponse.success(res, { plan });
  });

  update = asyncHandler(async (req, res) => {
    const plan = await mealPlansService.update(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { plan }, 'Meal plan updated');
  });

  delete = asyncHandler(async (req, res) => {
    await mealPlansService.delete(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Meal plan deleted');
  });

  createVersion = asyncHandler(async (req, res) => {
    const version = await mealPlansService.createVersion(req.params.id, req.user.id, req.body);
    return ApiResponse.created(res, { version }, 'New version created');
  });

  getVersions = asyncHandler(async (req, res) => {
    const versions = await mealPlansService.getVersions(req.params.id, req.user.id);
    return ApiResponse.success(res, { versions });
  });

  addDay = asyncHandler(async (req, res) => {
    const day = await mealPlansService.addDay(req.params.versionId, req.body);
    return ApiResponse.created(res, { day }, 'Day added');
  });

  updateDay = asyncHandler(async (req, res) => {
    const day = await mealPlansService.updateDay(req.params.dayId, req.body);
    return ApiResponse.success(res, { day }, 'Day updated');
  });

  removeDay = asyncHandler(async (req, res) => {
    await mealPlansService.removeDay(req.params.dayId);
    return ApiResponse.success(res, null, 'Day removed');
  });

  addItem = asyncHandler(async (req, res) => {
    const item = await mealPlansService.addItem(req.params.dayId, req.body);
    return ApiResponse.created(res, { item }, 'Item added');
  });

  removeItem = asyncHandler(async (req, res) => {
    await mealPlansService.removeItem(req.params.itemId);
    return ApiResponse.success(res, null, 'Item removed');
  });

  getVersionDays = asyncHandler(async (req, res) => {
    const days = await mealPlansService.getVersionDays(req.params.versionId, req.user.id);
    return ApiResponse.success(res, { days });
  });
}

module.exports = new MealPlansController();
