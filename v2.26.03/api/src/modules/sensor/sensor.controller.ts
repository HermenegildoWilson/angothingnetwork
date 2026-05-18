import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserRole } from '@/generated/prisma/client';
import { SensorService } from './sensor.service';
import CreateSensorDto from './dto/create-sensor.dto';
import UpdateSensorDto from './dto/update-sensor.dto';
import CreateSensorAllocationDto from './dto/create-sensorallocation.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/decorators/role.decorator';
import type { AuthUserPayload } from '../auth/auth.jwt';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  @Role(UserRole.ADMIN)
  create(@Body() data: CreateSensorDto, @CurrentUser() user: AuthUserPayload) {
    return this.sensorService.create(data, user);
  }

  @Post('allocate')
  @Role(UserRole.ADMIN)
  allocate(@Body() data: CreateSensorAllocationDto) {
    return this.sensorService.allocate(data);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUserPayload) {
    return this.sensorService.findVisibleToUser(user);
  }

  @Get('me/list')
  findMine(@CurrentUser() user: AuthUserPayload) {
    return this.sensorService.findByUser(user.id);
  }

  @Get('available')
  findAvailable(@CurrentUser() user: AuthUserPayload) {
    return this.sensorService.findAvailableForRequest(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorService.findOne({ where: { id } });
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() data: UpdateSensorDto) {
    return this.sensorService.update({ where: { id }, data });
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.sensorService.remove({ id });
  }
}
