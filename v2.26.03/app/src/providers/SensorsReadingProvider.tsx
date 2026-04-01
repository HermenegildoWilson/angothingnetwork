import { useEffect, useReducer } from "react";
import { SensorReadingContext } from "@/context/SensorReadingContext";
import {
  initialSensorReading,
  sensorReadingReducer,
} from "@/services/sensor/sensorreading.service";

export default function SensorsReadingProvider({ children }) {
  const [state, dispatch] = useReducer(
    sensorReadingReducer,
    initialSensorReading,
  );

  useEffect(() => {
    dispatch({
      type: "INIT_SENSORS_READING",
      reading: {
        init: [
          {
            sensorCode: "Esp-32-001",
            temperature: 10,
            humidity: 10,
            pressure: 10,
            air_quality: 10,
            timestamp: new Date(),
          },
          {
            sensorCode: "Esp-32-002",
            temperature: 20,
            humidity: 20,
            pressure: 20,
            air_quality: 20,
            timestamp: new Date(),
          },
        ],
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "UPDATE_SENSOR_READING",
      reading: {
        new: {
          sensorCode: "Esp-32-002",
          temperature: 11,
          humidity: 10,
          pressure: 10,
          air_quality: 10,
          timestamp: new Date(),
        },
      },
    });
  }, []);

  return (
    <SensorReadingContext.Provider value={state}>
      {children}
    </SensorReadingContext.Provider>
  );
}
