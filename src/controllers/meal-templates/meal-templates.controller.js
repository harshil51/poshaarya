const mealTemplatesService = require('../../services/meal-templates/meal-templates.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class MealTemplatesController {
  create = asyncHandler(async (req, res) => {
    const template = await mealTemplatesService.create(req.user.id, req.body);
    return ApiResponse.created(res, { template }, 'Meal template created');
  });

  getAll = asyncHandler(async (req, res) => {
    const templates = await mealTemplatesService.getAll(req.user.id);
    return ApiResponse.success(res, { templates });
  });

  getById = asyncHandler(async (req, res) => {
    const template = await mealTemplatesService.getById(req.params.id, req.user.id);
    return ApiResponse.success(res, { template });
  });

  update = asyncHandler(async (req, res) => {
    const template = await mealTemplatesService.update(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { template }, 'Meal template updated');
  });

  delete = asyncHandler(async (req, res) => {
    await mealTemplatesService.delete(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Meal template deleted');
  });
}

module.exports = new MealTemplatesController();
