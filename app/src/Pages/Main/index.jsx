import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Button,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  WaterDrop,
  Air,
  Grass,
  ArrowUpward,
  ArrowDownward,
  AccessTime,
  MoreVert,
  Person,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useSensors } from "../../hooks/useSensors";
import { parameterOptions } from "../../components/Dashboard/config";

const MotionCard = motion(Card);

export default function App() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { sensors, sensorCodes } = useSensors();
  const actualReading = sensors?.[sensorCodes?.[0]] ?? {};

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatReading = (value, unit) => {
    if (value === null || value === undefined || value === "") return "--";
    const numericValue = Number(value);
    const displayValue = Number.isNaN(numericValue)
      ? String(value)
      : numericValue.toLocaleString("pt-PT", {
          maximumFractionDigits: 2,
        });
    return unit ? `${displayValue}${unit}` : displayValue;
  };

  const kpiOrder = [
    "Temperatura",
    "Qualidade do Ar",
    "Humidade",
    "Pressão do Ar",
  ];

  const kpiMeta = {
    Temperatura: { change: "+0.2", status: "Ideal" },
    "Qualidade do Ar": { change: "-5", status: "Excelente" },
    Humidade: { change: "+2%", status: "Estável" },
    "Pressão do Ar": { change: "+0", status: "Estável" },
  };

  // KPIs rápidas
  const stats = kpiOrder.map((key) => {
    const config = parameterOptions[key];
    const Icon = config?.icon ?? WaterDrop;
    const meta = kpiMeta[key] ?? { change: "+0", status: "Atual" };

    return {
      title: config?.name ?? key,
      value: formatReading(actualReading?.[key], config?.unit),
      change: meta.change,
      status: meta.status,
      icon: <Icon />,
      color: config?.color ?? "#0ea5e9",
    };
  });

  // Lista de sensores disponíveis/solicitados
  const stations = [
    // {
    //   id: 1,
    //   name: "Estação Luanda Sul - B1",
    //   type: "Água",
    //   status: "Ativo",
    //   battery: "85%",
    //   signal: "Excelente",
    // },
    {
      id: 2,
      name: "Monitoramento Ambiental, Uíge",
      type: "Solo",
      status: "Activo",
      battery: "92%",
      signal: "Forte",
    },
    // {
    //   id: 3,
    //   name: "Qualidade Ar - Zona Industrial",
    //   type: "Ar",
    //   status: "Ativo",
    //   battery: "92%",
    //   signal: "Bom",
    // },
  ];

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 0, pt: 0.3 }}>
        <LinearProgress sx={{ height: 4 }} />
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            A carregar o seu ecossistema...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* CONTEÚDO PRINCIPAL */}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 4 },
        }}
      >
        {/* HEADER DASHBOARD */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 5,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Olá, {user?.nome?.split(" ")[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Eis o resumo do seu ecossistema para hoje
            </Typography>
          </Box>
        </Box>

        {/* KPI CARDS */}
        <Grid container spacing={{ xs: 1, md: 3 }} sx={{ mb: 5 }}>
          {stats.map((stat, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <MotionCard
                whileHover={{ y: -5 }}
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${stat.color}15`,
                        color: stat.color,
                        borderRadius: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Chip
                      label={stat.status}
                      size="small"
                      sx={{
                        bgcolor: "#ecfdf5",
                        color: "#10b981",
                        fontWeight: 800,
                        fontSize: "0.65rem",
                      }}
                    />
                  </Stack>
                  <Typography variant="h4" fontWeight={900}>
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {stat.title}
                  </Typography>
                  
                  {/* <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mt: 1.5 }}
                  >
                    {stat.change.startsWith("+") ? (
                      <ArrowUpward
                        sx={{
                          fontSize: 14,
                          color: "#10b981",
                        }}
                      />
                    ) : (
                      <ArrowDownward
                        sx={{
                          fontSize: 14,
                          color: "#ef4444",
                        }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{
                        color: stat.change.startsWith("+")
                          ? "#10b981"
                          : "#ef4444",
                      }}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs. últimas 24h
                    </Typography>
                  </Stack> */}
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* LISTA DE ESTAÇÕES E SENSORES */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h6" fontWeight={800}>
                  As Minhas Estações
                </Typography>
                <Button size="small" sx={{ fontWeight: 700 }}>
                  Ver Todas
                </Button>
              </Stack>

              <Stack spacing={2}>
                {stations.map((station) => (
                  <Box
                    key={station.id}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "0.2s",
                      "&:hover": { bgcolor: "#F1F5F9" },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor:
                            station.type === "Água"
                              ? "#0ea5e9"
                              : station.type === "Ar"
                                ? "#3b82f6"
                                : "#10b981",
                        }}
                      >
                        {station.type === "Água" ? (
                          <WaterDrop fontSize="small" />
                        ) : station.type === "Ar" ? (
                          <Air fontSize="small" />
                        ) : (
                          <Grass fontSize="small" />
                        )}
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
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* LADO DIREITO: PEDIDOS DE ACESSO (PARA admin) OU SOLICITAÇÕES (PARA VISITOR) */}
          <Grid item xs={12} lg={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                {user.role === "admin"
                  ? "Pedidos de Acesso"
                  : "Minhas Solicitações"}
              </Typography>

              {user.role === "admin" ? (
                <Stack spacing={3}>
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
                  <Divider />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    Sem mais pedidos pendentes.
                  </Typography>
                </Stack>
              ) : (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <AccessTime
                    sx={{
                      fontSize: 40,
                      color: "text.disabled",
                      mb: 2,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Aguarde a aprovação do administrador para visualizar novos
                    sensores.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

// Ícone de Analytics que faltou no import do Material
function Analytics(props) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
