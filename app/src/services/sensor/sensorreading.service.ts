import { api } from "@/config/api/api";
import type { SensorReadingDto } from "./types";
import parameterOptions from "@/config/sensor/parameterOptions";
import type { parameterOptionsField } from "@/config/sensor/types";

const find = {
  one: async (id: string) => {
    try {
      const response = await api.get(`/sensorreading/${id}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        ...(error.response?.data || error),
      };
    }
  },
  all: async () => {
    try {
      const response = await api.get(`/sensorreading`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        ...(error.response?.data || error),
      };
    }
  },
};
export const sensorReadingService = { find };

export const initialSensorReading = [
  {
    sensorCode: null,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    air_quality: 0,
    timestamp: null,
  },
];

export function sensorReadingReducer(
  state: SensorReadingDto[],
  action: {
    type: "INIT_SENSORS_READING" | "UPDATE_SENSOR_READING";
    reading: { new?: SensorReadingDto; init?: SensorReadingDto[] };
  },
) {
  switch (action.type) {
    case "INIT_SENSORS_READING":
      return action.reading.init;

    case "UPDATE_SENSOR_READING":
      return state.map((reading) => {
        if (action.reading.new.sensorCode === reading.sensorCode) {
          return action.reading.new;
        }
        return reading;
      });

    default:
      return state;
  }
}

export const initialHistoryReading = {
  labels: [],
  Temperatura: [],
  Humidade: [],
  "Pressão do Ar": [],
  "Qualidade do Ar": [],
};

export function normalizeHistoryReading(
  readings: SensorReadingDto[],
  maxPoints?: number,
) {
  const history: typeof initialHistoryReading = initialHistoryReading;

  readings.forEach((reading) => {
    history.labels.push(
      new Date(reading.timestamp).toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    Object.keys(parameterOptions).forEach((param: parameterOptionsField) => {
      const config = parameterOptions[param];
      history[param].push(Number(reading[config.field] ?? 0));
    });
  });

  Object.keys(history).map((param) => {
    history[param] = history[param].slice(-maxPoints);
  });

  return history;
}
