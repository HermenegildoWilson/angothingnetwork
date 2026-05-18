import { env } from "@/config/env/env";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentUserId: string | null = null;
let currentSensorIdsKey = "";

export function getSocket(sensorIds: string[], userId?: string): Socket {
  const nextUserId = userId ?? null;
  const nextSensorIdsKey = sensorIds.join(",");
  const shouldRecreate =
    socket &&
    (currentUserId !== nextUserId ||
      (sensorIds.length > 0 && currentSensorIdsKey !== nextSensorIdsKey));

  if (socket && !shouldRecreate) return socket;
  if (socket && shouldRecreate) {
    socket.disconnect();
    socket = null;
  }

  socket = io(env.apiUrl, {
    query: { sensors: sensorIds.join(","), userId },
    autoConnect: false,
    // controlamos quando conectar
  });
  currentUserId = nextUserId;
  currentSensorIdsKey = nextSensorIdsKey;

  return socket;
}

export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  currentUserId = null;
  currentSensorIdsKey = "";
}
