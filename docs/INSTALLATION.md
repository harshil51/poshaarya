# Installation Guide

## Prerequisites

- **Node.js** v20.0.0 or higher
- **MySQL** 8.0 or higher
- **Redis** 7.0 or higher
- **npm** 9+ or yarn

## Step 1: Clone & Install

```bash
git clone https://github.com/your-org/poshaarya.git
cd poshaarya
npm install
```

## Step 2: Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/poshaarya

# JWT (use strong secrets - min 32 chars)
JWT_ACCESS_SECRET=your-32-char-access-secret-here
JWT_REFRESH_SECRET=your-32-char-refresh-secret-here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Step 3: Database Setup

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE poshaarya"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed data
npm run prisma:seed
```

## Step 4: Start Development

```bash
npm run dev
```

Access at `http://localhost:8080`

## Docker Setup

```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

Access at `http://localhost`
