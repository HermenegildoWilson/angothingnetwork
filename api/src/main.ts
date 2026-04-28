import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { setupApp } from './config/app/app.setup';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const env = await setupApp(app);
  await app.listen(env.apiPort, '0.0.0.0');
  console.log(`API running at ${env.apiUrl}`);
  console.log(`APP running at ${env.appUrl}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
