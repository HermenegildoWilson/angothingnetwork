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
} from "@mui/material";
import TemporalGraph from "@/components/Dashboard/TemporalGraph";
import { useEffect, useState } from "react";
import {
  initialHistoryReading,
  normalizeHistoryReading,
} from "@/services/sensor/sensorreading.service";
import { useAuth } from "@/hooks/useAuth";
import parameterOptions from "@/config/sensor/parameterOptions";
import { useSensorsReading } from "@/hooks/useSensors";
import { AccessTime, FilterList, MyLocation } from "@mui/icons-material";

const maxPoints = 10;
export default function History() {
  const { sensor } = useAuth();
  const { SensorReading } = useSensorsReading();
  const [history, setHistory] = useState(initialHistoryReading);

  const [activeParam, setActiveParam] = useState("Temperatura");
  const [openDialog, setOpenDialog] = useState(false);
  const [sensorCodeValue, setSensorCodeValue] = useState("");

  const onParamChange = (newParamField) => {
    setActiveParam(newParamField);
  };

  const onHistoryFilter = () => {
    setHistory(initialHistoryReading);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (!SensorReading[0].humidity) return;
    const normalizedData = normalizeHistoryReading(SensorReading, maxPoints);

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
                Data :&nbsp; {new Date().toLocaleString()}
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
                    onClick={() => onParamChange(config.name)}
                    color={activeParam === config.name ? "primary" : "default"}
                    variant={
                      activeParam === config.name ? "filled" : "outlined"
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
            gap: { xs: 2, md: 3 },
            boxShadow: { xs: "0 4px 20px rgba(0,0,0,0.05)", md: "none" },
            borderRadius: 4,
          }}
        >
          {/* ============================ GRÁFICO =========================== */}
          <TemporalGraph
            values={history?.[activeParam] ?? []}
            labels={history.labels}
            config={parameterOptions[activeParam]}
            key={history?.[activeParam]?.length}
            maxPoints={maxPoints}
          />
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
          <Button variant="contained" onClick={onHistoryFilter}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
