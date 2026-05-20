import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CreatesDto from './dto/create-sensorreading.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SensorsGateway } from './webSocketGateway';
import { RedisService } from '@/config/redis/redis.service';
import { Prisma, UserRole } from '@/generated/prisma/client';
import { AuthUserPayload } from '../auth/auth.jwt';

type FindAllReadingsFilters = {
  sensorCode?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  user?: AuthUserPayload;
};

type SensorReadingState = Omit<CreatesDto, 'timestamp'> & {
  timestamp?: string | Date;
};

@Injectable()
export class SensorreadingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: SensorsGateway,
    private readonly redis: RedisService,
  ) {}

  async create(data: CreatesDto) {
    const { sensorCode, timestamp, ...reading } = data;

    const isSensorValid = await this.prisma.sensor.findUnique({
      where: { sensorCode },
    });

    if (!isSensorValid) {
      throw new BadRequestException('Sensor inválido.');
    }

    const createdReading = await this.prisma.sensorReadings.create({
      data: {
        ...reading,
        ...(timestamp
          ? { createdAt: this.parseDate(timestamp, 'Timestamp') }
          : {}),
        sensorId: isSensorValid.id,
      },
    });

    return this.onSensorStateChange(isSensorValid.id, {
      ...data,
      timestamp: createdReading.createdAt,
    });
  }

  async createMany(data: CreatesDto[]) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new BadRequestException('Informe pelo menos uma leitura.');
    }

    // 1. Extrair códigos únicos de sensores
    const sensorCodes = [...new Set(data.map((item) => item.sensorCode))];

    // 2. Buscar todos os sensores existentes em uma única consulta
    const existingSensors = await this.prisma.sensor.findMany({
      where: { sensorCode: { in: sensorCodes } },
    });

    // 3. Mapear código -> sensor para acesso rápido
    const sensorMap = new Map(existingSensors.map((s) => [s.sensorCode, s]));

    // 4. Verificar se algum sensor é inválido
    const invalidCodes = sensorCodes.filter((code) => !sensorMap.has(code));
    if (invalidCodes.length) {
      throw new BadRequestException(
        `Sensores inválidos: ${invalidCodes.join(', ')}`,
      );
    }

    // 5. Preparar as leituras antes de gravar para evitar lotes parciais.
    const readingsToCreate = data.map((readingData) => {
      const sensor = sensorMap.get(readingData.sensorCode)!;
      const { sensorCode, timestamp, ...readingWithoutCode } = readingData;

      return {
        sensorCode,
        sensorId: sensor.id,
        payload: readingWithoutCode,
        data: {
          ...readingWithoutCode,
          ...(timestamp
            ? { createdAt: this.parseDate(timestamp, 'Timestamp') }
            : {}),
          sensorId: sensor.id,
        },
      };
    });

    const createdReadings = await this.prisma.$transaction(
      readingsToCreate.map((reading) =>
        this.prisma.sensorReadings.create({ data: reading.data }),
      ),
    );

    await Promise.all(
      createdReadings.map((createdReading, index) => {
        const reading = readingsToCreate[index];
        return this.onSensorStateChange(reading.sensorId, {
          ...reading.payload,
          timestamp: createdReading.createdAt,
          sensorCode: reading.sensorCode,
        });
      }),
    );

    return createdReadings;
  }

  // Chamado sempre que um sensor muda (via MQTT, polling, webhook, etc.)
  async onSensorStateChange(sensorId: string, newState: SensorReadingState) {
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

  async findPresence(user: AuthUserPayload) {
    const connectedClients = this.gateway.getConnectedClients();
    const visibleClients = connectedClients;

    const groupedByUser = new Map<
      string,
      { sockets: Set<string>; sensorIds: Set<string> }
    >();

    visibleClients.forEach((client) => {
      const entry = groupedByUser.get(client.userId) ?? {
        sockets: new Set<string>(),
        sensorIds: new Set<string>(),
      };

      entry.sockets.add(client.clientId);
      client.sensors.forEach((sensorId) => entry.sensorIds.add(sensorId));
      groupedByUser.set(client.userId, entry);
    });

    const userIds = [...groupedByUser.keys()];
    const sensorIds = [
      ...new Set(
        [...groupedByUser.values()].flatMap((entry) => [...entry.sensorIds]),
      ),
    ];

    const [users, sensors] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          id: { in: userIds },
          deletedAt: null,
          ...(user.role === 'ADMIN'
            ? {}
            : { role: { in: [UserRole.CLIENT, UserRole.ADMIN] } }),
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
        },
      }),
      this.prisma.sensor.findMany({
        where: { id: { in: sensorIds } },
        select: { id: true, sensorCode: true },
      }),
    ]);

    const userById = new Map(users.map((item) => [item.id, item]));
    const sensorById = new Map(sensors.map((item) => [item.id, item]));

    return [...groupedByUser.entries()]
      .map(([userId, entry]) => {
        const connectedUser = userById.get(userId);
        if (!connectedUser) return null;

        return {
          user:
            user.role === 'ADMIN'
              ? connectedUser
              : {
                  id: connectedUser.id,
                  name: connectedUser.name,
                  username: connectedUser.username,
                  role: connectedUser.role,
                },
          connections: entry.sockets.size,
          sensors: [...entry.sensorIds].map((sensorId) => ({
            id: sensorId,
            sensorCode: sensorById.get(sensorId)?.sensorCode ?? sensorId,
          })),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.user.name.localeCompare(b.user.name));
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

  private parseDate(value: string | Date, field: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${field} inválida.`);
    }
    return date;
  }
}
