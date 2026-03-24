import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Stack,
  Avatar,
  useTheme,
  Grid,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Cpu,
  Edit3,
  Trash2,
  MapPin,
  ArrowLeft,
  Activity,
  Wifi,
  AlertCircle,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { api } from "../../api/axios";
import AppLoader from "../../components/feedback/AppLoader";
import { useSensors } from "../../hooks/useSensors";
import { parameterOptions } from "../../components/Dashboard/config";

/**
 * Componente Principal de Perfil do Dispositivo
 */
export default function PerfilDispositivo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [dispositivo, setDispositivo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { sensors } = useSensors();
  const actualReading = sensors?.[dispositivo?.sensor_code] ?? {};

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

  const lastReadingOrder = [
    "Temperatura",
    "Humidade",
    "Pressão do Ar",
    "Qualidade do Ar",
  ];

  async function getDispositivo() {
    try {
      const { data } = await api.get("/sensors/sensors", {
        params: { id },
      });
      //const { data } = await api.get("/sensors/sensors");

      setDispositivo(data.data[0]);
    } catch (error) {
      console.error(error);
      setDispositivo({});
    } finally {
      setLoading(false);
    }
  }

  // Carregar dados do dispositivo de forma segura
  useEffect(() => {
    getDispositivo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // eslint-disable-next-line no-unused-vars
  const handleBack = () => navigate(-1);

  const handleDelete = async () => {
    try {
      // Simulação da lógica de eliminação
      alert("Eliminando dispositivo ID:", id);
      console.log("Eliminando dispositivo ID:", id);
      setDeleteDialogOpen(false);
      navigate("/"); // Redireciona para a lista principal
    } catch (error) {
      console.error("Erro ao eliminar:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f6f9fc"
      >
        <AppLoader />
      </Box>
    );
  }

  if (!dispositivo?.sensor_code) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <AlertCircle
            size={64}
            color={theme.palette.error.main}
            strokeWidth={1.5}
          />
        </Box>
        <Typography variant="h5" fontWeight="700">
          Dispositivo não encontrado
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1, mb: 4 }}
        >
          Não foi possível localizar as informações do sensor com o ID: {id}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/dispositivos")}
          startIcon={<ArrowLeft size={18} />}
        >
          Voltar para a Lista
        </Button>
      </Container>
    );
  }

  const loc = dispositivo.sensor_location || {};
  // eslint-disable-next-line no-unused-vars
  const locationSring =
    [loc.cidade, loc.provincia, loc.pais].filter(Boolean).join(", ") ||
    "Localização não definida";

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)",
        pt: 2,
        pb: 2,
        flex: "1",
        margin: "auto",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexFlow: { xs: "wrap", md: "nowrap" },
          gap: 2,
        }}
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
              {dispositivo.sensor_code}
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
                  border: "1px solid #eee",
                  color: theme.palette.primary.main,
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
                  {/* {locationString} */}
                  Uíge, Uíge, Angola
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems={"center"} gap={2}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  border: "1px solid #eee",
                  color: theme.palette.primary.main,
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
                  ID: {dispositivo.id}
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  CODE: {dispositivo.sensor_code}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems={"center"} gap={2}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  border: "1px solid #eee",
                  color: theme.palette.primary.main,
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
                  MQTT {/* / TLS 1.3 */}
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
              onClick={() => navigate(`/editar/${id}`)}
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
              <Grid item xs={4} key={stat.label}>
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
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 4,
              p: { xs: 1, md: 6 },
              border: "2px dashed #e0e6ed",
              borderRadius: 6,
              textAlign: "center",
              bgcolor: "#fafbfd",
            }}
          >
            <Box display={"flex"} gap={2} alignItems={"center"} mb={2}>
              <Activity
                size={48}
                color="#cbd5e0"
                style={{ marginBottom: "16px" }}
              />
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                Últimas Leituras
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: 1,
              }}
            >
              {lastReadingOrder.map((key) => {
                const config = parameterOptions[key];
                const value = formatReading(actualReading?.[key], config?.unit);
                return (
                  <Card
                    key={key}
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      fontWeight="600"
                      display="block"
                    >
                      {config?.name ?? key}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="800"
                      sx={{ color: config?.color ?? "#1F2937" }}
                    >
                      {value}
                    </Typography>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Card>
      </Container>

      {/* Diálogo de Confirmação */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 5, p: 1, minWidth: 320 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <AlertCircle color="#f44336" /> Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente eliminar o sensor{" "}
            <strong>{dispositivo.sensor_code}</strong>? Todos os dados
            históricos serão removidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              px: 3,
            }}
          >
            Eliminar Agora
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
