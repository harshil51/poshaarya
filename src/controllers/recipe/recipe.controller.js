const recipeService = require('../../services/recipe/recipe.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class RecipeController {
  create = asyncHandler(async (req, res) => {
    const recipe = await recipeService.create(req.body, req.user.id);
    return ApiResponse.created(res, { recipe });
  });

  search = asyncHandler(async (req, res) => {
    const { query, dietType, mealType, difficulty, isIndian, page, limit } = req.query;
    const isIndianBool = isIndian !== undefined ? isIndian === 'true' : undefined;
    const result = await recipeService.search({ query, dietType, mealType, difficulty, isIndian: isIndianBool, page, limit });
    return ApiResponse.paginated(res, result.recipes, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const recipe = await recipeService.getById(req.params.id);
    return ApiResponse.success(res, { recipe });
  });

  getBySlug = asyncHandler(async (req, res) => {
    const recipe = await recipeService.getBySlug(req.params.slug);
    return ApiResponse.success(res, { recipe });
  });

  update = asyncHandler(async (req, res) => {
    const recipe = await recipeService.update(req.params.id, req.body);
    return ApiResponse.success(res, { recipe });
  });

  delete = asyncHandler(async (req, res) => {
    await recipeService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Recipe deleted');
  });
}

module.exports = new RecipeController();
