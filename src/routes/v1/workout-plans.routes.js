const express = require('express');
const router = express.Router();

const workoutPlansController = require('../../controllers/workout-plans/workout-plans.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createWorkoutPlanSchema,
  updateWorkoutPlanSchema,
  paramsIdSchema,
  addWeekSchema,
  addDaySchema,
  addExerciseSchema,
} = require('../../validators/workout-plans/workout-plans.validator');

router.use(authenticate);

router.get('/', workoutPlansController.getAll);
router.post('/', validate(createWorkoutPlanSchema), workoutPlansController.create);

router.get('/:id', validate(paramsIdSchema, 'params'), workoutPlansController.getById);
router.patch('/:id', validate(updateWorkoutPlanSchema), workoutPlansController.update);
router.delete('/:id', workoutPlansController.delete);

router.get('/:id/weeks', workoutPlansController.getWeeks);
router.post('/:id/weeks', validate(addWeekSchema), workoutPlansController.addWeek);
router.patch('/weeks/:weekId', workoutPlansController.updateWeek);
router.delete('/weeks/:weekId', workoutPlansController.removeWeek);

router.post('/weeks/:weekId/days', validate(addDaySchema), workoutPlansController.addDay);
router.patch('/days/:dayId', workoutPlansController.updateDay);
router.delete('/days/:dayId', workoutPlansController.removeDay);

router.post('/days/:dayId/exercises', validate(addExerciseSchema), workoutPlansController.addExercise);
router.delete('/exercises/:exerciseId', workoutPlansController.removeExercise);

module.exports = router;
