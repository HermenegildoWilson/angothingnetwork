import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Api Configuration
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  LOG_LEVEL: Joi.string().required(),

  API_PORT: Joi.number().optional(),
  PORT: Joi.number().optional(),
  API_HOST: Joi.string().optional(),
  RENDER_EXTERNAL_URL: Joi.string().uri().optional(),
  REDIS_URL: Joi.string().uri().optional(),

  // Database
  DATABASE_URL: Joi.string().uri().required(),

  // ADMIN
  ADMIN_EMAIL: Joi.string().email().required(),

  // CORS | App Configuration
  APP_HOST: Joi.string().optional(),
  APP_PORT: Joi.number().optional(),
  APP_URL: Joi.string().uri().required(),
  APP_DEEP_LINKING: Joi.string().uri().optional(),

  // Security
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_IN: Joi.string().required(),
  JWT_REFRESH_IN: Joi.string().required(),

  // Mais Service
  MAIL_HOST: Joi.string().hostname().default('smtp.gmail.com'),
  MAIL_PORT: Joi.number().port().default(587),
  MAIL_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  MAIL_CONNECTION_TIMEOUT: Joi.number().integer().min(1000).default(30000),
  MAIL_USER: Joi.string().email().required(),
  MAIL_PASS: Joi.string().required(),
});
