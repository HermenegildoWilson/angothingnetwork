import type { ReactNode } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Grass, Person } from "@mui/icons-material";
import { Cpu } from "lucide-react";
import type {
  SensorAccessRequestDto,
  SensorAccessRequestStatus,
  SensorDto,
} from "@/services/sensor/types";

type SummaryPanelProps = {
  title: string;
  actionLabel?: string;
  emptyMessage: string;
  children: ReactNode;
  onAction?: () => void;
  hasItems: boolean;
};

const requestStatusMeta: Record<
  SensorAccessRequestStatus,
  { label: string; color: "warning" | "success" | "error" }
> = {
  PENDING: { label: "Pendente", color: "warning" },
  APPROVED: { label: "Aprovado", color: "success" },
  REJECTED: { label: "Recusado", color: "error" },
};

export function SummaryPanel({
  actionLabel = "Ver Todas",
  children,
  emptyMessage,
  hasItems,
  onAction,
  title,
}: SummaryPanelProps) {
  return (
    <Card
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 4,
        height: "100%",
        minWidth: 0,
      }}
    >
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 2.5 }}
      >
        <Typography variant="h6" fontWeight={900}>
          {title}
        </Typography>
        {onAction && (
          <Button size="small" variant="outlined" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>

      {hasItems ? (
        <Stack spacing={1.5}>{children}</Stack>
      ) : (
        <Box
          sx={{
            minHeight: 150,
            display: "grid",
            placeItems: "center",
            borderRadius: 3,
            bgcolor: "rgba(241,245,249,0.72)",
            border: "1px dashed rgba(148,163,184,0.55)",
            px: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={700}>
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </Card>
  );
}

export function StationSummaryItem({ station }: { station: SensorDto }) {
  const isInactive = Boolean(station.deletedAt);

  return (
    <Box
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 3,
        bgcolor: "rgba(241,245,249,0.86)",
        border: "1px solid rgba(226,232,240,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 3,
            bgcolor: "rgba(16,185,129,0.14)",
            color: "#10b981",
          }}
        >
          <Grass fontSize="small" />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" fontWeight={850} noWrap>
            {station.sensorCode}
          </Typography>
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ mt: 0.5, minWidth: 0 }}
          >
            <Chip label="Sensor" size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary" noWrap>
              Registado no sistema
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Chip
        label={isInactive ? "Inativo" : "Ativo"}
        color={isInactive ? "warning" : "success"}
        size="small"
        variant="outlined"
        sx={{ flexShrink: 0 }}
      />
    </Box>
  );
}

export function AccessRequestSummaryItem({
  isAdmin,
  request,
}: {
  isAdmin: boolean;
  request: SensorAccessRequestDto;
}) {
  const meta = requestStatusMeta[request.status];

  return (
    <Box
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 3,
        bgcolor: isAdmin ? "rgba(255,251,235,0.88)" : "rgba(238,242,255,0.86)",
        border: isAdmin
          ? "1px solid rgba(254,243,199,0.95)"
          : "1px solid rgba(199,210,254,0.9)",
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 3,
            bgcolor: isAdmin
              ? "rgba(245,158,11,0.16)"
              : "rgba(129,140,248,0.16)",
            color: isAdmin ? "warning.main" : "primary.main",
          }}
        >
          {isAdmin ? <Person fontSize="small" /> : <Cpu size={19} />}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={850} noWrap>
            {isAdmin
              ? request.user.name
              : `Sensor ${request.sensor.sensorCode}`}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {isAdmin ? `Solicitou: ${request.sensor.sensorCode}` : meta.label}
          </Typography>
        </Box>
      </Stack>

      <Chip
        size="small"
        variant="outlined"
        color={meta.color}
        label={meta.label}
        sx={{ flexShrink: 0 }}
      />
    </Box>
  );
}
