const mealService = require('../../services/meal/meal.service');
const exerciseService = require('../../services/exercise/exercise.service');

class DashboardController {
  async index(req, res, next) {
    try {
      const today = new Date().toISOString();

      const [mealSummary, exerciseSummary] = await Promise.all([
        mealService.getDailySummary(req.user.id, today),
        exerciseService.getDailySummary(req.user.id, today),
      ]);

      res.render('pages/dashboard/index', {
        layout: false,
        page: 'dashboard', title: 'Dashboard',
        user: req.user,
        mealSummary,
        exerciseSummary,
      });
    } catch (err) {
      next(err);
    }
  }

  async foodSearch(req, res, next) {
    try {
      res.render('pages/dashboard/food-search', {
        layout: false,
        page: 'food-search', title: 'Food Search',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async exercise(req, res, next) {
    try {
      const today = new Date().toISOString();
      const summary = await exerciseService.getDailySummary(req.user.id, today);

      res.render('pages/dashboard/exercise', {
        layout: false,
        page: 'exercise', title: 'Exercise Log',
        user: req.user,
        exerciseSummary: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  async water(req, res, next) {
    try {
      res.render('pages/dashboard/water', {
        layout: false,
        page: 'water', title: 'Water Tracking',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async weight(req, res, next) {
    try {
      res.render('pages/dashboard/weight', {
        layout: false,
        page: 'weight', title: 'Weight Log',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async analytics(req, res, next) {
    try {
      res.render('pages/dashboard/analytics', {
        layout: false,
        page: 'analytics', title: 'Analytics',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async profile(req, res, next) {
    try {
      res.render('pages/dashboard/profile', {
        layout: false,
        page: 'profile', title: 'Profile',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async settings(req, res, next) {
    try {
      res.render('pages/dashboard/settings', {
        layout: false,
        page: 'settings', title: 'Settings',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async notifications(req, res, next) {
    try {
      res.render('pages/dashboard/notifications', {
        layout: false,
        page: 'notifications', title: 'Notifications',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async meals(req, res, next) {
    try {
      const today = new Date().toISOString();
      const result = await mealService.getMeals(req.user.id, { date: today, page: 1, limit: 50 });

      res.render('pages/dashboard/index', {
        layout: false,
        page: 'meals', title: 'Meals',
        user: req.user,
        mealSummary: result.meals,
        exerciseSummary: null,
      });
    } catch (err) {
      next(err);
    }
  }

  async mealPlanner(req, res, next) {
    try {
      res.render('pages/dashboard/index', {
        layout: false,
        page: 'meal-planner', title: 'Meal Planner',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async goals(req, res, next) {
    try {
      res.render('pages/dashboard/index', {
        layout: false,
        page: 'goals', title: 'Goals',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async achievements(req, res, next) {
    try {
      res.render('pages/dashboard/index', {
        layout: false,
        page: 'achievements', title: 'Achievements',
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DashboardController();
