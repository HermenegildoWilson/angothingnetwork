import { api } from "@/config/api/api";
import type { SensorReadingDto, SensorReadingFilters } from "./types";
import parameterOptions from "@/config/sensor/parameterOptions";
import type { parameterOptionsName } from "@/config/sensor/types";

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
  all: async (filters: SensorReadingFilters = {}) => {
    try {
      const response = await api.get(`/sensorreading`, {
        params: filters,
      });

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
    sensorCode: "",
    temperature: 0,
    humidity: 0,
    pressure: 0,
    air_quality: 0,
    timestamp: "",
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
      return action.reading.init ?? [];

    case "UPDATE_SENSOR_READING":
      if (!action.reading.new) return state;
      if (
        !state.some(
          (reading) => reading.sensorCode === action.reading.new?.sensorCode,
        )
      ) {
        return [
          action.reading.new,
          ...state.filter((reading) => reading.sensorCode),
        ];
      }
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
  labels: [] as string[],
  Temperatura: [] as number[],
  Humidade: [] as number[],
  "Pressão do Ar": [] as number[],
  "Qualidade do Ar": [] as number[],
};

export function normalizeHistoryReading(
  readings: SensorReadingDto[],
  maxPoints?: number,
) {
  const history: typeof initialHistoryReading = {
    labels: [],
    Temperatura: [],
    Humidade: [],
    "Pressão do Ar": [],
    "Qualidade do Ar": [],
  };

  readings.forEach((reading) => {
    if (!reading.timestamp) return;
    history.labels.push(
      new Date(reading.timestamp).toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    (Object.keys(parameterOptions) as parameterOptionsName[]).forEach(
      (param) => {
        const config = parameterOptions[param];
        history[param].push(Number(reading[config.field] ?? 0));
      },
    );
  });

  if (maxPoints) {
    history.labels = history.labels.slice(-maxPoints);
    (Object.keys(parameterOptions) as parameterOptionsName[]).forEach(
      (param) => {
        history[param] = history[param].slice(-maxPoints);
      },
    );
  }

  return history;
}
