const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/blog/blog.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const { createBlogSchema, updateBlogSchema, searchBlogSchema, paramsIdSchema } = require('../../validators/blog/blog.validator');

router.get('/search', validate(searchBlogSchema, 'query'), ctrl.search);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/:id', validate(paramsIdSchema, 'params'), ctrl.getById);

router.post('/', authenticate, validate(createBlogSchema), ctrl.create);
router.patch('/:id', authenticate, validate(updateBlogSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

module.exports = router;
