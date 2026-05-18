import { Module } from '@nestjs/common';
import { SensorAccessRequestController } from './sensor-access-request.controller';
import { SensorAccessRequestService } from './sensor-access-request.service';

@Module({
  controllers: [SensorAccessRequestController],
  providers: [SensorAccessRequestService],
})
export class SensorAccessRequestModule {}
