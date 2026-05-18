import { BadRequestException, Injectable } from '@nestjs/common';
import CreateSensorDto from './dto/create-sensor.dto';
import UpdateSensorDto from './dto/update-sensor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import CreateSensorAllocationDto from './dto/create-sensorallocation.dto';
import type { AuthUserPayload } from '../auth/auth.jwt';

@Injectable()
export class SensorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSensorDto, user: AuthUserPayload) {
    const sensor = await this.createSensor(data);
    await this.allocate({ sensorId: sensor.id, userId: user.id });
    await this.ensureAdminsAllocatedToAllSensors();
    return sensor;
  }

  async allocate(data: CreateSensorAllocationDto) {
    const isSensorValid = await this.findOne({ where: { id: data.sensorId } });

    if (!isSensorValid) {
      throw new BadRequestException('Sensor inválido.');
    }

    const isUserValid = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!isUserValid) {
      throw new BadRequestException('Usuário inexistente.');
    }

    const existingAllocation = await this.prisma.sensorAllocation.findFirst({
      where: {
        sensorId: data.sensorId,
        userId: data.userId,
      },
    });

    if (existingAllocation) {
      if (!existingAllocation.deletedAt) {
        return existingAllocation;
      }

      return this.prisma.sensorAllocation.update({
        where: { id: existingAllocation.id },
        data: { deletedAt: null },
      });
    }

    return this.prisma.sensorAllocation.create({ data });
  }

  async ensureAdminsAllocatedToAllSensors() {
    const [admins, sensors] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'ADMIN', deletedAt: null },
        select: { id: true },
      }),
      this.prisma.sensor.findMany({
        where: { deletedAt: null },
        select: { id: true },
      }),
    ]);

    if (admins.length === 0 || sensors.length === 0) {
      return { count: 0 };
    }

    return this.prisma.sensorAllocation.createMany({
      data: admins.flatMap((admin) =>
        sensors.map((sensor) => ({
          userId: admin.id,
          sensorId: sensor.id,
        })),
      ),
      skipDuplicates: true,
    });
  }

  findAll(args?: Prisma.SensorFindManyArgs) {
    return this.prisma.sensor.findMany(args);
  }

  findVisibleToUser(user: AuthUserPayload) {
    if (user.role === 'ADMIN') {
      return this.findAll({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.findByUser(user.id);
  }

  findByUser(userId: string) {
    return this.prisma.sensor.findMany({
      where: {
        deletedAt: null,
        sensorAllocations: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
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

  private async createSensor(data: CreateSensorDto) {
    try {
      return await this.prisma.sensor.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Já existe um sensor com este código.');
      }

      throw error;
    }
  }
}
