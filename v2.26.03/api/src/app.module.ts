import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { SensorModule } from './modules/sensor/sensor.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { EnvModule } from './config/env/env.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    UserModule,
    SensorModule,
    AuthModule,
    PrismaModule,
    EnvModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
