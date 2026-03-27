import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Api Configuration
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  LOG_LEVEL: Joi.string().required(),

  API_PORT: Joi.number().required(),
  API_HOST: Joi.string().required(),

  // Database (if needed in future)
  DATABASE_URL: Joi.string().optional(),

  // CORS | App Configuration
  APP_URL: Joi.string().uri().required(),

  // Security
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_IN: Joi.string().required(),
  JWT_REFRESH_IN: Joi.string().required(),
  REFRESH_COOKIE_NAME: Joi.string().required(),

  // Mais Service
  MAIL_USER: Joi.string().email().required(),
  MAIL_PASS: Joi.string().required(),
});
