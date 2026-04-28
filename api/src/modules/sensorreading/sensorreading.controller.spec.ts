import { Test, TestingModule } from '@nestjs/testing';
import { SensorreadingController } from './sensorreading.controller';
import { SensorreadingService } from './sensorreading.service';

describe('SensorreadingController', () => {
  let controller: SensorreadingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorreadingController],
      providers: [SensorreadingService],
    }).compile();

    controller = module.get<SensorreadingController>(SensorreadingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
