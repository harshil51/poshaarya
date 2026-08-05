const express = require('express');
const router = express.Router();

const mealPlansController = require('../../controllers/meal-plans/meal-plans.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createMealPlanSchema,
  updateMealPlanSchema,
  paramsIdSchema,
  createVersionSchema,
  addDaySchema,
  updateDaySchema,
  addItemSchema,
} = require('../../validators/meal-plans/meal-plans.validator');

router.use(authenticate);

router.get('/', mealPlansController.getAll);
router.post('/', validate(createMealPlanSchema), mealPlansController.create);

router.get('/:id', validate(paramsIdSchema, 'params'), mealPlansController.getById);
router.patch('/:id', validate(updateMealPlanSchema), mealPlansController.update);
router.delete('/:id', mealPlansController.delete);

router.post('/:id/versions', validate(createVersionSchema), mealPlansController.createVersion);
router.get('/:id/versions', mealPlansController.getVersions);

router.get('/versions/:versionId/days', mealPlansController.getVersionDays);

router.post('/versions/:versionId/days', validate(addDaySchema), mealPlansController.addDay);
router.patch('/days/:dayId', validate(updateDaySchema), mealPlansController.updateDay);
router.delete('/days/:dayId', mealPlansController.removeDay);

router.post('/days/:dayId/items', validate(addItemSchema), mealPlansController.addItem);
router.delete('/items/:itemId', mealPlansController.removeItem);

module.exports = router;
