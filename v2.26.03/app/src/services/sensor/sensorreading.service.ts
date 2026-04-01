import { api } from "@/config/api/api";
import type { SensorReadingDto } from "./types";

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

export const initialSensorReading = [
  {
    sensorCode: null,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    air_quality: 0,
    timestamp: undefined,
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

export const sensorReadingService = { find };
