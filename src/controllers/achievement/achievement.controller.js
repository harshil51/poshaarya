const achievementService = require('../../services/achievement/achievement.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class AchievementController {
  create = asyncHandler(async (req, res) => {
    const achievement = await achievementService.create(req.body);
    return ApiResponse.created(res, { achievement });
  });

  getAll = asyncHandler(async (req, res) => {
    const { category, page, limit } = req.query;
    const result = await achievementService.getAll({ category, page, limit });
    return ApiResponse.paginated(res, result.achievements, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const achievement = await achievementService.getById(req.params.id);
    return ApiResponse.success(res, { achievement });
  });

  update = asyncHandler(async (req, res) => {
    const achievement = await achievementService.update(req.params.id, req.body);
    return ApiResponse.success(res, { achievement });
  });

  delete = asyncHandler(async (req, res) => {
    await achievementService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Achievement deleted');
  });

  getUserAchievements = asyncHandler(async (req, res) => {
    const list = await achievementService.getUserAchievements(req.user.id);
    return ApiResponse.success(res, { achievements: list });
  });

  updateProgress = asyncHandler(async (req, res) => {
    const result = await achievementService.updateProgress(req.user.id, req.params.id, req.body.progress);
    return ApiResponse.success(res, { achievement: result });
  });

  getUnlocked = asyncHandler(async (req, res) => {
    const list = await achievementService.getUnlocked(req.user.id);
    return ApiResponse.success(res, { achievements: list });
  });
}

module.exports = new AchievementController();
