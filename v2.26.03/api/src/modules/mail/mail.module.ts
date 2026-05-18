import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { EnvService } from '@/config/env/env.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        transport: {
          host: env.mailHost,
          port: env.mailPort,
          secure: env.mailSecure,
          connectionTimeout: env.mailConnectionTimeout,
          greetingTimeout: env.mailConnectionTimeout,
          socketTimeout: env.mailConnectionTimeout,
          auth: {
            user: env.mailUser,
            pass: env.mailPass,
          },
        },
        defaults: {
          from: `"Angothingnetwork" <${env.mailUser}>`,
        },
        template: {
          dir: join(process.cwd(), 'src/modules/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
