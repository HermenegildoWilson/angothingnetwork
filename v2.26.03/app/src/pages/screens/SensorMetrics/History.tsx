import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import TemporalGraph from "@/components/Dashboard/TemporalGraph";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  initialHistoryReading,
  normalizeHistoryReading,
  sensorReadingService,
} from "@/services/sensor/sensorreading.service";
import { useAuth } from "@/hooks/useAuth";
import parameterOptions from "@/config/sensor/parameterOptions";
import { AccessTime, FilterList, MyLocation } from "@mui/icons-material";
import type { SensorReadingDto } from "@/services/sensor/types";
import type { parameterOptionsName } from "@/config/sensor/types";

const defaultLimit = 100;
const graphPoints = 30;

export default function History() {
  const { sensor } = useAuth();
  const [readings, setReadings] = useState<SensorReadingDto[]>([]);
  const [history, setHistory] = useState(initialHistoryReading);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialLoadDoneRef = useRef(false);

  const [activeParam, setActiveParam] =
    useState<parameterOptionsName>("Temperatura");
  const [openDialog, setOpenDialog] = useState(false);
  const [sensorCodeValue, setSensorCodeValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState(defaultLimit);

  const activeConfig = parameterOptions[activeParam];
  const values = history[activeParam] ?? [];
  const latestReading = readings[readings.length - 1];

  const stats = useMemo(() => {
    if (values.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: total / values.length,
    };
  }, [values]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    const result = await sensorReadingService.find.all({
      sensorCode: sensorCodeValue || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      limit,
    });

    if (result.success) {
      const data = result.data ?? [];
      setReadings(data);
      setHistory(normalizeHistoryReading(data, graphPoints));
    } else {
      setReadings([]);
      setHistory(initialHistoryReading);
      setError(result.message ?? "Não foi possível carregar o histórico.");
    }

    setLoading(false);
  }, [endDate, limit, sensorCodeValue, startDate]);

  const onParamChange = (newParamField: parameterOptionsName) => {
    setActiveParam(newParamField);
  };

  const onHistoryFilter = () => {
    setOpenDialog(false);
    void loadHistory();
  };

  useEffect(() => {
    if (sensorCodeValue || sensor.codes.length === 0) return;
    setSensorCodeValue(sensor.codes[0]);
  }, [sensor.codes, sensorCodeValue]);

  useEffect(() => {
    if (initialLoadDoneRef.current) return;
    if (!sensorCodeValue && sensor.codes.length > 0) return;
    initialLoadDoneRef.current = true;
    void loadHistory();
  }, [loadHistory, sensor.codes.length, sensorCodeValue]);

  return (
    <>
      <Box sx={{ flex: 1, p: 1 }}>
        <Box sx={{ py: 1 }}>
          <Box
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
              py: { xs: 1, md: 1.8 },
              px: { xs: 1, md: 1.8 },
              borderRadius: 2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="800"
                pb={1}
                sx={{
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.275rem", md: "1.8125rem" },
                }}
              >
                Histórico de Leituras
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <AccessTime sx={{ fontSize: 16 }} />
                Última leitura:&nbsp;
                {latestReading?.timestamp
                  ? new Date(latestReading.timestamp).toLocaleString()
                  : "Sem dados carregados"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <Tooltip title="Filtrar histórico">
                  <IconButton size="small" onClick={() => setOpenDialog(true)}>
                    <FilterList fontSize="small" />
                  </IconButton>
                </Tooltip>
                <MyLocation sx={{ fontSize: 16 }} /> Uíge, Uíge, Angola
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "flex-end",
                flexGrow: "1",
              }}
            >
              {(Object.keys(parameterOptions) as parameterOptionsName[]).map(
                (name) => {
                  const config = parameterOptions[name];
                  const Icon = config.Icon;
                  return (
                    <Chip
                      key={name}
                      label={name}
                      icon={<Icon />}
                      onClick={() => onParamChange(config.name)}
                      color={
                        activeParam === config.name ? "primary" : "default"
                      }
                      variant={
                        activeParam === config.name ? "filled" : "outlined"
                      }
                      sx={{ fontWeight: "bold" }}
                    />
                  );
                },
              )}
            </Box>
          </Box>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} py={1}>
          {[
            ["Mínimo", stats.min],
            ["Média", stats.avg],
            ["Máximo", stats.max],
          ].map(([label, value]) => (
            <Box
              key={label}
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                px: 2,
                py: 1.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h6" fontWeight="800">
                {Number(value).toFixed(1)}
                {activeConfig.unit}
              </Typography>
            </Box>
          ))}
        </Stack>

        {error && (
          <Alert severity="error" sx={{ my: 1 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            gap: { xs: 2, md: 3 },
            boxShadow: { xs: "0 4px 20px rgba(0,0,0,0.05)", md: "none" },
            borderRadius: 4,
            position: "relative",
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255,255,255,0.65)",
                zIndex: 1,
              }}
            >
              <CircularProgress size={32} />
            </Box>
          )}

          <TemporalGraph
            values={values}
            labels={history.labels}
            config={activeConfig}
            key={`${activeParam}-${values.length}`}
            maxPoints={graphPoints}
          />
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Filtrar Histórico</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={sensor.codes}
              value={sensorCodeValue}
              onChange={(_, value) => setSensorCodeValue(value ?? "")}
              renderInput={(params) => (
                <TextField {...params} label="Sensor" fullWidth />
              )}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Início"
                type="datetime-local"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Fim"
                type="datetime-local"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>

            <TextField
              label="Limite de leituras"
              type="number"
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              inputProps={{ min: 1, max: 1000 }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={onHistoryFilter}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
