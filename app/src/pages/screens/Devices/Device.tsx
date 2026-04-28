import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Cpu, Edit3, Trash2, MapPin, Activity, Wifi } from "lucide-react";
import { sensorService } from "@/services/sensor/sensor.service";
import type { SensorDto } from "@/services/sensor/types";
import DialogDeleteDevice from "./DialogDeleteDevice";
import FullLoader from "@/components/feedback/loader/FullLoader";
import { useAlert } from "@/hooks/useAlert";
import TemporalCards from "@/components/Dashboard/TemporalCards";

export default function Device() {
  const { id } = useParams();
  const { setAlert } = useAlert();

  const [device, setDevice] = useState<SensorDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDevice = async () => {
      try {
        const response = await sensorService.find.one(id);
        setDevice(response.data);
      } finally {
        setLoading(false);
      }
    };

    getDevice();
  }, [id]);

  if (!device && loading) {
    return <FullLoader />;
  }

  return (
    <Box
      sx={{
        flex: "1",
        background: "linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)",
      }}
    >
      <Container
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          p: 2,
        }}
        maxWidth="md"
      >
        {/* Painel de Informações do Sensor */}
        <Card
          elevation={0}
          sx={{
            p: 3,
            minWidth: 330,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#e3f2fd",
                color: "primary.main",
                mb: 1.5,
                borderRadius: 4,
                boxShadow: "0 8px 16px -4px rgba(33, 150, 243, 0.2)",
              }}
            >
              <Cpu size={48} />
            </Avatar>
            <Typography variant="h5" fontWeight="800" textAlign="center">
              {device?.sensorCode}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: "#4caf50",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2" color="success.main" fontWeight="600">
                Ligado / Sincronizado
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={3}>
            <Box display="flex" alignItems={"center"} gap={2}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "primary.main",
                }}
              >
                <MapPin size={20} />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontWeight="bold"
                >
                  LOCALIZAÇÃO
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  Uíge, Uíge, Angola
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems={"center"} gap={2}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "primary.main",
                }}
              >
                <Activity size={20} />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontWeight="bold"
                >
                  IDENTIFICADORES
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  ID: {device.id}
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  CODE: {device.sensorCode}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems={"center"} gap={2}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "primary.main",
                }}
              >
                <Wifi size={20} />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontWeight="bold"
                >
                  PROTOCOLO
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  MQTT
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Box sx={{ mt: 6, display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Edit3 size={18} />}
              sx={{
                borderRadius: 3,
                px: 3,
              }}
              onClick={() =>
                setAlert({
                  text: "Em contrução...",
                  type: "SHOW",
                  style: "warning",
                })
              }
            >
              Editar
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Trash2 size={18} />}
              sx={{
                borderRadius: 3,
                px: 3,
              }}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Eliminar
            </Button>
          </Box>
        </Card>

        {/* Painel de Telemetria e Monitorização */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 6,
            p: { xs: 1, md: 3 },
            pt: { xs: 3 },
            minWidth: 330,
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
            Telemetria em Tempo Real
          </Typography>

          <Grid container spacing={2}>
            {[
              {
                label: "Bateria",
                value: "92%",
                color: "#4caf50",
              },
              {
                label: "Latência",
                value: "24ms",
                color: "#2196f3",
              },
              {
                label: "Sinal",
                value: "Forte",
                color: "#ff9800",
              },
            ].map((stat) => (
              <Box display={"grid"} key={stat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "#f8f9fa",
                    borderRadius: 4,
                    textAlign: "center",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="600"
                    display="block"
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="800"
                    sx={{ color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 2,
              border: "2px dashed #e0e6ed",
              borderRadius: 6,
              textAlign: "center",
              bgcolor: "#fafbfd",
            }}
          >
            <Box
              display={"flex"}
              gap={2}
              alignItems={"center"}
              sx={{ px: 2, pt: 2 }}
            >
              <Activity
                size={48}
                color="#cbd5e0"
                style={{ marginBottom: "16px" }}
              />
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Últimas Leituras
              </Typography>
            </Box>
            <>
              <TemporalCards
                boxProps={{
                  sx: {
                    gridTemplateColumns: "repeat(2, minmax(100px, 160px))",
                    gap: 1,
                    justifyContent: "center",
                  },
                }}
              />
            </>
          </Box>
        </Card>
      </Container>

      <DialogDeleteDevice
        deviceId={device.id}
        state={{
          deleteDialogOpen: deleteDialogOpen,
          setDeleteDialogOpen: setDeleteDialogOpen,
        }}
      />
    </Box>
  );
}
