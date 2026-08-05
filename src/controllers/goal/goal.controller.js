const goalService = require('../../services/goal/goal.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class GoalController {
  create = asyncHandler(async (req, res) => {
    const goal = await goalService.create(req.user.id, req.body);
    return ApiResponse.created(res, { goal }, 'Goal created');
  });

  getGoals = asyncHandler(async (req, res) => {
    const { goalType, isActive, isAchieved, page, limit } = req.query;
    const isActiveBool = isActive !== undefined ? isActive === 'true' : undefined;
    const isAchievedBool = isAchieved !== undefined ? isAchieved === 'true' : undefined;
    const result = await goalService.getGoals(req.user.id, {
      goalType, isActive: isActiveBool, isAchieved: isAchievedBool, page, limit,
    });
    return ApiResponse.paginated(res, result.goals, result.pagination);
  });

  getGoalById = asyncHandler(async (req, res) => {
    const goal = await goalService.getGoalById(req.params.id, req.user.id);
    return ApiResponse.success(res, { goal });
  });

  updateGoal = asyncHandler(async (req, res) => {
    const goal = await goalService.updateGoal(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { goal }, 'Goal updated');
  });

  deleteGoal = asyncHandler(async (req, res) => {
    await goalService.deleteGoal(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Goal deleted');
  });

  getActiveGoals = asyncHandler(async (req, res) => {
    const goals = await goalService.getActiveGoals(req.user.id);
    return ApiResponse.success(res, { goals });
  });

  markAchieved = asyncHandler(async (req, res) => {
    const goal = await goalService.markAchieved(req.params.id, req.user.id);
    return ApiResponse.success(res, { goal }, 'Goal marked as achieved');
  });
}

module.exports = new GoalController();
