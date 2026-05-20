import { Module } from '@nestjs/common';
import { SensorreadingService } from './sensorreading.service';
import { SensorreadingController } from './sensorreading.controller';
import { SensorsGateway } from './webSocketGateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SensorreadingController],
  providers: [SensorreadingService, SensorsGateway],
  exports: [SensorreadingService],
})
export class SensorreadingModule {}
