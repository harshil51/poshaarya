# Deployment Guide

## Production Architecture

```
[User] → [Cloudflare/CDN] → [Nginx] → [Node.js App] → [MySQL + Redis]
                                        ↓
                                  [Cloudinary]
```

## Server Requirements

- 2 vCPU, 4GB RAM (minimum)
- 20GB SSD storage
- Ubuntu 22.04 LTS (recommended)
- Docker & Docker Compose installed

## Environment Variables (Production)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV=production` | Yes | Production mode |
| `DATABASE_URL` | Yes | Production MySQL URL |
| `JWT_ACCESS_SECRET` | Yes | 32+ char random string |
| `JWT_REFRESH_SECRET` | Yes | 32+ char random string |
| `REDIS_HOST` | Yes | Redis server address |
| `CLOUDINARY_*` | No | Image storage |
| `SMTP_*` | No | Email service |

## SSL Certificate

```bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d poshaarya.com -d www.poshaarya.com
```

## Deployment Steps

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/poshaarya.git
cd poshaarya
cp .env.example .env
# Edit .env with production values
```

### 2. Build & Deploy

```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### 3. Run Migrations

```bash
docker-compose exec app npx prisma migrate deploy
```

### 4. Setup SSL

Place certificates in `docker/nginx/ssl/` or use a reverse proxy.

### 5. Monitoring

```bash
# Check logs
docker-compose logs -f app

# Check health
curl http://localhost:8080/health
```

## Backup Strategy

```bash
# Database backup
docker exec poshaarya-mysql mysqldump -u root -p poshaarya > backup.sql

# Redis backup
docker exec poshaarya-redis redis-cli SAVE

# Uploads backup
tar -czf uploads-backup.tar.gz /path/to/uploads
```

## Scaling

- **Horizontal**: Run multiple app containers behind Nginx load balancer
- **Database**: Use MySQL replication or managed service
- **Cache**: Deploy Redis cluster
- **CDN**: Use Cloudflare for static assets
