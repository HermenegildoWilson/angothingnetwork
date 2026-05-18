import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient } from 'redis';
import { EnvService } from '@/config/env/env.service';
import CreateSensorReadingDto from '@/modules/sensorreading/dto/create-sensorreading.dto';

type RedisClient = ReturnType<typeof createClient>;
type SensorReadingState = Omit<CreateSensorReadingDto, 'timestamp'> & {
  timestamp?: string | Date;
};

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisClient;
  private connected = false;

  constructor(private readonly env: EnvService) {
    this.client = createClient({ url: this.env.redisUrl });
    this.client.on('error', (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Redis cache error: ${message}`);
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.connected = true;
      this.logger.log('Redis cache conectado');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.connected = false;
      this.logger.warn(
        `Redis cache indisponível. Cache desativado: ${message}`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.client.quit();
    }
  }

  private buildSensorKey(sensorId: string) {
    return `sensor:last:${sensorId}`;
  }

  async setSensorState(sensorId: string, payload: SensorReadingState) {
    if (!this.connected) return;
    const key = this.buildSensorKey(sensorId);
    const data = {
      ...payload,
      timestamp: payload.timestamp
        ? new Date(payload.timestamp).toISOString()
        : undefined,
    };
    await this.client.set(key, JSON.stringify(data));
  }

  async getSensorState(
    sensorId: string,
  ): Promise<CreateSensorReadingDto | null> {
    if (!this.connected) return null;
    const key = this.buildSensorKey(sensorId);
    const raw = await this.client.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as CreateSensorReadingDto;
  }

  async getSensorStates(sensorIds: string[]) {
    if (!this.connected) return [] as CreateSensorReadingDto[];
    if (sensorIds.length === 0) return [] as CreateSensorReadingDto[];
    const keys = sensorIds.map((id) => this.buildSensorKey(id));
    const values = await this.client.mGet(keys);
    return values
      .map((value) =>
        value ? (JSON.parse(value) as CreateSensorReadingDto) : null,
      )
      .filter((value): value is CreateSensorReadingDto => value !== null);
  }
}
