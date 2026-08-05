# Poshaarya

> **Premium AI-powered Nutrition, Health, Calorie & Fitness Tracking Platform**  
> Built for India, Designed for the World.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![License](https://img.shields.io/badge/license-UNLICENSED-blue)

---

## Overview

Poshaarya is a production-ready SaaS application for nutrition, health, calorie, and fitness tracking. It features a comprehensive Indian food database (100,000+ items), AI-powered insights, macro/micro nutrient tracking, exercise logging, and beautiful analytics dashboards.

### Target Audience
- Students & Working Professionals
- Gym Members & Athletes
- Weight Loss/Gain Users
- Dieticians & Nutritionists
- Families

### Competitive Landscape
Comparable to HealthifyMe, MyFitnessPal, Fitbit, Google Fit, Samsung Health, and Apple Health - with a unique focus on Indian cuisine and lifestyle.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+, EJS Templates, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL 8.0 with Prisma ORM |
| **Cache** | Redis 7 |
| **Auth** | JWT (Access + Refresh Tokens), bcrypt |
| **Storage** | Cloudinary |
| **Email** | Nodemailer |
| **Security** | Helmet, CORS, Rate Limiting, XSS Protection |
| **Logging** | Winston, Morgan |
| **Container** | Docker, Docker Compose |
| **Web Server** | Nginx |
| **CI/CD** | GitHub Actions |

---

## Project Structure

```
poshaarya/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/                # Configuration files
│   │   ├── environment.js     # Environment variables
│   │   ├── database.js        # Prisma client
│   │   └── redis.js           # Redis cache client
│   ├── controllers/           # Route handlers
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic
│   ├── repositories/          # Data access layer
│   ├── middlewares/           # Express middlewares
│   ├── validators/            # Request validation
│   ├── errors/                # Error classes & codes
│   ├── logger/                # Winston & Morgan config
│   ├── utils/                 # Utility functions
│   ├── helpers/               # Helper functions
│   ├── constants/             # Enums & constants
│   ├── types/                 # Type definitions
│   ├── cache/                 # Cache utilities
│   ├── tasks/                 # Cron jobs
│   └── templates/             # Email templates
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seeds/                 # Seed data
├── public/
│   ├── css/                   # Stylesheets
│   │   ├── main.css           # Design system
│   │   ├── layouts/           # Layout styles
│   │   ├── pages/             # Page-specific styles
│   │   ├── components/        # Component styles
│   │   └── themes/            # Theme files
│   ├── js/                    # JavaScript
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page scripts
│   │   ├── utils/             # Utilities
│   │   └── charts/            # Chart configurations
│   └── images/                # Images & icons
├── views/
│   ├── layouts/               # Layout templates
│   ├── pages/                 # Page templates
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── admin/             # Admin panel pages
│   │   └── static/            # Static pages
│   ├── partials/              # Reusable partials
│   └── components/            # UI components
├── tests/                     # Test files
├── docs/                      # Documentation
├── docker/                    # Docker configs
│   └── nginx/                 # Nginx configuration
├── .github/workflows/         # CI/CD pipelines
└── docker-compose.yml         # Docker orchestration
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- Redis 7+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/poshaarya.git
cd poshaarya

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database (optional)
npm run prisma:seed

# Start development server
npm run dev
```

Visit `http://localhost:8080` to access the application.

### Docker Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

---

## Database

The database schema includes 25+ tables covering:

- **Users & Auth** - Users, Profiles, Sessions, RefreshTokens, OTP
- **Food & Nutrition** - Foods, Nutrition, FoodCategories
- **Meals** - Meals, MealItems
- **Exercise** - Exercises, ExerciseLogs
- **Tracking** - WaterLogs, WeightLogs, ProgressPhotos, DailyCalories
- **Gamification** - Achievements, Badges, UserAchievements
- **Content** - Blogs, Recipes
- **Monetization** - Subscriptions, Payments
- **Communication** - Notifications, Feedback, ContactMessages

### Key Design Decisions

- **Soft deletes** with `isDeleted` and `deletedAt` fields
- **Cascade deletes** for related data
- **Full-text search** indexes on food names
- **Composite unique constraints** where appropriate
- **Enum types** for status, category, and type fields

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | MySQL connection string | - |
| `REDIS_HOST` | Redis host | `localhost` |
| `JWT_ACCESS_SECRET` | JWT signing secret (min 32 chars) | - |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:8080` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12` |

Full list available in `.env.example`.

---

## API (Coming Soon)

The REST API will be available at `/api/v1/` with endpoints for:

- `POST /api/v1/auth/*` - Authentication
- `GET/POST /api/v1/users/*` - User management
- `GET /api/v1/foods/*` - Food database
- `POST /api/v1/meals/*` - Meal logging
- `POST /api/v1/exercise/*` - Exercise logging
- `GET /api/v1/analytics/*` - Analytics & reports

API documentation will be available via Swagger UI at `/api-docs`.

---

## Features

### User Features
- **Dashboard** - Real-time health summary with charts
- **Indian Food Database** - 100,000+ items with accurate nutrition
- **Calorie Tracking** - Daily, weekly, monthly views
- **Macro/Micro Tracking** - Protein, carbs, fat, vitamins, minerals
- **Meal Planner** - AI-powered meal suggestions
- **Water Tracker** - Hydration monitoring with reminders
- **Exercise Logger** - Track workouts and calories burned
- **Weight Tracker** - Progress charts and trend analysis
- **BMI/BMR/TDEE Calculator** - Automated calculations
- **Achievements & Streaks** - Gamification system
- **Dark/Light Mode** - Theme switching
- **Responsive Design** - Mobile, tablet, desktop

### Admin Features
- User management
- Food database management
- Exercise management
- Content management (Blogs, Recipes)
- Subscription & Payment management
- Analytics & Reports
- Feedback management

---

## Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Rate limiting on all API endpoints
- Helmet security headers
- CORS protection
- XSS sanitization
- Input validation with Joi
- SQL injection prevention via Prisma
- Secure cookie handling
- Role-based access control (RBAC)

---

## Deployment

### Production Checklist
- [ ] Configure SSL certificates
- [ ] Set strong JWT secrets (32+ characters)
- [ ] Enable Redis cache
- [ ] Configure Cloudinary for image uploads
- [ ] Set up SMTP for emails
- [ ] Enable rate limiting
- [ ] Run database migrations
- [ ] Build and push Docker images
- [ ] Configure monitoring and alerts

### Using Docker (Production)

```bash
# Build production image
docker build -t poshaarya:latest .

# Deploy with docker-compose
docker-compose -f docker-compose.yml up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

---

## License

UNLICENSED - Proprietary software. All rights reserved.

---

## Support

- Email: support@poshaarya.com
- Website: https://poshaarya.com

Built with ❤️ for a healthier India.
