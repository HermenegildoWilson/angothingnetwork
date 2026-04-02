import type { Thermostat } from "@mui/icons-material";

export type parameterOptionsField =
  | "Temperatura"
  | "Humidade"
  | "Pressão do Ar"
  | "Qualidade do Ar";

export type parameterOptionsDto = {
  Temperatura: parameterOptionsPayload;
  Humidade: parameterOptionsPayload;
  "Pressão do Ar": parameterOptionsPayload;
  "Qualidade do Ar": parameterOptionsPayload;
};

export type parameterOptionsPayload = {
  name: "Temperatura" | "Humidade" | "Pressão do Ar" | "Qualidade do Ar";
  field: "temperature" | "humidity" | "pressure" | "air_quality";
  Icon: typeof Thermostat;
  min_value: number;
  max_value: number;
  warning_value: number;
  high_value: number;
  unit: "°C" | "%" | "hPa" | "AQI";
  color: "#EF4444" | "#3B82F6" | "#8B5CF6" | "#10B981";
};
