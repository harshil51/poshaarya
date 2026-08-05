const express = require('express');
const router = express.Router();

const mealController = require('../../controllers/meal/meal.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createMealSchema,
  updateMealSchema,
  getMealsQuerySchema,
  addItemSchema,
  updateItemSchema,
  paramsIdSchema,
  itemParamsSchema,
  duplicateMealQuerySchema,
} = require('../../validators/meal/meal.validator');

// ─── All routes require authentication ──────────────────────
router.use(authenticate);

// ─── Today & Summary ────────────────────────────────────────
router.get('/today', mealController.getTodayMeals);

router.get('/summary', mealController.getDailySummary);

// ─── CRUD ───────────────────────────────────────────────────
router.get('/', validate(getMealsQuerySchema, 'query'), mealController.getMeals);

router.get('/:id', mealController.getMealById);

router.post('/', validate(createMealSchema), mealController.createMeal);

router.patch('/:id', validate(updateMealSchema), mealController.updateMeal);

router.delete('/:id', mealController.deleteMeal);

// ─── Duplicate ──────────────────────────────────────────────
router.post('/:id/duplicate', validate(duplicateMealQuerySchema, 'query'), mealController.duplicateMeal);

// ─── Meal Items ─────────────────────────────────────────────
router.post('/:id/items', validate(addItemSchema), mealController.addItem);

router.patch('/:id/items/:itemId', validate(updateItemSchema), mealController.updateItem);

router.delete('/:id/items/:itemId', mealController.removeItem);

module.exports = router;
