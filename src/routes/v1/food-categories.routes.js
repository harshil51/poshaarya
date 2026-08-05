const express = require('express');
const router = express.Router();

const foodCategoriesController = require('../../controllers/food-categories/food-categories.controller');
const { authenticate, authorize } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createFoodCategorySchema,
  updateFoodCategorySchema,
  paramsIdSchema,
} = require('../../validators/food-categories/food-categories.validator');

router.get('/', foodCategoriesController.getAll);
router.get('/tree', foodCategoriesController.getTree);
router.get('/:id', validate(paramsIdSchema, 'params'), foodCategoriesController.getById);

router.use(authenticate);
router.post('/', validate(createFoodCategorySchema), foodCategoriesController.create);
router.patch('/:id', validate(updateFoodCategorySchema), foodCategoriesController.update);
router.delete('/:id', foodCategoriesController.delete);

module.exports = router;
