const express = require('express');
const router = express.Router();

const foodController = require('../../controllers/food/food.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  searchFoodSchema,
  createFoodSchema,
  updateFoodSchema,
  getFoodParamsSchema,
  barcodeQuerySchema,
} = require('../../validators/food/food.validator');

// ─── Public Routes ─────────────────────────────────────────

router.get('/search', validate(searchFoodSchema, 'query'), foodController.searchFoods);

router.get('/barcode', validate(barcodeQuerySchema, 'query'), foodController.getFoodByBarcode);

router.get('/categories', foodController.getCategories);

router.get('/categories/:id', foodController.getCategoryById);

router.get('/recent', authenticate, foodController.getRecentFoods);

router.get('/favorites', authenticate, foodController.getFavoriteFoods);

router.get('/:id', validate(getFoodParamsSchema, 'params'), foodController.getFoodById);

// ─── Protected Routes ──────────────────────────────────────

router.post('/', authenticate, validate(createFoodSchema), foodController.createFood);

router.patch('/:id', authenticate, validate(updateFoodSchema), foodController.updateFood);

router.delete('/:id', authenticate, foodController.deleteFood);

router.post('/:id/favorite', authenticate, foodController.toggleFavoriteFood);

module.exports = router;
