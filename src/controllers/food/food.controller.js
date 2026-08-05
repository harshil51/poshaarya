const foodService = require('../../services/food/food.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class FoodController {
  searchFoods = asyncHandler(async (req, res) => {
    const { query, categoryId, page, limit } = req.query;
    const result = await foodService.searchFoods({
      query,
      categoryId,
      page,
      limit,
    });

    return ApiResponse.paginated(res, result.foods, result.pagination);
  });

  getFoodById = asyncHandler(async (req, res) => {
    const food = await foodService.getFoodById(req.params.id);
    return ApiResponse.success(res, { food });
  });

  getFoodByBarcode = asyncHandler(async (req, res) => {
    // Barcode lookup is handled via the barcodes service
    return ApiResponse.success(res, null, 'Use /api/v1/barcodes/:barcode instead');
  });

  createFood = asyncHandler(async (req, res) => {
    const food = await foodService.createFood(req.body, req.user.id);
    return ApiResponse.created(res, { food }, 'Food created successfully');
  });

  updateFood = asyncHandler(async (req, res) => {
    const food = await foodService.updateFood(req.params.id, req.body, req.user.id);
    return ApiResponse.success(res, { food }, 'Food updated successfully');
  });

  deleteFood = asyncHandler(async (req, res) => {
    await foodService.deleteFood(req.params.id);
    return ApiResponse.success(res, null, 'Food deleted successfully');
  });

  getCategories = asyncHandler(async (req, res) => {
    const categories = await foodService.getCategories();
    return ApiResponse.success(res, { categories });
  });

  getCategoryById = asyncHandler(async (req, res) => {
    const category = await foodService.getCategoryById(req.params.id);
    return ApiResponse.success(res, { category });
  });

  getFavoriteFoods = asyncHandler(async (req, res) => {
    // Favorites are handled via the favorites service
    return ApiResponse.success(res, { favorites: [] }, 'Use /api/v1/favorites instead');
  });

  toggleFavoriteFood = asyncHandler(async (req, res) => {
    // Favorites are handled via the favorites service
    return ApiResponse.success(res, null, 'Use /api/v1/favorites instead');
  });

  getRecentFoods = asyncHandler(async (req, res) => {
    const foods = await foodService.getRecentFoods(req.user.id);
    return ApiResponse.success(res, { foods });
  });
}

module.exports = new FoodController();
