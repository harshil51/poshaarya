const express = require('express');
const router = express.Router();

const goalController = require('../../controllers/goal/goal.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createGoalSchema,
  updateGoalSchema,
  getGoalsQuerySchema,
  paramsIdSchema,
} = require('../../validators/goal/goal.validator');

router.use(authenticate);

router.get('/active', goalController.getActiveGoals);
router.get('/', validate(getGoalsQuerySchema, 'query'), goalController.getGoals);
router.get('/:id', validate(paramsIdSchema, 'params'), goalController.getGoalById);
router.post('/', validate(createGoalSchema), goalController.create);
router.patch('/:id', validate(updateGoalSchema), goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);
router.post('/:id/achieved', goalController.markAchieved);

module.exports = router;
