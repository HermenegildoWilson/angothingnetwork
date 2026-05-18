import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import SmartListItem from "@/components/list/SmartListItem";
import SmartView from "@/components/list/SmartView";
import { sensorService } from "@/services/sensor/sensor.service";
import type { SensorDto } from "@/services/sensor/types";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/hooks/useAlert";

export default function Devices() {
  const [devices, setDevices] = useState<SensorDto[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [sensorCode, setSensorCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setAlert } = useAlert();

  async function getDevices() {
    const response = await sensorService.find.all();
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
  const handleCreateNew = () => setOpenCreateDialog(true);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getDevices();
  }, []);

  return (
    <>
      <SmartView
        title="Dispositivos"
        handleCreateNew={handleCreateNew}
        items={devices}
        ItemAvatar={Cpu}
        titleButton="Adicionar"
        voidMessage="Sem Dispositivos associados"
      >
        {devices.map((item, index) => (
          <SmartListItem
            item={item}
            keys={["sensorCode", "createdAt"]}
            ItemAvatar={Cpu}
            handleItemClick={handleItemClick}
            key={item?.id || index}
          />
        ))}
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
