import { useEffect, useState } from "react";
import { Bell, Cpu } from "lucide-react";
import SmartView from "@/components/list/SmartView";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import { sensorService } from "@/services/sensor/sensor.service";
import type {
  SensorAccessRequestDto,
  SensorAccessRequestStatus,
} from "@/services/sensor/types";
import { useAlert } from "@/hooks/useAlert";

const statusMeta: Record<
  SensorAccessRequestStatus,
  { label: string; color: "warning" | "success" | "error" }
> = {
  PENDING: { label: "Pendente", color: "warning" },
  APPROVED: { label: "Aprovado", color: "success" },
  REJECTED: { label: "Recusado", color: "error" },
};

export default function Notifications() {
  const [requests, setRequests] = useState<SensorAccessRequestDto[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const { user, refresh } = useAuth();
  const { setAlert } = useAlert();

  async function getNotifications() {
    const response = await sensorService.accessRequests.all();

    if (!response.success) {
      setAlert({
        type: "SHOW",
        style: "error",
        text: response.message ?? "Não foi possível carregar os pedidos.",
      });
      return;
    }

    const data = response.data ?? [];
    setRequests(data);

    if (user?.role !== "ADMIN" && data.some((item) => item.status === "APPROVED")) {
      await refresh();
    }
  }

  const handleDecision = async (
    request: SensorAccessRequestDto,
    decision: "approve" | "reject",
  ) => {
    setSubmittingId(request.id);
    const response =
      decision === "approve"
        ? await sensorService.accessRequests.approve(request.id)
        : await sensorService.accessRequests.reject(request.id);
    setSubmittingId(null);

    if (!response.success) {
      setAlert({
        type: "SHOW",
        style: "error",
        text: response.message ?? "Não foi possível analisar o pedido.",
      });
      return;
    }

    setAlert({
      type: "SHOW",
      style: "success",
      text:
        decision === "approve"
          ? "Pedido aprovado com sucesso."
          : "Pedido recusado com sucesso.",
    });
    await getNotifications();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getNotifications();
  }, [user?.role]);

  return (
    <SmartView
      title={user?.role === "ADMIN" ? "Pedidos de Acesso" : "Minhas Solicitações"}
      items={requests}
      ItemAvatar={Bell}
      voidMessage="Sem pedidos de acesso"
    >
      <Stack spacing={2}>
        {requests.map((request) => {
          const meta = statusMeta[request.status];
          const isPending = request.status === "PENDING";
          const isSubmitting = submittingId === request.id;

          return (
            <Box
              key={request.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isPending ? "#FFFBEB" : "#F8FAFC",
                border: `1px solid ${isPending ? "#FEF3C7" : "#E2E8F0"}`,
              }}
            >
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor:
                      user?.role === "ADMIN" ? "warning.main" : "primary.main",
                  }}
                >
                  {user?.role === "ADMIN" ? (
                    <Person fontSize="small" />
                  ) : (
                    <Cpu size={18} />
                  )}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={800}>
                    {user?.role === "ADMIN"
                      ? request.user.name
                      : `Sensor ${request.sensor.sensorCode}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.role === "ADMIN"
                      ? `Solicitou: ${request.sensor.sensorCode}`
                      : `Pedido criado em ${new Date(
                          request.createdAt ?? "",
                        ).toLocaleDateString("pt-PT")}`}
                  </Typography>
                </Box>
              </Stack>

              {user?.role === "ADMIN" && isPending ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    disabled={isSubmitting}
                    onClick={() => handleDecision(request, "approve")}
                    sx={{ flex: 1, fontWeight: 700, textTransform: "none" }}
                  >
                    {isSubmitting ? "A processar..." : "Aprovar"}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => handleDecision(request, "reject")}
                    sx={{ flex: 1, fontWeight: 700, textTransform: "none" }}
                  >
                    Recusar
                  </Button>
                </Stack>
              ) : (
                <Chip
                  size="small"
                  variant="outlined"
                  color={meta.color}
                  sx={{ fontWeight: 700 }}
                  label={meta.label}
                />
              )}
            </Box>
          );
        })}
      </Stack>
    </SmartView>
  );
}
