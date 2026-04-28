import { sensorService } from "@/services/sensor/sensor.service";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { AlertCircle } from "lucide-react";

type DialogDeleteDevice = {
  deviceId: string;
  state: {
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (newDeleteDialogOpen: boolean) => void;
  };
};

export default function DialogDeleteDevice(
  dialogDeleteDevice: DialogDeleteDevice,
) {
  const { deviceId, state } = dialogDeleteDevice;
  const { deleteDialogOpen, setDeleteDialogOpen } = state;
  const handleDelete = async () => {
    setDeleteDialogOpen(false);
    await sensorService.delete(deviceId);
  };

  return (
    <>
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
            Deseja realmente eliminar o sensor <strong>{deviceId}</strong>?
            Todos os dados históricos serão removidos.
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
    </>
  );
}
