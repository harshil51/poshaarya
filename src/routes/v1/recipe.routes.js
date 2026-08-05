const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/recipe/recipe.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { createRecipeSchema, updateRecipeSchema, searchRecipeSchema, paramsIdSchema } = require('../../validators/recipe/recipe.validator');

router.get('/search', validate(searchRecipeSchema, 'query'), ctrl.search);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/:id', validate(paramsIdSchema, 'params'), ctrl.getById);

router.post('/', authenticate, validate(createRecipeSchema), ctrl.create);
router.patch('/:id', authenticate, validate(updateRecipeSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

module.exports = router;
