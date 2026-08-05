# POSHAARYA Table Dependency Graph (Logical Creation Order)

When creating the SQL schema, tables must be generated in a specific order to avoid `Foreign Key Constraint` errors. Tables with no foreign keys (independent tables) must be created first, followed by tables that depend on them.

## Level 0: Independent Tables (No Foreign Keys)
*   `organizations`
*   `roles`
*   `permissions`
*   `food_categories`
*   `exercise_categories`
*   `tags`

## Level 1: Core Dependencies
*   `departments` (Depends on `organizations`)
*   `role_permissions` (Depends on `roles`, `permissions`)
*   `users` (Depends on `organizations`)
*   `teams` (Depends on `organizations`, `departments`)

## Level 2: User-Dependent Tables
*   `user_roles` (Depends on `users`, `roles`)
*   `organization_roles` (Depends on `users`, `organizations`, `roles`)
*   `team_members` (Depends on `teams`, `users`)
*   `profiles` (Depends on `users`)
*   `health_profiles` (Depends on `users`)
*   `fitness_profiles` (Depends on `users`)
*   `user_preferences` (Depends on `users`)
*   `privacy_settings` (Depends on `users`)
*   `notification_settings` (Depends on `users`)
*   `emergency_contacts` (Depends on `users`)
*   `family_groups` (Depends on `users` [Billing Owner])
*   `auth_sessions` (Depends on `users`)
*   `auth_refresh_tokens` (Depends on `users`)
*   `auth_otps` (Depends on `users`)
*   `login_history` (Depends on `users`)
*   `api_keys` (Depends on `users`, `organizations`)

## Level 3: Domain Entities (Food & Exercise)
*   `family_members` (Depends on `family_groups`, `users`)
*   `foods` (Depends on `organizations`, `users`, `food_categories`)
*   `exercises` (Depends on `organizations`, `users`, `exercise_categories`)

## Level 4: Complex Dependencies (Versioning & Nutrition)
*   `food_versions` (Depends on `foods`)
*   `food_translations` (Depends on `foods`)
*   `food_synonyms` (Depends on `foods`)
*   `nutritional_info` (Depends on `foods`, `food_versions`)
*   `recipes` (Depends on `organizations`, `users`)
*   `workout_plans` (Depends on `organizations`, `users`)

## Level 5: Transactional Data (Meals, Logs, Plans)
*   `recipe_versions` (Depends on `recipes`)
*   `recipe_ingredients` (Depends on `recipe_versions`, `foods`)
*   `recipe_steps` (Depends on `recipe_versions`)
*   `meals` (Depends on `users`)
*   `meal_items` (Depends on `meals`, `foods`, `recipes`)
*   `meal_plans` (Depends on `users`, `organizations`)
*   `workout_weeks` (Depends on `workout_plans`)
*   `exercise_logs` (Depends on `users`, `exercises`)
*   `body_measurements` (Depends on `users`)
*   `progress_photos` (Depends on `users`)
*   `weight_logs` (Depends on `users`)

## Level 6: Advanced Tracking & E-Commerce
*   `meal_plan_versions` (Depends on `meal_plans`)
*   `meal_plan_days` (Depends on `meal_plan_versions`)
*   `workout_days` (Depends on `workout_weeks`)
*   `subscriptions` (Depends on `users`, `organizations`)
*   `invoices` (Depends on `users`, `subscriptions`)
*   `payments` (Depends on `invoices`)
*   `wallets` (Depends on `users`)
*   `wallet_transactions` (Depends on `wallets`)
*   `coupons` (Depends on `organizations`)
*   `referrals` (Depends on `users`)

## Level 7: System & Content
*   `media` (Depends on `users`, and polymorphic `entity_id`)
*   `blogs` (Depends on `users`, `organizations`)
*   `notifications` (Depends on `users`)
*   `audit_logs` (Depends on `users`, `organizations`)
*   `ai_prediction_logs` (Depends on `users`)
*   `feature_flags` (Depends on `organizations`)
