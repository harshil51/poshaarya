const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/progress-photo/progress-photo.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { createProgressPhotoSchema, updateProgressPhotoSchema, getPhotosQuerySchema, paramsIdSchema } = require('../../validators/progress-photo/progress-photo.validator');

router.use(authenticate);

router.get('/', validate(getPhotosQuerySchema, 'query'), ctrl.getAll);
router.get('/:id', validate(paramsIdSchema, 'params'), ctrl.getById);
router.post('/', validate(createProgressPhotoSchema), ctrl.create);
router.patch('/:id', validate(updateProgressPhotoSchema), ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
