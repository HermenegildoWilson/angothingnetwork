import { BadRequestException, Injectable } from '@nestjs/common';
import CreateSensorDto from './dto/create-sensor.dto';
import UpdateSensorDto from './dto/update-sensor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import CreateSensorAllocationDto from './dto/create-sensorallocation.dto';

@Injectable()
export class SensorService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateSensorDto) {
    return this.prisma.sensor.create({ data });
  }

  async allocate(data: CreateSensorAllocationDto) {
    const isSensorValid = await this.findOne({ where: { id: data.sensorId } });

    if (!isSensorValid) {
      throw new BadRequestException('Sensor inválido.');
    }

    const isUserValid = await this.findOne({ where: { id: data.sensorId } });

    if (!isUserValid) {
      throw new BadRequestException('Usuário inexistente.');
    }

    return this.prisma.sensorAllocation.create({
      data,
    });
  }

  findAll(args?: Prisma.SensorFindManyArgs) {
    return this.prisma.sensor.findMany(args);
  }

  findOne(args: Prisma.SensorFindUniqueArgs) {
    return this.prisma.sensor.findUnique(args);
  }

  update(params: {
    where: Prisma.SensorWhereUniqueInput;
    data: UpdateSensorDto;
  }) {
    return this.prisma.sensor.update(params);
  }

  remove(where: Prisma.SensorWhereUniqueInput) {
    return this.prisma.sensor.delete({ where });
  }
}
