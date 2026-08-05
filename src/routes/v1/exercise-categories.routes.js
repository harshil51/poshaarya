const express = require('express');
const router = express.Router();

const exerciseCategoriesController = require('../../controllers/exercise-categories/exercise-categories.controller');
const { authenticate, authorize } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createExerciseCategorySchema,
  updateExerciseCategorySchema,
  paramsIdSchema,
} = require('../../validators/exercise-categories/exercise-categories.validator');

router.get('/', exerciseCategoriesController.getAll);
router.get('/:id', validate(paramsIdSchema, 'params'), exerciseCategoriesController.getById);

router.use(authenticate);
router.post('/', validate(createExerciseCategorySchema), exerciseCategoriesController.create);
router.patch('/:id', validate(updateExerciseCategorySchema), exerciseCategoriesController.update);
router.delete('/:id', exerciseCategoriesController.delete);

module.exports = router;
