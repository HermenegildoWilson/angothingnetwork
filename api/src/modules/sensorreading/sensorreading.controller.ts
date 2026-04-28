import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SensorreadingService } from './sensorreading.service';
import CreateSensorReadingDto from './dto/create-sensorreading.dto';

@Controller('sensorreading')
export class SensorreadingController {
  constructor(private readonly sensorreadingService: SensorreadingService) {}

  @Post()
  create(@Body() data: CreateSensorReadingDto) {
    return this.sensorreadingService.create(data);
  }

  @Get()
  findAll() {
    return this.sensorreadingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorreadingService.findOne(+id);
  }

  @Patch(':id')
  update() {
    return this.sensorreadingService.update();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorreadingService.remove(+id);
  }
}
