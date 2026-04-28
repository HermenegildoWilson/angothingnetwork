import fastifyCookie from '@fastify/cookie';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { EnvService } from '../env/env.service';
import { buildValidationPipe } from './validation';
import { RedisIoAdapter } from '@/config/redis/redis-io.adapter';

export const setupApp = async (app: NestFastifyApplication) => {
  const env = app.get(EnvService);

  const allowedOrigins = [env.appUrl];

  // Socket (Redis adapter)
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(env.redisUrl);
  app.useWebSocketAdapter(redisIoAdapter);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.register(fastifyCookie);
  app.useGlobalPipes(buildValidationPipe());

  return env;
};
