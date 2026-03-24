import { useEffect, useMemo, useState } from "react";
import { useSensors } from "../../hooks/useSensors";
import {
    parameterOptions,
    initialHistory,
} from "../../components/Dashboard/config";
import SensorMonitorBase from "../../components/Dashboard/SensorMonitorBase";

const MAX_POINTS = 10;

export default function RealTime() {
    const { sensors, sensorCodes, sensorLocation } = useSensors();

    // sensor ativo
    const [sensorCode, setSensorCode] = useState(sensorCodes[0]);

    const handleFilter = ({ newSensorCode }) => {
        setSensorCode(newSensorCode);
    };

    // parâmetro ativo
    const [activeParam, setActiveParam] = useState(
        Object.keys(parameterOptions)[0]
    );

    // histórico local por sensor
    const [history, setHistory] = useState({});

    // leitura atual do sensor ativo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const actualReading = sensors?.[sensorCode] ?? {};

    /* ===================== HISTÓRICO CIRCULAR ===================== */
    useEffect(() => {
        if (!actualReading || !actualReading.timestamp) return;
        setHistory((prev) => {
            const prevSensorHistory =
                prev[sensorCode] ?? structuredClone(initialHistory);

            const dataHour = new Date(
                actualReading.timestamp
            ).toLocaleTimeString("pt-PT", {
                hour12: false,
            });
            const newLabels = [...prevSensorHistory.labels, dataHour].slice(
                -MAX_POINTS
            );

            const updated = {
                labels: newLabels,
            };

            Object.keys(parameterOptions).forEach((param) => {
                updated[param] = [
                    ...(prevSensorHistory[param] ?? []),
                    Number(actualReading[param]),
                ].slice(-MAX_POINTS);
            });

            return {
                ...prev,
                [sensorCode]: updated,
            };
        });
    }, [actualReading, sensorCode]);

    /* ===================== HISTÓRICO ATIVO ===================== */
    const activeHistory = useMemo(() => {
        return history?.[sensorCode] ?? initialHistory;
    }, [history, sensorCode]);

    return (
        <SensorMonitorBase
            title="Monitoramento em Tempo Real"
            sensorCodes={sensorCodes}
            sensorLocation={sensorLocation}
            sensorCode={sensorCode}
            onFilter={handleFilter}
            activeParam={activeParam}
            onParamChange={setActiveParam}
            actualReading={actualReading}
            history={activeHistory}
            maxPoints={MAX_POINTS}
        />
    );
}