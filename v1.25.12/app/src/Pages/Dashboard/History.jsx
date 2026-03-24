import { useEffect, useState } from "react";
import SensorMonitorBase from "../../components/Dashboard/SensorMonitorBase";
import {
    parameterOptions,
    initialHistory,
} from "../../components/Dashboard/config";
import { api } from "../../api/axios";
import { useSensors } from "../../hooks/useSensors";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const MAX_POINTS = 24;

export default function History() {
    const { sensorCodes, sensorLocation } = useSensors();

    const [getNewHistory, setGetNewHistory] = useState(1);
    const [sensorCode, setSensorCode] = useState(sensorCodes[0]);
    const [activeParam, setActiveParam] = useState(
        Object.keys(parameterOptions)[0]
    );

    const [date, setDate] = useState(
        () => new Date().toISOString().split("T")[0]
    );

    const handleFilter = ({ newSensorCode }) => {
        setSensorCode(newSensorCode);
        setGetNewHistory(getNewHistory + 1);
    };

    const [history, setHistory] = useState(initialHistory);
    const [actualReading, setActualReading] = useState({});

    /* ===================== FETCH HISTÓRICO ===================== */
    useEffect(() => {
        async function fetchHistory() {
            try {
                const { data } = await api.get(
                    `/sensors/${sensorCode}/history`,
                    {
                        params: {
                            sensor_code: sensorCode,
                            data: date,
                        },
                    }
                );

                const normalized = normalizeHistory(data.data ?? []);

                setHistory(normalized);

                // última leitura do dia
                const last = data.data?.[data.data.length - 1];
                if (last) {
                    setActualReading({
                        ...last,
                        timestamp: last.timestamp,
                    });
                    setDate(last.timestamp)
                } else {
                    setActualReading({ timestamp: date });
                }
            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
                setHistory(initialHistory);
                setActualReading({});
            }
        }

        if (sensorCode && date) fetchHistory();
    }, [date, getNewHistory, sensorCode]);

    const fieldDate = (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
                label="Data"
                value={dayjs(date)}
                onChange={(v) => setDate(v)}
            />
        </LocalizationProvider>
    );
    
    return (
        <SensorMonitorBase
            title="Histórico de Leituras"
            sensorCodes={sensorCodes}
            sensorLocation={sensorLocation}
            sensorCode={sensorCode}
            onFilter={handleFilter}
            activeParam={activeParam}
            onParamChange={setActiveParam}
            actualReading={actualReading}
            history={history}
            maxPoints={MAX_POINTS}
            args={{ fieldDate: fieldDate }}
        />
    );
}

/* ===================== NORMALIZAÇÃO ===================== */
function normalizeHistory(readings) {
    const history = {
        labels: [],
    };

    Object.keys(parameterOptions).forEach((param) => {
        history[param] = [];
    });

    readings.forEach((r) => {
        history.labels.push(
            new Date(r.timestamp).toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );

        Object.keys(parameterOptions).forEach((param) => {
            history[param].push(Number(r[param] ?? 0));
        });
    });

    return history;
}