import { useEffect, useState } from "react";
import { Bell, Cpu } from "lucide-react";
import SmartView from "@/components/list/SmartView";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  async function getNotifications() {
    setNotifications([{}]);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getNotifications();
  }, []);

  return (
    <SmartView
      title="Notificações"
      items={notifications}
      ItemAvatar={Bell}
      voidMessage="Sem Notificações"
    >
      {/* {notifications.map((item, index) => (
        <SmartListItem
          item={item}
          keys={["sensorCode", "createdAt"]}
          ItemAvatar={Bell}
          handleItemClick={handleItemClick}
          key={item?.id || index}
        />
      ))} */}
      {user.role === "ADMIN" ? (
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
      ) : (
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
                bgcolor: "primary.main",
              }}
            >
              <Cpu fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={800}>
                Solicitou: Sensor TDS (Água)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date().toLocaleDateString("pt-BR", {
                  second: "2-digit",
                  minute: "2-digit",
                  hour: "2-digit",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              variant="outlined"
              color="warning"
              sx={{
                flex: 1,
                borderRadius: 2,
                fontWeight: 700,
                py: 2,
              }}
              label="Pendente"
            />
          </Stack>
        </Box>
      )}
    </SmartView>
  );
}
