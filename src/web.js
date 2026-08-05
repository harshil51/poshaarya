const express = require('express');
const router = express.Router();
const path = require('path');
const webAuth = require('./middlewares/webAuth');
const webAuthCtrl = require('./controllers/web/auth.controller');

const frontendDir = path.resolve(__dirname, '../frontend');

function serveStatic(file) {
  return (req, res, next) => {
    res.sendFile(path.join(frontendDir, file), (err) => {
      if (err) next(err);
    });
  };
}

// ─── Static Pages ─────────────────────────────────────────
router.get('/', serveStatic('index.html'));
router.get('/about', serveStatic('static/about.html'));
router.get('/features', (req, res) => res.redirect('/#features'));
router.get('/pricing', (req, res) => res.redirect('/#pricing'));

// ─── Auth Pages ───────────────────────────────────────────
router.get('/login', serveStatic('auth/login.html'));
router.get('/signup', serveStatic('auth/signup.html'));

// Auth API endpoints remain the same
router.post('/login', webAuthCtrl.login);
router.post('/signup', webAuthCtrl.signup);
router.get('/logout', webAuthCtrl.logout);

// ─── Dashboard Pages (auth required) ──────────────────────
router.get('/dashboard', webAuth, serveStatic('dashboard/index.html'));
router.get('/dashboard/food', webAuth, serveStatic('dashboard/food-search.html'));
router.get('/dashboard/food-search', webAuth, serveStatic('dashboard/food-search.html'));
router.get('/dashboard/exercise', webAuth, serveStatic('dashboard/exercise.html'));
router.get('/dashboard/water', webAuth, serveStatic('dashboard/water.html'));
router.get('/dashboard/weight', webAuth, serveStatic('dashboard/weight.html'));
router.get('/dashboard/analytics', webAuth, serveStatic('dashboard/analytics.html'));
router.get('/dashboard/profile', webAuth, serveStatic('dashboard/profile.html'));
router.get('/dashboard/settings', webAuth, serveStatic('dashboard/settings.html'));
router.get('/dashboard/notifications', webAuth, serveStatic('dashboard/notifications.html'));

// Aliases for dashboard index if specific pages don't exist yet
router.get('/dashboard/meals', webAuth, serveStatic('dashboard/index.html'));
router.get('/dashboard/meal-planner', webAuth, serveStatic('dashboard/index.html'));
router.get('/dashboard/goals', webAuth, serveStatic('dashboard/index.html'));
router.get('/dashboard/achievements', webAuth, serveStatic('dashboard/index.html'));

// ─── Admin Pages (auth required) ──────────────────────────
router.get('/admin', webAuth, serveStatic('admin/index.html'));

module.exports = router;
