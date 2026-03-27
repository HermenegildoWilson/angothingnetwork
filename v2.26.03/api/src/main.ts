import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { EnvService } from './config/env/env.service';

type ValidationErrorLike = {
  constraints?: Record<string, string>;
  children?: ValidationErrorLike[];
};

const getFirstValidationMessage = (errors: ValidationErrorLike[]) => {
  const stack: ValidationErrorLike[] = [...errors];
  while (stack.length > 0) {
    const error = stack.shift();
    if (!error) continue;
    if (error.constraints) {
      const messages = Object.values(error.constraints);
      if (messages.length > 0) return messages[0];
    }
    if (Array.isArray(error.children) && error.children.length > 0) {
      stack.unshift(...error.children);
    }
  }
  return 'Dados inválidos.';
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const env = app.get(EnvService);
  const allowedOrigins = [env.appUrl].filter(Boolean);

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
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const message = getFirstValidationMessage(errors);
        return new BadRequestException({
          message: [message],
          error: 'Bad Request',
          statusCode: 400,
        });
      },
    }),
  );
  await app.listen(env.apiPort, '0.0.0.0');
  console.log(`API running at ${env.apiUrl}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
