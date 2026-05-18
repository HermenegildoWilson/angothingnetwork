import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from '@/config/env/env.service';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: EnvService,
          useValue: {
            resendApiKey: 'test_resend_api_key',
            resendFrom: 'Angothingnetwork <onboarding@resend.dev>',
            appUrl: 'http://localhost:5173',
            apiUrl: 'http://localhost:3000',
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
