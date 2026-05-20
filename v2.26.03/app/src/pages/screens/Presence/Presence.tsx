import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { OnlinePrediction, Sensors } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { sensorReadingService } from "@/services/sensor/sensorreading.service";
import type { SensorPresenceDto } from "@/services/sensor/types";

export default function Presence() {
  const [items, setItems] = useState<SensorPresenceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPresence = async () => {
      setLoading(true);
      const response = await sensorReadingService.find.presence();
      if (mounted && response.success) {
        setItems(response.data ?? []);
      }
      if (mounted) setLoading(false);
    };

    void loadPresence();
    const interval = window.setInterval(loadPresence, 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <Box sx={{ flex: 1, p: { xs: 1, md: 2 } }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 1.5, md: 2 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Utilizadores ativos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loading
                ? "A atualizar presença..."
                : `${items.length} utilizador(es) online`}
            </Typography>
          </Box>

          <Chip
            color="success"
            icon={<OnlinePrediction />}
            label="Online"
            sx={{ fontWeight: 700 }}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          {!loading && items.length === 0 && (
            <Typography color="text.secondary">
              Nenhum utilizador ativo neste momento.
            </Typography>
          )}

          {items.map((item) => (
            <Paper
              key={item.user.id}
              variant="outlined"
              sx={{ borderRadius: 2, p: { xs: 1.25, md: 1.5 } }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1.5}
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {item.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={800}>{item.user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{item.user.username} · {item.user.role} ·{" "}
                      {item.connections} conexão(ões)
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  flexWrap="wrap"
                  useFlexGap
                  gap={1}
                  justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                >
                  {item.sensors.length === 0 ? (
                    <Chip size="small" label="Sem sensor ativo" />
                  ) : (
                    item.sensors.map((sensor) => (
                      <Chip
                        key={sensor.id}
                        size="small"
                        color="primary"
                        variant="outlined"
                        icon={<Sensors />}
                        label={sensor.sensorCode}
                      />
                    ))
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
