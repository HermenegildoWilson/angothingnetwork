import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import TemporalMeter from "@/components/Dashboard/TemporalMeter";
import { useSensorsReading } from "@/hooks/useSensors";
import { useEffect, useState } from "react";
import type { parameterOptionsPayload } from "@/config/sensor/types";
import parameterOptions from "@/config/sensor/parameterOptions";
import { AccessTime, FilterList, MyLocation } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import TemporalGraph from "@/components/Dashboard/TemporalGraph";
import {
  initialHistoryReading,
  normalizeHistoryReading,
} from "@/services/sensor/sensorreading.service";
import theme from "@/theme";

const maxPoints = 10;
export default function RealTime() {
  const mediaQuery = useMediaQuery(theme.breakpoints.down("md"));
  const { SensorReading } = useSensorsReading();
  const { sensor } = useAuth();

  const [actualReading, setActualReading] = useState(SensorReading[0] ?? null);
  const [history, setHistory] = useState(initialHistoryReading);

  const [activeParam, setActiveParam] = useState("temperature");
  const [config, setConfig] = useState<parameterOptionsPayload>(
    parameterOptions["Temperatura"],
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [sensorCodeValue, setSensorCodeValue] = useState(
    actualReading?.sensorCode ?? "",
  );

  const onParamChange = (newParamField, newParamName) => {
    setActiveParam(newParamField);
    setConfig(parameterOptions[newParamName]);
  };

  const onSensorChange = () => {
    const newReading = SensorReading.filter(
      (reading) => reading.sensorCode === sensorCodeValue,
    );
    setActualReading(newReading?.[0] ?? null);
    setOpenDialog(false);
  };

  useEffect(() => {
    setActualReading(SensorReading[0]);
    setSensorCodeValue(SensorReading[0].sensorCode);
  }, [SensorReading]);

  useEffect(() => {
    if (!SensorReading[0].humidity) return;
    const normalizedData = normalizeHistoryReading(SensorReading, maxPoints);

    setSensorCodeValue(SensorReading[0].sensorCode);
    setHistory(normalizedData);
  }, [SensorReading]);

  return (
    <>
      <Box sx={{ flex: 1, p: 1 }}>
        {/* ============================ CABEÇALHO =========================== */}
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
                Monitoramento em Tempo Real
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <AccessTime sx={{ fontSize: 16 }} />
                Última atualização :&nbsp;
                {actualReading?.timestamp
                  ? new Date(actualReading?.timestamp).toLocaleString()
                  : "DD/MM/AAA, hh:ss:ms"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <Tooltip title="Filtrar sensor">
                  <IconButton size="small" onClick={() => setOpenDialog(true)}>
                    <FilterList fontSize="small" />
                  </IconButton>
                </Tooltip>
                <MyLocation sx={{ fontSize: 16 }} /> Uíge, Uíge, Angola
              </Typography>
            </Box>

            {/* ================= CHIPS DE PARÂMETROS ================= */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "flex-end",
                flexGrow: "1",
              }}
            >
              {Object.keys(parameterOptions).map((name) => {
                const config = parameterOptions[name];
                const Icon = config.Icon;
                return (
                  <Chip
                    key={name}
                    label={name}
                    icon={<Icon />}
                    onClick={() => onParamChange(config.field, config.name)}
                    color={activeParam === config.field ? "primary" : "default"}
                    variant={
                      activeParam === config.field ? "filled" : "outlined"
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            boxShadow: { xs: "0 4px 20px rgba(0,0,0,0.05)", md: "none" },
            borderRadius: 4,
            justifyContent: "center",
          }}
        >
          {/* ============================= MEDIDOR ============================ */}
          <TemporalMeter
            config={config}
            value={actualReading?.[activeParam] ?? 0}
          />

          {/* ============================= MEDIDOR ============================ */}

          {!mediaQuery && (
            <TemporalGraph
              values={history?.[config.name] ?? []}
              labels={history.labels}
              config={parameterOptions[config.name]}
              key={history?.[config.name]?.length}
              maxPoints={maxPoints}
            />
          )}
        </Box>
      </Box>

      {/* ============== DIALOG COM O FORM PARA FILTRO DE SENSOR ============== */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Filtrar Sensor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={sensor.codes}
              value={sensorCodeValue}
              onChange={(_, v) => setSensorCodeValue(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                  label="Sensor"
                  fullWidth
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={onSensorChange}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
