import { Test, TestingModule } from '@nestjs/testing';
import { SensorreadingService } from './sensorreading.service';

describe('SensorreadingService', () => {
  let service: SensorreadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorreadingService],
    }).compile();

    service = module.get<SensorreadingService>(SensorreadingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
