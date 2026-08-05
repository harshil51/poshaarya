const favoritesService = require('../../services/favorites/favorites.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class FavoritesController {
  add = asyncHandler(async (req, res) => {
    const favorite = await favoritesService.add(req.user.id, req.body.foodId);
    return ApiResponse.created(res, { favorite }, 'Added to favorites');
  });

  remove = asyncHandler(async (req, res) => {
    await favoritesService.remove(req.user.id, req.params.foodId);
    return ApiResponse.success(res, null, 'Removed from favorites');
  });

  getAll = asyncHandler(async (req, res) => {
    const favorites = await favoritesService.getAll(req.user.id);
    return ApiResponse.success(res, { favorites });
  });
}

module.exports = new FavoritesController();
