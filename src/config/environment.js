const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const loadConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  const config = {
    app: {
      name: process.env.APP_NAME || 'Poshaarya',
      port: parseInt(process.env.APP_PORT, 10) || 8080,
      url: process.env.APP_URL || 'http://localhost:8080',
      env,
      isDevelopment: env === 'development',
      isProduction: env === 'production',
      isTest: env === 'test',
      apiPrefix: process.env.API_PREFIX || '/api/v1',
    },

    db: {
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      name: process.env.DB_NAME || 'poshaarya',
    },

    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD,
      prefix: process.env.REDIS_PREFIX || 'poshaarya:',
    },

    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
      refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
      rememberExpiry: process.env.JWT_REMEMBER_EXPIRY || '30d',
    },

    otp: {
      expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10,
      digits: parseInt(process.env.OTP_DIGITS, 10) || 6,
    },

    bcrypt: {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
    },

    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    email: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.EMAIL_FROM || 'noreply@poshaarya.com',
      fromName: process.env.EMAIL_FROM_NAME || 'Poshaarya',
    },

    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
      authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,
    },

    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    },

    session: {
      secret: process.env.SESSION_SECRET,
      expiryHours: parseInt(process.env.SESSION_EXPIRY_HOURS, 10) || 24,
    },

    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
      allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'jpeg,jpg,png,webp,svg').split(','),
    },

    cache: {
      ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS, 10) || 300,
      enabled: process.env.CACHE_ENABLED === 'true',
    },

    features: {
      aiEnabled: process.env.AI_ENABLED === 'true',
      suggestionsEnabled: process.env.SUGGESTIONS_ENABLED !== 'false',
      batchProcessingEnabled: process.env.BATCH_PROCESSING_ENABLED === 'true',
    },
  };

  return config;
};

module.exports = loadConfig();
