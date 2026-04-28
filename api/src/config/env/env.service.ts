import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService) {}

  get apiUrl(): string {
    return this.config.get<string>('api.url')!;
  }

  get apiPort(): number {
    return this.config.get<number>('api.port')!;
  }

  get apiHost(): string {
    return this.config.get<string>('api.host')!;
  }

  get redisUrl(): string {
    return this.config.get<string>('api.redisUrl')!;
  }

  get appUrl(): string {
    return this.config.get<string>('app.url')!;
  }

  get appDeepLinking(): string {
    return this.config.get<string>('app.deepLinking')!;
  }

  get databaseUrl(): string {
    return this.config.get<string>('database.url')!;
  }

  get mailUser(): string {
    return this.config.get<string>('mail.user')!;
  }

  get mailPass(): string {
    return this.config.get<string>('mail.pass')!;
  }

  get jwtAccessSecret(): string {
    return this.config.get<string>('jwt.accessSecret')!;
  }

  get jwtRefreshSecret(): string {
    return this.config.get<string>('jwt.refreshSecret')!;
  }

  get jwtAccessExpiresIn(): StringValue {
    return this.config.get<StringValue>('jwt.accessExpiresIn')!;
  }

  get jwtRefreshExpiresIn(): StringValue {
    return this.config.get<StringValue>('jwt.refreshExpiresIn')!;
  }
}
