import { env } from "@/config/env/env";
import { authStore } from "@/services/auth/auth.store";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentSensorIdsKey = "";
let currentAccessToken: string | null = null;

export function getSocket(sensorIds: string[]): Socket {
  const nextSensorIdsKey = sensorIds.join(",");
  const nextAccessToken = authStore.getState().accessToken;
  const shouldRecreate =
    socket &&
    (currentAccessToken !== nextAccessToken ||
      (sensorIds.length > 0 && currentSensorIdsKey !== nextSensorIdsKey));

  if (socket && !shouldRecreate) return socket;
  if (socket && shouldRecreate) {
    socket.disconnect();
    socket = null;
  }

  socket = io(env.apiUrl, {
    query: { sensors: sensorIds.join(",") },
    auth: { token: nextAccessToken },
    autoConnect: false,
    // controlamos quando conectar
  });
  currentSensorIdsKey = nextSensorIdsKey;
  currentAccessToken = nextAccessToken;

  return socket;
}

export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  currentSensorIdsKey = "";
  currentAccessToken = null;
}
