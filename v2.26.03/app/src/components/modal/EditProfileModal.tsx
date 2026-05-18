import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import type { UserDto } from "@/services/user/types";
import { userService } from "@/services/user/user.service";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
  profile: UserDto | null;
  onSuccess: (updatedProfile: UserDto) => void;
};

type FormData = {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function EditProfileModal({
  open,
  onClose,
  profile,
  onSuccess,
}: EditProfileModalProps) {
  const { user: currentUser } = useAuth();
  const { setAlert } = useAlert();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "VISITOR",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        role: profile.role || "VISITOR",
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value as string }));
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username é obrigatório";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username deve ter pelo menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (text: string, style: "success" | "error" | "warning" | "info") => {
    setAlert({ type: "SHOW", text, style, duration: 4000 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !profile) return;

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role: isAdmin ? (formData.role as "ADMIN" | "CLIENT" | "VISITOR") : undefined,
      };

      const response = await userService.update.profile({
        id: profile.id,
        data: updateData,
      });

      if (response.success) {
        showAlert("Perfil atualizado com sucesso!", "success");
        onSuccess(response.data as UserDto);
        onClose();
      } else {
        showAlert(
          response.message || "Erro ao atualizar perfil",
          "error"
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Erro ao atualizar perfil";
      showAlert(errorMessage || "Erro ao atualizar perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px -12px rgba(0,0,0,0.15)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Editar Perfil
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {/* Name */}
            <TextField
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              size="small"
            />

            {/* Username */}
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.username}
              helperText={errors.username}
              variant="outlined"
              size="small"
            />

            {/* Email - Readonly */}
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              fullWidth
              disabled
              variant="outlined"
              size="small"
              InputProps={{
                sx: { bgcolor: "action.hover" },
              }}
              helperText="Email não pode ser alterado"
            />

            {/* Phone - Readonly */}
            <TextField
              label="Telefone"
              name="phone"
              value={formData.phone}
              fullWidth
              disabled
              variant="outlined"
              size="small"
              InputProps={{
                sx: { bgcolor: "action.hover" },
              }}
              helperText="Telefone não pode ser alterado"
            />

            {/* Role - Only editable by ADMIN */}
            {isAdmin && (
              <FormControl fullWidth error={!!errors.role} size="small">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="CLIENT">CLIENT</MenuItem>
                  <MenuItem value="VISITOR">VISITOR</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            )}

            {/* Alert for non-admin users */}
            {!isAdmin && (
              <Alert severity="info" sx={{ fontSize: "0.75rem" }}>
                Apenas administradores podem alterar o role.
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancel}
            color="inherit"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 2,
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: "600",
              minWidth: 100,
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}