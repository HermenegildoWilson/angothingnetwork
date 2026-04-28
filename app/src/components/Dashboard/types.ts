import type { parameterOptionsPayload } from "@/config/sensor/types";

export type TemporalMeterProps = {
  value: number;
  config: parameterOptionsPayload;
};

export type TemporalGraphProps = {
  labels: string[];
  values: number[];
  config: parameterOptionsPayload;
  maxPoints: number
};
