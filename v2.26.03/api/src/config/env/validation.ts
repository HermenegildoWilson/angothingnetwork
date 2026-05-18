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

  // Mail Service
  RESEND_API_KEY: Joi.string().required(),
  RESEND_FROM: Joi.string().default('Angothingnetwork <onboarding@resend.dev>'),
});
