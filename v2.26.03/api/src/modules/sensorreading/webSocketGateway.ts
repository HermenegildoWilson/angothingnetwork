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
import { Injectable } from '@nestjs/common';
import CreateSensorReadingDto from './dto/create-sensorreading.dto';
import { RedisService } from '@/config/redis/redis.service';

interface ClientMeta {
  sensorIds: string[];
  userId: string | null;
}

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class SensorsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server | undefined;

  // Map de controlo: clientId → metadados (salas em que está)
  private clients = new Map<string, ClientMeta>();
  // Map userId → sockets
  private userSockets = new Map<string, Set<string>>();

  constructor(private readonly redis: RedisService) {}

  async handleConnection(client: Socket) {
    // Exemplo: o frontend envia os sensores que o utilizador pode ver
    // via query param ou handshake auth
    const sensorIds = this.parseSensorIds(client);
    const userId = this.parseUserId(client);

    this.clients.set(client.id, { sensorIds, userId });

    if (userId) {
      const set = this.userSockets.get(userId) ?? new Set<string>();
      set.add(client.id);
      this.userSockets.set(userId, set);
    }

    // Entrada automática nas salas
    for (const id of sensorIds) {
      await client.join(`sensor:${id}`);
    }

    const initialReadings = await this.redis.getSensorStates(sensorIds);

    if (initialReadings.length > 0) {
      client.emit('sensor:init', initialReadings);
    }

    console.log(
      `Cliente ${client.id} (userId=${userId ?? 'anon'}) entrou nas salas:`,
      sensorIds.map((id) => `sensor:${id}`),
    );
  }

  handleDisconnect(client: Socket) {
    const meta = this.clients.get(client.id);
    if (meta?.userId) {
      const set = this.userSockets.get(meta.userId);
      if (set) {
        set.delete(client.id);
        if (set.size === 0) this.userSockets.delete(meta.userId);
      }
    }
    this.clients.delete(client.id);
    console.log(`Cliente ${client.id} desconectado`);
  }

  // Permite ao cliente subscrever/abandonar sensores em runtime
  @SubscribeMessage('subscribe-sensor')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() sensorId: string,
  ) {
    const meta = this.clients.get(client.id);
    if (!meta) return;

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
  emitSensorUpdate(sensorId: string, payload: CreateSensorReadingDto) {
    this.server?.to(`sensor:${sensorId}`).emit('sensor:update', payload);
  }

  // Utilitário: quem está em que sala
  getConnectedClients() {
    return [...this.clients.entries()].map(([id, meta]) => ({
      clientId: id,
      sensors: meta.sensorIds,
      userId: meta.userId,
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
    // Podes vir do handshake auth, query, ou JWT decoded
    const raw = client.handshake.query['sensors'];
    if (!raw) return [];
    return Array.isArray(raw) ? raw : raw.split(',');
  }

  private parseUserId(client: Socket): string | null {
    const raw = client.handshake.query['userId'];
    if (!raw) return null;
    return Array.isArray(raw) ? raw[0] : String(raw);
  }
}
