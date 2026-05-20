import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SensorreadingService } from './sensorreading.service';
import CreateSensorReadingDto from './dto/create-sensorreading.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUserPayload } from '../auth/auth.jwt';
import { Role } from '../auth/decorators/role.decorator';
import { UserRole } from '@/generated/prisma/client';

@Controller('sensorreading')
export class SensorreadingController {
  constructor(private readonly sensorreadingService: SensorreadingService) {}

  @Post()
  @Public()
  create(@Body() data: CreateSensorReadingDto) {
    return this.sensorreadingService.create(data);
  }

  @Post('many')
  @Public()
  createMany(@Body() data: CreateSensorReadingDto[]) {
    return this.sensorreadingService.createMany(data);
  }

  @Get()
  findAll(
    @Query('sensorCode') sensorCode?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthUserPayload,
  ) {
    return this.sensorreadingService.findAll({
      sensorCode,
      startDate,
      endDate,
      limit,
      user,
    });
  }

  @Get('presence')
  @Role(UserRole.ADMIN, UserRole.CLIENT)
  findPresence(@CurrentUser() user: AuthUserPayload) {
    return this.sensorreadingService.findPresence(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorreadingService.findOne(id);
  }

  @Patch(':id')
  update() {
    return this.sensorreadingService.update();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorreadingService.remove(id);
  }
}
