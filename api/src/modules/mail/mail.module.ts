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
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
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
