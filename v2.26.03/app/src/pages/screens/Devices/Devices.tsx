import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import SmartListItem from "@/components/list/SmartListItem";
import SmartView from "@/components/list/SmartView";
import { sensorService } from "@/services/sensor/sensor.service";
import type { SensorDto } from "@/services/sensor/types";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import StyledInput from "@/components/form/StyledInput";

const requestLabels = {
  PENDING: { label: "Pendente", color: "warning" },
  APPROVED: { label: "Aprovado", color: "success" },
  REJECTED: { label: "Recusado", color: "error" },
} as const;

export default function Devices() {
  const [devices, setDevices] = useState<SensorDto[]>([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    const response =
      user?.role === "ADMIN"
        ? await sensorService.find.all()
        : await sensorService.find.available();
    setLoading(false);

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
    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  return (
    <>
      <SmartView
        title="Dispositivos"
        handleCreateNew={handleCreateNew}
        items={devices}
        loading={loading}
        ItemAvatar={Cpu}
        titleButton={user?.role === "ADMIN" ? "Adicionar" : undefined}
        voidMessage={
          user?.role === "ADMIN"
            ? "Sem Dispositivos associados"
            : "Sem sensores disponíveis para solicitar"
        }
      >
        {user?.role === "ADMIN"
          ? devices.map((item, index) => {
              const smartItem = {
                ...item,
                smartListMeta: {
                  label: item.deletedAt ? "Inativo" : "Ativo",
                  color: item.deletedAt ? "warning" : "success",
                  subtitle: "Sensor registado no sistema",
                },
              };

              return (
                <SmartListItem
                  item={smartItem}
                  keys={["sensorCode"]}
                  ItemAvatar={Cpu}
                  handleItemClick={() => handleItemClick(item)}
                  key={item?.id || index}
                />
              );
            })
          : devices.map((item) => {
              const lastRequest = item.accessRequests?.[0];
              const requestMeta = lastRequest
                ? requestLabels[lastRequest.status]
                : null;
              const hasApprovedAccess = lastRequest?.status === "APPROVED";
              const statusLabel = requestMeta?.label ?? "Disponível";
              const statusColor = requestMeta?.color ?? "primary";
              const subtitle =
                lastRequest?.status === "PENDING"
                  ? "Pedido enviado e aguardando aprovação"
                  : lastRequest?.status === "APPROVED"
                    ? "Acesso autorizado para acompanhar este sensor"
                    : lastRequest?.status === "REJECTED"
                      ? "Pedido recusado. Pode contactar o administrador"
                      : "Disponível para solicitação";
              const smartItem = {
                ...item,
                smartListMeta: {
                  label: statusLabel,
                  color: statusColor,
                  subtitle,
                  action: hasApprovedAccess ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleItemClick(item)}
                    >
                      Abrir
                    </Button>
                  ) : requestMeta ? (
                    <Chip
                      label={requestMeta.label}
                      color={requestMeta.color}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleRequestAccess(item.id)}
                      disabled={requestingSensorId === item.id}
                    >
                      {requestingSensorId === item.id
                        ? "A enviar..."
                        : "Pedir acesso"}
                    </Button>
                  ),
                },
              };

              return (
                <SmartListItem
                  key={item.id}
                  item={smartItem}
                  keys={["sensorCode"]}
                  ItemAvatar={Cpu}
                  handleItemClick={
                    hasApprovedAccess
                      ? () => handleItemClick(item)
                      : undefined
                  }
                />
              );
            })}
      </SmartView>

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Adicionar Sensor
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5, fontWeight: 500 }}
          >
            Registe um novo dispositivo para começar a recolher leituras.
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <StyledInput
              label="Código do sensor"
              value={sensorCode}
              onChange={(event) => setSensorCode(event.target.value)}
              placeholder="Ex: Esp-32-001"
              autoFocus
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
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
