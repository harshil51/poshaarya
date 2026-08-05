const express = require('express');
const router = express.Router();

const favoritesController = require('../../controllers/favorites/favorites.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  addFavoriteSchema,
  paramsFoodIdSchema,
} = require('../../validators/favorites/favorites.validator');

router.use(authenticate);

router.get('/', favoritesController.getAll);
router.post('/', validate(addFavoriteSchema), favoritesController.add);
router.delete('/:foodId', validate(paramsFoodIdSchema, 'params'), favoritesController.remove);

module.exports = router;
