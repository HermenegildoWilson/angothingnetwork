import type { SensorReadingDto } from "@/services/sensor/types";
import { createContext } from "react";

export const SensorReadingContext = createContext<SensorReadingDto[]>(null);
