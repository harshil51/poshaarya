const express = require('express');
const router = express.Router();

const mealTemplatesController = require('../../controllers/meal-templates/meal-templates.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createMealTemplateSchema,
  updateMealTemplateSchema,
  paramsIdSchema,
} = require('../../validators/meal-templates/meal-templates.validator');

router.use(authenticate);

router.get('/', mealTemplatesController.getAll);
router.get('/:id', validate(paramsIdSchema, 'params'), mealTemplatesController.getById);
router.post('/', validate(createMealTemplateSchema), mealTemplatesController.create);
router.patch('/:id', validate(updateMealTemplateSchema), mealTemplatesController.update);
router.delete('/:id', mealTemplatesController.delete);

module.exports = router;
