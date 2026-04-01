import { useContext } from "react";
import { SensorReadingContext } from "@/context/SensorReadingContext";

export const useSensorsReading = () => {
  const context = useContext(SensorReadingContext);
  if (!context) {
    throw new Error(
      "useSensorsReading deve ser usado dentro do SensorsReadingProvider",
    );
  }

  return context;
};
