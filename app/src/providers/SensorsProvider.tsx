import { useEffect, useRef, useState, useReducer, useCallback } from "react";
import { getSocket, destroySocket } from "@/lib/socket";

import { SensorReadingContext } from "@/context/SensorReadingContext";
import {
  initialSensorReading,
  sensorReadingReducer,
} from "@/services/sensor/sensorreading.service";
import { useAuth } from "@/hooks/useAuth";
import type { SensorReadingDto } from "@/services/sensor/types";

export default function SensorsReadingProvider({ children }) {
  const { sensor, user } = useAuth();
  const [connected, setConnected] = useState(false);
  const subscribedRef = useRef<Set<string>>(new Set());
  const [sensorData, dispatchSensorData] = useReducer(
    sensorReadingReducer,
    initialSensorReading,
  );

  useEffect(() => {
    if (sensor.ids.length === 0) return;

    const socket = getSocket(sensor.ids, user?.id);

    socket.on("connect", () => {
      setConnected(true);
      sensor.ids.forEach((id) => subscribedRef.current.add(id));
    });

    socket.on("disconnect", () => setConnected(false));

    // Evento emitido pelo NestJS: sensor:update
    socket.on("sensor:init", (init: SensorReadingDto[]) => {
      dispatchSensorData({
        type: "INIT_SENSORS_READING",
        reading: { init },
      });
    });

    // Evento emitido pelo NestJS: sensor:update
    socket.on("sensor:update", (update: SensorReadingDto) => {
      dispatchSensorData({
        type: "UPDATE_SENSOR_READING",
        reading: { new: update },
      });
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sensor:update");
      destroySocket();
    };
  }, [sensor, user?.id]);

  // Subscrever um sensor adicional em runtime
  const subscribe = useCallback(
    (sensorId: string) => {
      if (subscribedRef.current.has(sensorId)) return;
      const socket = getSocket([], user?.id);
      socket.emit("subscribe-sensor", sensorId);
      subscribedRef.current.add(sensorId);
    },
    [user?.id],
  );

  // Abandonar uma sala em runtime
  const unsubscribe = useCallback(
    (sensorId: string) => {
      if (!subscribedRef.current.has(sensorId)) return;
      const socket = getSocket([], user?.id);
      socket.emit("unsubscribe-sensor", sensorId);
      subscribedRef.current.delete(sensorId);
    },
    [user?.id],
  );

  return (
    <SensorReadingContext.Provider
      value={{
        connected,
        subscribe,
        unsubscribe,
        SensorReading: sensorData,
      }}
    >
      {children}
    </SensorReadingContext.Provider>
  );
}
