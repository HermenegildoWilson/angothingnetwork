import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SmartListItem from "@/components/list/SmartListItem";
import SmartView from "@/components/list/SmartView";
import { sensorService } from "@/services/sensor/sensor.service";
import type { SensorDto } from "@/services/sensor/types";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";

const requestLabels = {
  PENDING: { label: "Pendente", color: "warning" },
  APPROVED: { label: "Aprovado", color: "success" },
  REJECTED: { label: "Recusado", color: "error" },
} as const;

export default function Devices() {
  const [devices, setDevices] = useState<SensorDto[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [sensorCode, setSensorCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestingSensorId, setRequestingSensorId] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();
  const { setAlert } = useAlert();
  const { user } = useAuth();

  async function getDevices() {
    const response =
      user?.role === "ADMIN"
        ? await sensorService.find.all()
        : await sensorService.find.available();

    if (response.success) {
      setDevices(response.data ?? []);
    } else {
      setAlert({
        type: "SHOW",
        style: "error",
        text: response.message ?? "Não foi possível carregar os sensores.",
      });
    }
  }

  const handleItemClick = (item: SensorDto) => navigate(`/devices/${item.id}`);
  const handleCreateNew =
    user?.role === "ADMIN" ? () => setOpenCreateDialog(true) : undefined;

  const handleCloseCreateDialog = () => {
    if (submitting) return;
    setOpenCreateDialog(false);
    setSensorCode("");
  };

  const handleCreateSensor = async () => {
    const normalizedSensorCode = sensorCode.trim();

    if (!normalizedSensorCode) {
      setAlert({
        type: "SHOW",
        style: "warning",
        text: "Informe o código do sensor.",
      });
      return;
    }

    setSubmitting(true);
    const response = await sensorService.create({
      sensorCode: normalizedSensorCode,
    });
    setSubmitting(false);

    if (!response.success) {
      setAlert({
        type: "SHOW",
        style: "error",
        text: response.message ?? "Não foi possível criar o sensor.",
      });
      return;
    }

    setAlert({
      type: "SHOW",
      style: "success",
      text: "Sensor criado com sucesso.",
    });
    setOpenCreateDialog(false);
    setSensorCode("");
    await getDevices();
  };

  const handleRequestAccess = async (sensorId: string) => {
    setRequestingSensorId(sensorId);
    const response = await sensorService.accessRequests.create(sensorId);
    setRequestingSensorId(null);

    if (!response.success) {
      setAlert({
        type: "SHOW",
        style: "error",
        text: response.message ?? "Não foi possível enviar o pedido.",
      });
      return;
    }

    setAlert({
      type: "SHOW",
      style: "success",
      text: "Pedido de acesso enviado para aprovação.",
    });
    await getDevices();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getDevices();
  }, [user?.role]);

  return (
    <>
      <SmartView
        title="Dispositivos"
        handleCreateNew={handleCreateNew}
        items={devices}
        ItemAvatar={Cpu}
        titleButton={user?.role === "ADMIN" ? "Adicionar" : undefined}
        voidMessage={
          user?.role === "ADMIN"
            ? "Sem Dispositivos associados"
            : "Sem sensores disponíveis para solicitar"
        }
      >
        {user?.role === "ADMIN"
          ? devices.map((item, index) => (
              <SmartListItem
                item={item}
                keys={["sensorCode", "createdAt"]}
                ItemAvatar={Cpu}
                handleItemClick={handleItemClick}
                key={item?.id || index}
              />
            ))
          : devices.map((item) => {
              const lastRequest = item.accessRequests?.[0];
              const requestMeta = lastRequest
                ? requestLabels[lastRequest.status]
                : null;

              return (
                <Box
                  key={item.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <Cpu size={18} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={800}>
                          {item.sensorCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Disponível para solicitação
                        </Typography>
                      </Box>
                    </Stack>

                    {requestMeta ? (
                      <Chip
                        label={requestMeta.label}
                        color={requestMeta.color}
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleRequestAccess(item.id)}
                        disabled={requestingSensorId === item.id}
                      >
                        {requestingSensorId === item.id
                          ? "A enviar..."
                          : "Pedir acesso"}
                      </Button>
                    )}
                  </Stack>
                </Box>
              );
            })}
      </SmartView>

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Adicionar Sensor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Código do sensor"
              value={sensorCode}
              onChange={(event) => setSensorCode(event.target.value)}
              placeholder="Ex: Esp-32-001"
              autoFocus
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseCreateDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateSensor}
            disabled={submitting}
          >
            {submitting ? "A criar..." : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
