import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { EnvService } from '@/config/env/env.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        {
          provide: EnvService,
          useValue: {
            jwtAccessSecret: 'test-access-secret',
            jwtRefreshSecret: 'test-refresh-secret',
            jwtAccessExpiresIn: '15m',
            jwtRefreshExpiresIn: '7d',
          },
        },
        { provide: MailService, useValue: { sendSecurityAlert: jest.fn() } },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
