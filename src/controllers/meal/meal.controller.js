const mealService = require('../../services/meal/meal.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class MealController {
  getMeals = asyncHandler(async (req, res) => {
    const { date, startDate, endDate, mealType, page, limit } = req.query;
    const result = await mealService.getMeals(req.user.id, {
      date, startDate, endDate, mealType, page, limit,
    });
    return ApiResponse.paginated(res, result.meals, result.pagination);
  });

  getMealById = asyncHandler(async (req, res) => {
    const meal = await mealService.getMealById(req.params.id, req.user.id);
    return ApiResponse.success(res, { meal });
  });

  createMeal = asyncHandler(async (req, res) => {
    const meal = await mealService.createMeal(req.user.id, req.body);
    return ApiResponse.created(res, { meal }, 'Meal created successfully');
  });

  updateMeal = asyncHandler(async (req, res) => {
    const meal = await mealService.updateMeal(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { meal }, 'Meal updated successfully');
  });

  deleteMeal = asyncHandler(async (req, res) => {
    await mealService.deleteMeal(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Meal deleted successfully');
  });

  getTodayMeals = asyncHandler(async (req, res) => {
    const meals = await mealService.getTodayMeals(req.user.id);
    return ApiResponse.success(res, { meals });
  });

  getDailySummary = asyncHandler(async (req, res) => {
    const date = req.query.date || new Date().toISOString();
    const summary = await mealService.getDailySummary(req.user.id, date);
    return ApiResponse.success(res, { summary });
  });

  addItem = asyncHandler(async (req, res) => {
    const item = await mealService.addItemToMeal(req.params.id, req.user.id, req.body);
    return ApiResponse.created(res, { item }, 'Item added to meal');
  });

  updateItem = asyncHandler(async (req, res) => {
    const item = await mealService.updateItemInMeal(
      req.params.id, req.params.itemId, req.user.id, req.body
    );
    return ApiResponse.success(res, { item }, 'Item updated');
  });

  removeItem = asyncHandler(async (req, res) => {
    await mealService.removeItemFromMeal(req.params.id, req.params.itemId, req.user.id);
    return ApiResponse.success(res, null, 'Item removed from meal');
  });

  duplicateMeal = asyncHandler(async (req, res) => {
    const meal = await mealService.duplicateMeal(
      req.params.id, req.user.id, req.query.date
    );
    return ApiResponse.created(res, { meal }, 'Meal duplicated successfully');
  });
}

module.exports = new MealController();
