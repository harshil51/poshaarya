const ActivityLevel = {
  SEDENTARY: 'sedentary',
  LIGHTLY_ACTIVE: 'lightly_active',
  MODERATELY_ACTIVE: 'moderately_active',
  VERY_ACTIVE: 'very_active',
  EXTREMELY_ACTIVE: 'extremely_active',
};

const Lifestyle = {
  SEDENTARY: 'sedentary',
  MODERATE: 'moderate',
  ACTIVE: 'active',
  VERY_ACTIVE: 'very_active',
};

const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

const MealType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
  PRE_WORKOUT: 'pre_workout',
  POST_WORKOUT: 'post_workout',
};

const ExerciseType = {
  CARDIO: 'cardio',
  STRENGTH: 'strength',
  FLEXIBILITY: 'flexibility',
  HIIT: 'hiit',
  SPORTS: 'sports',
  YOGA: 'yoga',
  WALKING: 'walking',
  RUNNING: 'running',
  CYCLING: 'cycling',
  SWIMMING: 'swimming',
};

const IntensityLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
};

const DietType = {
  VEGETARIAN: 'vegetarian',
  VEGAN: 'vegan',
  JAIN: 'jain',
  NON_VEGETARIAN: 'non_vegetarian',
  EGGETARIAN: 'eggetarian',
  PESCATARIAN: 'pescatarian',
  KETO: 'keto',
  PALEO: 'paleo',
  MEDITERRANEAN: 'mediterranean',
};

const GoalType = {
  WEIGHT_LOSS: 'weight_loss',
  WEIGHT_GAIN: 'weight_gain',
  MAINTAIN_WEIGHT: 'maintain_weight',
  BUILD_MUSCLE: 'build_muscle',
  IMPROVE_ENDURANCE: 'improve_endurance',
  GENERAL_FITNESS: 'general_fitness',
};

const SubscriptionPlan = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

const SubscriptionStatus = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PAUSED: 'paused',
  TRIAL: 'trial',
};

const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
};

const NotificationType = {
  GOAL_ACHIEVED: 'goal_achieved',
  STREAK_MILESTONE: 'streak_milestone',
  MEAL_REMINDER: 'meal_reminder',
  WATER_REMINDER: 'water_reminder',
  EXERCISE_REMINDER: 'exercise_reminder',
  BADGE_EARNED: 'badge_earned',
  WEIGHT_UPDATE: 'weight_update',
  DAILY_SUMMARY: 'daily_summary',
  WEEKLY_REPORT: 'weekly_report',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
};

const AchievementType = {
  LOGIN_STREAK: 'login_streak',
  MEAL_TRACKED: 'meal_tracked',
  WATER_GOAL: 'water_goal',
  EXERCISE_COMPLETED: 'exercise_completed',
  WEIGHT_MILESTONE: 'weight_milestone',
  CALORIE_GOAL: 'calorie_goal',
  PROTEIN_GOAL: 'protein_goal',
  PERFECT_WEEK: 'perfect_week',
  PERFECT_MONTH: 'perfect_month',
  FIRST_MEAL: 'first_meal',
  FIRST_EXERCISE: 'first_exercise',
};

const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  DIETICIAN: 'dietician',
};

const Units = {
  WEIGHT_KG: 'kg',
  WEIGHT_LBS: 'lbs',
  HEIGHT_CM: 'cm',
  HEIGHT_FT: 'ft',
  WATER_ML: 'ml',
  WATER_OZ: 'oz',
  ENERGY_KCAL: 'kcal',
  ENERGY_KJ: 'kj',
};

const MacronutrientRatio = {
  WEIGHT_LOSS: { protein: 35, carbs: 35, fat: 30 },
  WEIGHT_GAIN: { protein: 30, carbs: 45, fat: 25 },
  BUILD_MUSCLE: { protein: 40, carbs: 35, fat: 25 },
  MAINTAIN: { protein: 25, carbs: 50, fat: 25 },
  KETO: { protein: 25, carbs: 5, fat: 70 },
};

const BMRFormulas = {
  MIFLIN_ST_JEOR: 'mifflin_st_jeor',
  HARRIS_BENEDICT: 'harris_benedict',
};

module.exports = {
  ActivityLevel,
  Lifestyle,
  Gender,
  MealType,
  ExerciseType,
  IntensityLevel,
  DietType,
  GoalType,
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentStatus,
  NotificationType,
  AchievementType,
  UserRole,
  Units,
  MacronutrientRatio,
  BMRFormulas,
};
