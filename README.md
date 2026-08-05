<div align="center">
  <h1>Poshaarya</h1>
  <p><b>Premium AI-powered Nutrition, Health, Calorie & Fitness Tracking Platform</b></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#environment-variables">Environment Variables</a> •
    <a href="#api-documentation">API Documentation</a>
  </p>
</div>

---

## 📖 Overview

**Poshaarya** is a comprehensive, production-ready SaaS platform built to seamlessly track and improve users' nutrition, health, and fitness goals. It provides AI-powered predictions, personalized meal and workout plans, body measurement tracking, and a full suite of features intended for health professionals and everyday fitness enthusiasts. 

## ✨ Features

- **User & Profile Management**: Secure authentication (JWT), RBAC (Role-Based Access Control), fitness/health profiling, and organization/family group support.
- **Nutrition & Meal Tracking**: Comprehensive food logging, barcode scanning, meal planning, custom recipes, and macro/micronutrient tracking.
- **Fitness & Workout Logs**: Exercise cataloging, workout planning, logging routines, body measurements, and progress photos.
- **AI-Powered Insights**: AI integration for predictions, dietary suggestions, and automated coaching logs.
- **Payments & Subscriptions**: Integration with Stripe and Razorpay for subscription management and automated invoicing.
- **Blogging & Community**: Built-in blogging engine with multi-language translation support.
- **Real-time Notifications**: Engagement through webhooks, emails, and in-app alerts.

## 🛠 Tech Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MySQL 8.0, managed via **Prisma ORM**
- **Caching & Queues**: Redis (ioredis)
- **Authentication**: JWT, bcryptjs, OTP, and session management
- **Validation**: Zod & Joi
- **Logging**: Winston & Morgan
- **Security**: Helmet, xss, hpp, csurf, express-rate-limit

### Frontend
- **Architecture**: Static HTML, CSS, and Vanilla JS served directly from the backend
- **Templating**: EJS (for specific server-side rendered views)

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (`ci.yml`)
- **Cloud Services**: Cloudinary (Media management), SMTP/Nodemailer (Emails)

## 🏗 Architecture & Project Structure

The codebase strictly adheres to a modular, layered architecture promoting scalability and separation of concerns.

```text
├── .github/workflows/    # CI/CD pipelines
├── docker/               # Docker configs (MySQL init, Nginx)
├── docs/                 # Extended project documentation
├── frontend/             # Static frontend assets (HTML, JS, CSS)
├── prisma/               # Prisma schema, migrations, and seeds
├── src/                  # Core backend application
│   ├── config/           # Environment and service configurations
│   ├── controllers/      # Route handlers and business logic entry points
│   ├── dto/              # Data Transfer Objects
│   ├── errors/           # Custom error classes
│   ├── jobs/             # Cron jobs and scheduled tasks
│   ├── logger/           # Winston and Morgan configurations
│   ├── middlewares/      # Express middlewares (Auth, Rate Limiting, Security)
│   ├── policies/         # Authorization policies
│   ├── queues/           # Redis-backed job queues
│   ├── repositories/     # Data access layer (Prisma abstractions)
│   ├── routes/           # API route definitions
│   ├── services/         # Core business logic
│   ├── tasks/            # Background tasks
│   ├── templates/        # Email/PDF templates
│   ├── utils/            # Helper functions
│   └── validators/       # Input validation schemas (Zod/Joi)
├── tests/                # Unit and integration tests (Jest)
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- MySQL (v8.0+)
- Redis (v7+)
- Docker & Docker Compose (optional, but recommended)

### 1. Clone the repository
```bash
git clone https://github.com/poshaarya/poshaarya.git
cd poshaarya
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the sample environment file and configure it based on your local setup.
```bash
cp .env.example .env
```
*(See the [Environment Variables](#environment-variables) section below for required keys).*

### 4. Database Setup (Prisma)
Generate the Prisma client and push the schema to your local MySQL database.
```bash
npm run prisma:generate
npm run prisma:push
```
*Optional: Seed the database with initial data.*
```bash
npm run prisma:seed
```

### 5. Running the Application

**Development Mode (Local)**
```bash
npm run dev
```

**Production Mode (Docker)**
Use the provided `docker-compose.yml` to spin up the App, MySQL, Redis, and Nginx.
```bash
npm run docker:up
```

## 🔐 Environment Variables

The following environment variables must be configured in your `.env` file:

| Category | Variables | Description |
|---|---|---|
| **App** | `NODE_ENV`, `APP_PORT`, `API_PREFIX` | Core application settings |
| **Database** | `DATABASE_URL`, `DB_HOST`, `DB_NAME` | MySQL connection strings |
| **Redis** | `REDIS_HOST`, `REDIS_PORT` | Redis cache connection |
| **JWT** | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Secrets for token generation |
| **Cloudinary** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` | Media upload credentials |
| **Email (SMTP)**| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Nodemailer configuration |
| **Security** | `RATE_LIMIT_WINDOW_MS`, `CORS_ORIGIN` | API protection settings |

> **TODO:** Add documentation on how to acquire Stripe/Razorpay and AI provider API keys.

## 📡 API Documentation

The REST API is versioned and prefixed with `/api/v1`. 

Swagger documentation is fully integrated. To view the interactive API docs:
1. Ensure the server is running.
2. Run the swagger generation script (if not automatically served):
   ```bash
   npm run swagger
   ```
3. Navigate to `http://localhost:8080/api-docs` (or the respective swagger route defined in `src/config/swagger.js`) in your browser.

## 💻 Development Workflow

We use standard linting and testing practices to maintain code quality.

- **Linting**: 
  ```bash
  npm run lint
  npm run lint:fix
  ```
- **Testing**: 
  ```bash
  npm run test            # Run all tests with coverage
  npm run test:unit       # Run only unit tests
  npm run test:integration# Run only integration tests
  ```
- **Database Studio**:
  ```bash
  npm run prisma:studio   # Opens a visual editor for your local DB
  ```

## 🤝 Contributing

We welcome contributions! Please follow the steps below:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add some feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Make sure your code passes all linting (`npm run lint`) and tests (`npm run test`) before submitting a PR.

---
*Built with ❤️ by Poshaarya.*
