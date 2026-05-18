export type SensorDto = {
  id: string;
  sensorCode: string;
};

export type CreateSensorDto = {
  sensorCode: string;
};

export type UpdateSensorDto = {
  sensorCode?: string;
};

export type AllocateSensorDto = {
  sensorId: string;
  userId: string;
};

export type SensorReadingDto = {
  sensorCode: string;
  temperature: number;
  humidity: number;
  pressure: number;
  air_quality: number;
  timestamp: string | Date;
};

export type SensorReadingFilters = {
  sensorCode?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
};
