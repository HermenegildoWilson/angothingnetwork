import { sensorService } from "@/services/sensor/sensor.service";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
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
        PaperProps={{ sx: { minWidth: 320 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              color: "error.main",
              bgcolor: "rgba(239, 68, 68, 0.1)",
            }}
          >
            <AlertCircle size={22} />
          </Box>
          <Box>
            Confirmar Eliminação
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5, fontWeight: 500 }}
            >
              Esta ação remove o sensor e os seus dados associados.
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Deseja realmente eliminar o sensor <strong>{deviceId}</strong>?
            Todos os dados históricos serão removidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
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
