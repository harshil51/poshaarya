const workoutPlansService = require('../../services/workout-plans/workout-plans.service');
const { ApiResponse, asyncHandler } = require('../../utils');

class WorkoutPlansController {
  create = asyncHandler(async (req, res) => {
    const plan = await workoutPlansService.create(req.user.id, req.body);
    return ApiResponse.created(res, { plan }, 'Workout plan created');
  });

  getAll = asyncHandler(async (req, res) => {
    const plans = await workoutPlansService.getAll(req.user.id);
    return ApiResponse.success(res, { plans });
  });

  getById = asyncHandler(async (req, res) => {
    const plan = await workoutPlansService.getById(req.params.id, req.user.id);
    return ApiResponse.success(res, { plan });
  });

  update = asyncHandler(async (req, res) => {
    const plan = await workoutPlansService.update(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { plan }, 'Workout plan updated');
  });

  delete = asyncHandler(async (req, res) => {
    await workoutPlansService.delete(req.params.id, req.user.id);
    return ApiResponse.success(res, null, 'Workout plan deleted');
  });

  addWeek = asyncHandler(async (req, res) => {
    const week = await workoutPlansService.addWeek(req.params.id, req.body);
    return ApiResponse.created(res, { week }, 'Week added');
  });

  updateWeek = asyncHandler(async (req, res) => {
    const week = await workoutPlansService.updateWeek(req.params.weekId, req.body);
    return ApiResponse.success(res, { week }, 'Week updated');
  });

  removeWeek = asyncHandler(async (req, res) => {
    await workoutPlansService.removeWeek(req.params.weekId);
    return ApiResponse.success(res, null, 'Week removed');
  });

  addDay = asyncHandler(async (req, res) => {
    const day = await workoutPlansService.addDay(req.params.weekId, req.body);
    return ApiResponse.created(res, { day }, 'Day added');
  });

  updateDay = asyncHandler(async (req, res) => {
    const day = await workoutPlansService.updateDay(req.params.dayId, req.body);
    return ApiResponse.success(res, { day }, 'Day updated');
  });

  removeDay = asyncHandler(async (req, res) => {
    await workoutPlansService.removeDay(req.params.dayId);
    return ApiResponse.success(res, null, 'Day removed');
  });

  addExercise = asyncHandler(async (req, res) => {
    const exercise = await workoutPlansService.addExercise(req.params.dayId, req.body);
    return ApiResponse.created(res, { exercise }, 'Exercise added');
  });

  removeExercise = asyncHandler(async (req, res) => {
    await workoutPlansService.removeExercise(req.params.exerciseId);
    return ApiResponse.success(res, null, 'Exercise removed');
  });

  getWeeks = asyncHandler(async (req, res) => {
    const weeks = await workoutPlansService.getWeeks(req.params.id);
    return ApiResponse.success(res, { weeks });
  });
}

module.exports = new WorkoutPlansController();
