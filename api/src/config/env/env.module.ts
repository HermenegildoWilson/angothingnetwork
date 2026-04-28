import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import { envValidationSchema } from './validation';
import envConfig from './env.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema: envValidationSchema,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
