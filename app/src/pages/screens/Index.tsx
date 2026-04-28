import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { useAuth } from "@/hooks/useAuth";
import { Grass, Person } from "@mui/icons-material";
import { Cpu } from "lucide-react";
import TemporalCards from "../../components/Dashboard/TemporalCards";
import { useNavigate } from "react-router-dom";

// Lista de sensores disponíveis/solicitados
const stations = [
  {
    id: 2,
    name: "Monitoramento Ambiental, Uíge",
    type: "Solo",
    color: "#10b981",
    Icone: Grass,
    status: "Activo",
    battery: "92%",
    signal: "Forte",
  },
];

export default function Main() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
                          bgcolor: station.color,
                        }}
                      >
                        <station.Icone fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={700}>
                          {station.name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip
                            label={station.type}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: "0.6rem",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Sinal: {station.signal}
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
                            station.status === "Ativo"
                              ? "success.main"
                              : "warning.main"
                          }
                        >
                          {station.status}
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
                {user.role === "ADMIN" ? (
                  <Box
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
                          bgcolor: "warning.main",
                        }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={800}>
                          Eng. Castro Almeida
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Solicitou: Sensor TDS (Água)
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Recusar
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Box
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
                          bgcolor: "primary.main",
                        }}
                      >
                        <Cpu fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={800}>
                          Solicitou: Sensor TDS (Água)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date().toLocaleDateString("pt-BR", {
                            second: "2-digit",
                            minute: "2-digit",
                            hour: "2-digit",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        variant="outlined"
                        color="warning"
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          fontWeight: 700,
                          py: 2,
                        }}
                        label="Pendente"
                      />
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
