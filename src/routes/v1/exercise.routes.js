const express = require('express');
const router = express.Router();

const exerciseController = require('../../controllers/exercise/exercise.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  searchExerciseSchema,
  createExerciseSchema,
  updateExerciseSchema,
  paramsIdSchema,
  getLogsQuerySchema,
  createLogSchema,
  updateLogSchema,
} = require('../../validators/exercise/exercise.validator');

// ─── Exercise Logs (all protected) ─────────────────────────
router.use('/logs', authenticate);
router.get('/logs', validate(getLogsQuerySchema, 'query'), exerciseController.getLogs);
router.get('/logs/summary/daily', exerciseController.getDailySummary);
router.get('/logs/summary/weekly', exerciseController.getWeeklySummary);
router.get('/logs/:id', exerciseController.getLogById);
router.post('/logs', validate(createLogSchema), exerciseController.createLog);
router.patch('/logs/:id', validate(updateLogSchema), exerciseController.updateLog);
router.delete('/logs/:id', exerciseController.deleteLog);

// ─── Public Exercise Routes ────────────────────────────────
router.get('/search', validate(searchExerciseSchema, 'query'), exerciseController.searchExercises);
router.get('/categories', exerciseController.getCategories);
router.get('/:id', validate(paramsIdSchema, 'params'), exerciseController.getExerciseById);

// ─── Protected Exercise Routes ─────────────────────────────
router.post('/', authenticate, validate(createExerciseSchema), exerciseController.createExercise);
router.patch('/:id', authenticate, validate(updateExerciseSchema), exerciseController.updateExercise);
router.delete('/:id', authenticate, exerciseController.deleteExercise);

module.exports = router;
