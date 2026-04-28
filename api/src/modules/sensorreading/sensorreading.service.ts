import { BadRequestException, Injectable } from '@nestjs/common';
import CreateSensorReadingDto from './dto/create-sensorreading.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SensorsGateway } from './webSocketGateway';
import { RedisService } from '@/config/redis/redis.service';

@Injectable()
export class SensorreadingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: SensorsGateway,
    private readonly redis: RedisService,
  ) {}

  async create(data: CreateSensorReadingDto) {
    const { sensorCode, ...reading } = data;

    const isSensorValid = await this.prisma.sensor.findUnique({
      where: { sensorCode },
    });

    if (!isSensorValid) {
      throw new BadRequestException('Sensor inválido.');
    }

    const crestedReading = await this.prisma.sensorReading.create({
      data: { ...reading, sensorId: isSensorValid.id },
    });

    return this.onSensorStateChange(isSensorValid.id, {
      ...data,
      timestamp: crestedReading.createdAt,
    });
  }

  // Chamado sempre que um sensor muda (via MQTT, polling, webhook, etc.)
  async onSensorStateChange(
    sensorId: string,
    newState: CreateSensorReadingDto,
  ) {
    // 1. Persiste no teu DB se necessário
    // await this.repo.save({ sensorId, state: newState });

    // 1.1 Cache no Redis (último estado)
    await this.redis.setSensorState(sensorId, newState);

    // 2. Emite apenas para a sala desse sensor
    this.gateway.emitSensorUpdate(sensorId, newState);

    return newState;
  }

  findAll() {
    return `This action returns all sensorreading`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sensorreading`;
  }

  update() {
    return `This action updates sensorreading`;
  }

  remove(id: number) {
    return `This action removes a #${id} sensorreading`;
  }
}
