import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@/generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/decorators/role.decorator';
import type { AuthUserPayload } from '../auth/auth.jwt';
import CreateSensorAccessRequestDto from './dto/create-sensor-access-request.dto';
import { SensorAccessRequestService } from './sensor-access-request.service';

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Controller('sensor-access-requests')
export class SensorAccessRequestController {
  constructor(
    private readonly accessRequestService: SensorAccessRequestService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: AuthUserPayload,
    @Body() data: CreateSensorAccessRequestDto,
  ) {
    return this.accessRequestService.create(user, data.sensorId);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUserPayload,
    @Query('status') status?: RequestStatus,
  ) {
    return this.accessRequestService.findForUser(user, status);
  }

  @Patch(':id/approve')
  @Role(UserRole.ADMIN)
  approve(@Param('id') id: string) {
    return this.accessRequestService.approve(id);
  }

  @Patch(':id/reject')
  @Role(UserRole.ADMIN)
  reject(@Param('id') id: string) {
    return this.accessRequestService.reject(id);
  }
}
