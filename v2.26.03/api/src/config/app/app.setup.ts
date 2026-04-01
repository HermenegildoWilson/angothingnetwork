import fastifyCookie from '@fastify/cookie';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { EnvService } from '../env/env.service';
import { buildValidationPipe } from './validation';

// import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { RedisIoAdapter } from '@/modules/sensorreading/redis-io.adapter';

export const setupApp = async (app: NestFastifyApplication) => {
  const env = app.get(EnvService);

  const allowedOrigins = [env.appUrl].filter(Boolean);

  // Socket
  const pubClient = createClient({ url: env.redisUrl });
  const subClient = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);

  const redisAdapter = createAdapter(pubClient, subClient);

  // Aplica o adapter ao Socket.IO server
  // const ioAdapter = app.get(IoAdapter);
  // Alternativa mais limpa: custom adapter
  app.useWebSocketAdapter(new RedisIoAdapter(app, redisAdapter));

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
