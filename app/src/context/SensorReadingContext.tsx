import type { SensorReadingDto } from "@/services/sensor/types";
import { createContext } from "react";

type typeSensorReadingContext = {
  connected: boolean;
  subscribe: (sensorId: string) => void;
  unsubscribe: (sensorId: string) => void;
  SensorReading: SensorReadingDto[];
};

export const SensorReadingContext =
  createContext<typeSensorReadingContext>(null);
