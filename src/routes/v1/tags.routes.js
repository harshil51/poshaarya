const express = require('express');
const router = express.Router();

const tagsController = require('../../controllers/tags/tags.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createTagSchema,
  updateTagSchema,
  paramsIdSchema,
} = require('../../validators/tags/tags.validator');

router.get('/', tagsController.getAll);
router.get('/:id', validate(paramsIdSchema, 'params'), tagsController.getById);

router.use(authenticate);
router.post('/', validate(createTagSchema), tagsController.create);
router.patch('/:id', validate(updateTagSchema), tagsController.update);
router.delete('/:id', tagsController.delete);

module.exports = router;
