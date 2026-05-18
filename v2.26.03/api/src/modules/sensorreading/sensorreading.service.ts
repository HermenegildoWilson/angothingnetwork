import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CreatesDto from './dto/create-sensorreading.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SensorsGateway } from './webSocketGateway';
import { RedisService } from '@/config/redis/redis.service';
import { Prisma } from '@/generated/prisma/client';
import { AuthUserPayload } from '../auth/auth.jwt';

type FindAllReadingsFilters = {
  sensorCode?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  user?: AuthUserPayload;
};

@Injectable()
export class SensorreadingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: SensorsGateway,
    private readonly redis: RedisService,
  ) {}

  async create(data: CreatesDto) {
    const { sensorCode, ...reading } = data;

    const isSensorValid = await this.prisma.sensor.findUnique({
      where: { sensorCode },
    });

    if (!isSensorValid) {
      throw new BadRequestException('Sensor inválido.');
    }

    const crestedReading = await this.prisma.sensorReadings.create({
      data: { ...reading, sensorId: isSensorValid.id },
    });

    return this.onSensorStateChange(isSensorValid.id, {
      ...data,
      timestamp: crestedReading.createdAt,
    });
  }

  // Chamado sempre que um sensor muda (via MQTT, polling, webhook, etc.)
  async onSensorStateChange(sensorId: string, newState: CreatesDto) {
    // 1. Persiste no teu DB se necessário
    // await this.repo.save({ sensorId, state: newState });

    // 1.1 Cache no Redis (último estado)
    await this.redis.setSensorState(sensorId, newState);

    // 2. Emite apenas para a sala desse sensor
    this.gateway.emitSensorUpdate(sensorId, newState);

    return newState;
  }

  private toResponse(reading: {
    sensor: { sensorCode: string };
    temperature: number;
    humidity: number;
    pressure: number;
    air_quality: number;
    createdAt: Date;
  }) {
    return {
      sensorCode: reading.sensor.sensorCode,
      temperature: reading.temperature,
      humidity: reading.humidity,
      pressure: reading.pressure,
      air_quality: reading.air_quality,
      timestamp: reading.createdAt,
    };
  }

  async findAll(filters: FindAllReadingsFilters = {}) {
    const take = this.parseLimit(filters.limit);
    const where: Prisma.SensorReadingsWhereInput = {};

    if (filters.sensorCode) {
      where.sensor = { sensorCode: filters.sensorCode };
    }

    if (filters.user?.role !== 'ADMIN') {
      where.sensor = {
        ...(where.sensor as Prisma.SensorWhereInput | undefined),
        sensorAllocations: {
          some: {
            userId: filters.user?.id,
            deletedAt: null,
          },
        },
      };
    }

    const createdAt: Prisma.DateTimeFilter = {};
    if (filters.startDate) {
      createdAt.gte = this.parseDate(filters.startDate, 'Data inicial');
    }
    if (filters.endDate) {
      createdAt.lte = this.parseDate(filters.endDate, 'Data final');
    }
    if (createdAt.gte || createdAt.lte) {
      where.createdAt = createdAt;
    }

    const readings = await this.prisma.sensorReadings.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      include: { sensor: { select: { sensorCode: true } } },
    });

    return readings.map((reading) => this.toResponse(reading)).reverse();
  }

  async findOne(id: string) {
    const reading = await this.prisma.sensorReadings.findUnique({
      where: { id },
      include: { sensor: { select: { sensorCode: true } } },
    });

    if (!reading) {
      throw new NotFoundException('Leitura não encontrada.');
    }

    return this.toResponse(reading);
  }

  update() {
    throw new BadRequestException('Atualização de leituras não é suportada.');
  }

  async remove(id: string) {
    const result = await this.prisma.sensorReadings.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundException('Leitura não encontrada.');
    }

    return { message: 'Leitura removida com sucesso.' };
  }

  private parseLimit(value?: string) {
    if (!value) return 100;
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
      throw new BadRequestException('O limite deve estar entre 1 e 1000.');
    }
    return limit;
  }

  private parseDate(value: string, field: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${field} inválida.`);
    }
    return date;
  }
}
