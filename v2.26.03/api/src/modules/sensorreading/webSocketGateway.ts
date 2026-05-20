import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import CreateSensorReadingDto from './dto/create-sensorreading.dto';
import { RedisService } from '@/config/redis/redis.service';
import { AuthService } from '../auth/auth.service';
import type { AuthUserPayload } from '../auth/auth.jwt';
import { PrismaService } from '../prisma/prisma.service';

type SensorReadingState = Omit<CreateSensorReadingDto, 'timestamp'> & {
  timestamp?: string | Date;
};

interface ClientMeta {
  sensorIds: string[];
  user: AuthUserPayload;
}

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class SensorsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SensorsGateway.name);

  @WebSocketServer()
  server: Server | undefined;

  // Map de controlo: clientId → metadados (salas em que está)
  private clients = new Map<string, ClientMeta>();
  // Map userId → sockets
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly redis: RedisService,
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    const user = this.authenticate(client);
    if (!user) {
      client.emit('exception', { message: 'Token de acesso inválido.' });
      client.disconnect(true);
      return;
    }

    const sensorIds = this.parseSensorIds(client);
    const allowedSensorIds = await this.filterAllowedSensorIds(user, sensorIds);

    this.clients.set(client.id, { sensorIds: allowedSensorIds, user });

    const set = this.userSockets.get(user.id) ?? new Set<string>();
    set.add(client.id);
    this.userSockets.set(user.id, set);

    // Entrada automática nas salas
    for (const id of allowedSensorIds) {
      await client.join(`sensor:${id}`);
    }

    const initialReadings = await this.redis.getSensorStates(allowedSensorIds);

    if (initialReadings.length > 0) {
      client.emit('sensor:init', initialReadings);
    }

    this.logger.log(
      `Cliente ${client.id} (userId=${user.id}) entrou nas salas: ${allowedSensorIds
        .map((id) => `sensor:${id}`)
        .join(', ')}`,
    );
  }

  handleDisconnect(client: Socket) {
    const meta = this.clients.get(client.id);
    if (meta?.user.id) {
      const set = this.userSockets.get(meta.user.id);
      if (set) {
        set.delete(client.id);
        if (set.size === 0) this.userSockets.delete(meta.user.id);
      }
    }
    this.clients.delete(client.id);
    this.logger.log(`Cliente ${client.id} desconectado`);
  }

  // Permite ao cliente subscrever/abandonar sensores em runtime
  @SubscribeMessage('subscribe-sensor')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() sensorId: string,
  ) {
    const meta = this.clients.get(client.id);
    if (!meta) return;
    if (!(await this.canAccessSensor(meta.user, sensorId))) {
      return;
    }

    await client.join(`sensor:${sensorId}`);
    if (!meta.sensorIds.includes(sensorId)) {
      meta.sensorIds.push(sensorId);
    }

    const cached = await this.redis.getSensorState(sensorId);
    if (cached) {
      client.emit('sensor:update', cached);
    }
  }

  @SubscribeMessage('unsubscribe-sensor')
  async handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() sensorId: string,
  ) {
    const meta = this.clients.get(client.id);
    if (!meta) return;

    await client.leave(`sensor:${sensorId}`);
    meta.sensorIds = meta.sensorIds.filter((id) => id !== sensorId);
  }

  // Chamado pelo SensorService quando um sensor muda de estado
  emitSensorUpdate(sensorId: string, payload: SensorReadingState) {
    this.server?.to(`sensor:${sensorId}`).emit('sensor:update', payload);
  }

  // Utilitário: quem está em que sala
  getConnectedClients() {
    return [...this.clients.entries()].map(([id, meta]) => ({
      clientId: id,
      sensors: meta.sensorIds,
      userId: meta.user.id,
    }));
  }

  getConnectedUsers() {
    return [...this.userSockets.entries()].map(([userId, sockets]) => ({
      userId,
      sockets: [...sockets],
      connections: sockets.size,
    }));
  }

  private parseSensorIds(client: Socket): string[] {
    const raw = client.handshake.query['sensors'];
    if (!raw) return [];
    const values = Array.isArray(raw) ? raw : raw.split(',');
    return values.map((id) => id.trim()).filter(Boolean);
  }

  private authenticate(client: Socket): AuthUserPayload | null {
    const rawToken = client.handshake.auth?.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    if (typeof token !== 'string' || token.trim().length === 0) return null;

    try {
      return this.authService.verifyAccessToken(token);
    } catch {
      return null;
    }
  }

  private async filterAllowedSensorIds(
    user: AuthUserPayload,
    sensorIds: string[],
  ) {
    const uniqueSensorIds = [...new Set(sensorIds)];
    if (user.role === 'ADMIN' || uniqueSensorIds.length === 0) {
      return uniqueSensorIds;
    }

    const allocations = await this.prisma.sensorAllocation.findMany({
      where: {
        userId: user.id,
        sensorId: { in: uniqueSensorIds },
        deletedAt: null,
      },
      select: { sensorId: true },
    });

    return allocations.map((allocation) => allocation.sensorId);
  }

  private async canAccessSensor(user: AuthUserPayload, sensorId: string) {
    if (user.role === 'ADMIN') return true;

    const allocation = await this.prisma.sensorAllocation.findFirst({
      where: {
        userId: user.id,
        sensorId,
        deletedAt: null,
      },
      select: { id: true },
    });

    return Boolean(allocation);
  }
}
