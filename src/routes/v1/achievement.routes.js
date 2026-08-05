const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/achievement/achievement.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createAchievementSchema, updateAchievementSchema, paramsIdSchema, updateProgressSchema,
} = require('../../validators/achievement/achievement.validator');

router.get('/', ctrl.getAll);
router.get('/:id', validate(paramsIdSchema, 'params'), ctrl.getById);

router.post('/', authenticate, validate(createAchievementSchema), ctrl.create);
router.patch('/:id', authenticate, validate(updateAchievementSchema), ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

router.get('/user/mine', authenticate, ctrl.getUserAchievements);
router.get('/user/unlocked', authenticate, ctrl.getUnlocked);
router.patch('/user/:id/progress', authenticate, validate(updateProgressSchema), ctrl.updateProgress);

module.exports = router;
