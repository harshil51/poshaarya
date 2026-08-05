const express = require('express');
const router = express.Router();

// ─── API v1 Routes ─────────────────────────────────────────
const authRoutes = require('./v1/auth.routes');
const foodRoutes = require('./v1/food.routes');
const mealRoutes = require('./v1/meal.routes');
const exerciseRoutes = require('./v1/exercise.routes');
const waterRoutes = require('./v1/water.routes');
const weightRoutes = require('./v1/weight.routes');
const goalRoutes = require('./v1/goal.routes');
const notificationRoutes = require('./v1/notification.routes');
const achievementRoutes = require('./v1/achievement.routes');

router.use('/auth', authRoutes);
router.use('/foods', foodRoutes);
router.use('/meals', mealRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/water', waterRoutes);
router.use('/weight', weightRoutes);
router.use('/goals', goalRoutes);
router.use('/notifications', notificationRoutes);
router.use('/achievements', achievementRoutes);
router.use('/progress-photos', require('./v1/progress-photo.routes'));
router.use('/daily-calories', require('./v1/daily-calorie.routes'));
router.use('/feedback', require('./v1/feedback.routes'));
router.use('/contact', require('./v1/contact.routes'));
router.use('/subscriptions', require('./v1/subscription.routes'));
router.use('/recipes', require('./v1/recipe.routes'));
router.use('/blogs', require('./v1/blog.routes'));

// ─── New Modules ──────────────────────────────────────────
router.use('/profile', require('./v1/profile.routes'));
router.use('/body-measurements', require('./v1/body-measurements.routes'));
router.use('/fitness-profile', require('./v1/fitness-profile.routes'));
router.use('/health-profile', require('./v1/health-profile.routes'));
router.use('/emergency-contacts', require('./v1/emergency-contacts.routes'));
router.use('/food-categories', require('./v1/food-categories.routes'));
router.use('/exercise-categories', require('./v1/exercise-categories.routes'));
router.use('/meal-templates', require('./v1/meal-templates.routes'));
router.use('/notification-settings', require('./v1/notification-settings.routes'));
router.use('/privacy-settings', require('./v1/privacy-settings.routes'));
router.use('/preferences', require('./v1/user-preferences.routes'));
router.use('/family', require('./v1/family.routes'));
router.use('/barcodes', require('./v1/barcodes.routes'));
router.use('/tags', require('./v1/tags.routes'));
router.use('/favorites', require('./v1/favorites.routes'));
router.use('/meal-plans', require('./v1/meal-plans.routes'));
router.use('/workout-plans', require('./v1/workout-plans.routes'));
router.use('/referrals', require('./v1/referrals.routes'));
router.use('/wallet', require('./v1/wallet.routes'));

// ─── Health Check ──────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Poshaarya API is healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
