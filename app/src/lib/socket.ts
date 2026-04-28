import { env } from "@/config/env/env";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentUserId: string | null = null;

export function getSocket(sensorIds: string[], userId?: string): Socket {
  if (socket && currentUserId === (userId ?? null)) return socket;
  if (socket && currentUserId !== (userId ?? null)) {
    socket.disconnect();
    socket = null;
  }

  socket = io(env.apiUrl, {
    query: { sensors: sensorIds.join(","), userId },
    autoConnect: false,
    // controlamos quando conectar
  });
  currentUserId = userId ?? null;

  return socket;
}

export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  currentUserId = null;
}
