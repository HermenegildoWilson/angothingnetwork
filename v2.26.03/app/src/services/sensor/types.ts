export type SensorDto = {
  id: string;
  sensorCode: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  accessRequests?: SensorAccessRequestSummaryDto[];
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

export type SensorAccessRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SensorAccessRequestSummaryDto = {
  id: string;
  status: SensorAccessRequestStatus;
  createdAt?: string;
  decidedAt?: string | null;
};

export type SensorAccessRequestDto = SensorAccessRequestSummaryDto & {
  sensorId: string;
  userId: string;
  sensor: {
    id: string;
    sensorCode: string;
  };
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: "ADMIN" | "CLIENT" | "VISITOR";
  };
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
