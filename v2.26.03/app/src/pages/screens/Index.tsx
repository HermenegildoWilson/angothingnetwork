import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { useAuth } from "@/hooks/useAuth";
import { Grass, Person } from "@mui/icons-material";
import { Cpu } from "lucide-react";
import TemporalCards from "../../components/Dashboard/TemporalCards";
import { useNavigate } from "react-router-dom";
import { sensorService } from "@/services/sensor/sensor.service";
import type {
  SensorAccessRequestDto,
  SensorDto,
} from "@/services/sensor/types";

export default function Main() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState<SensorDto[]>([]);
  const [requests, setRequests] = useState<SensorAccessRequestDto[]>([]);

  useEffect(() => {
    const loadSummary = async () => {
      const [sensorsResponse, requestsResponse] = await Promise.all([
        sensorService.find.all(),
        sensorService.accessRequests.all(
          user?.role === "ADMIN" ? "PENDING" : undefined,
        ),
      ]);

      if (sensorsResponse.success) {
        setStations((sensorsResponse.data ?? []).slice(0, 3));
      }

      if (requestsResponse.success) {
        setRequests((requestsResponse.data ?? []).slice(0, 3));
      }
    };

    void loadSummary();
  }, [user?.role]);

  return (
    <Box sx={{ flex: 1, p: { xs: 1, md: 2 } }}>
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
          mb: 5,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Title>Olá, {user?.name?.split(" ")[0]}</Title>
          <Text>Eis o resumo do seu ecossistema para hoje.</Text>
        </Box>

        <TemporalCards />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: { xs: 2, md: 3 },
            boxShadow: { xs: "0 4px 20px rgba(0,0,0,0.05)", md: "none" },
            borderRadius: 4,
          }}
        >
          {/* LISTA DE ESTAÇÕES E SENSORES */}
          <Box>
            <Card
              sx={{
                p: 2,
                borderRadius: 4,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h6" fontWeight={800}>
                  {user.role === "ADMIN" ? "Estações" : "As Minhas Estações"}
                </Typography>
                <Button
                  size="small"
                  sx={{ fontWeight: 700 }}
                  onClick={() => navigate("/devices")}
                >
                  Ver Todas
                </Button>
              </Stack>

              <Stack spacing={2}>
                {stations.map((station) => (
                  <Box
                    key={station.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: "#10b981",
                        }}
                      >
                        <Grass fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={700}>
                          {station.sensorCode}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip
                            label="Sensor"
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: "0.6rem",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Registado no sistema
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box
                        sx={{
                          textAlign: "right",
                          display: {
                            xs: "none",
                            sm: "block",
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Estado
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={
                            station.deletedAt ? "warning.main" : "success.main"
                          }
                        >
                          {station.deletedAt ? "Inativo" : "Ativo"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Box>

          {/* LADO DIREITO: PEDIDOS DE ACESSO (PARA admin) OU SOLICITAÇÕES (PARA VISITOR) */}
          <Box>
            <Card
              sx={{
                p: 2,
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h6" fontWeight={800}>
                  {user.role === "ADMIN"
                    ? "Pedidos de Acesso"
                    : "Minhas Solicitações"}
                </Typography>
                <Button
                  size="small"
                  sx={{ fontWeight: 700 }}
                  onClick={() => navigate("/notifications")}
                >
                  Ver Todas
                </Button>
              </Stack>
              <Stack spacing={2}>
                {requests.map((request) => (
                  <Box
                    key={request.id}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#FFFBEB",
                      border: "1px solid #FEF3C7",
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor:
                            user.role === "ADMIN"
                              ? "warning.main"
                              : "primary.main",
                        }}
                      >
                        {user.role === "ADMIN" ? (
                          <Person fontSize="small" />
                        ) : (
                          <Cpu size={18} />
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={800}>
                          {user.role === "ADMIN"
                            ? request.user.name
                            : `Sensor ${request.sensor.sensorCode}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.role === "ADMIN"
                            ? `Solicitou: ${request.sensor.sensorCode}`
                            : request.status}
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      size="small"
                      variant="outlined"
                      color={
                        request.status === "PENDING"
                          ? "warning"
                          : request.status === "APPROVED"
                            ? "success"
                            : "error"
                      }
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        fontWeight: 700,
                        py: 2,
                      }}
                      label={
                        request.status === "PENDING"
                          ? "Pendente"
                          : request.status === "APPROVED"
                            ? "Aprovado"
                            : "Recusado"
                      }
                    />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
