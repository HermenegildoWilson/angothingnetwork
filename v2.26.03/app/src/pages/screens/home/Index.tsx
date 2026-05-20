import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { useAuth } from "@/hooks/useAuth";
import TemporalCards from "../../../components/Dashboard/TemporalCards";
import { useNavigate } from "react-router-dom";
import { sensorService } from "@/services/sensor/sensor.service";
import type {
  SensorAccessRequestDto,
  SensorDto,
} from "@/services/sensor/types";
import {
  AccessRequestSummaryItem,
  StationSummaryItem,
  SummaryPanel,
} from "./SummaryPanel";
import { DashboardSkeleton } from "@/components/feedback/loader/PageSkeletons";

export default function Main() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState<SensorDto[]>([]);
  const [requests, setRequests] = useState<SensorAccessRequestDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      const [sensorsResponse, requestsResponse] = await Promise.all([
        sensorService.find.all(),
        sensorService.accessRequests.all(
          user?.role === "ADMIN" ? "PENDING" : undefined,
        ),
      ]);

      if (sensorsResponse.success) {
        setStations((sensorsResponse.data ?? []).slice(0, 3));
      }

      if (requestsResponse.success) {
        setRequests((requestsResponse.data ?? []).slice(0, 3));
      }
      setLoading(false);
    };

    void loadSummary();
  }, [user?.role]);

  const isAdmin = user?.role === "ADMIN";

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        p: { xs: 1.25, sm: 2, lg: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
          mb: 5,
        }}
      >
        <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
          <Title>Olá, {user?.name?.split(" ")[0]}</Title>
          <Text>Eis o resumo do seu ecossistema para hoje.</Text>
        </Box>

        <TemporalCards
          boxProps={{
            sx: {
              mb: { xs: 2.5, md: 3 },
            },
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 3 },
            alignItems: "stretch",
            minWidth: 0,
          }}
        >
          <SummaryPanel
            title={isAdmin ? "Estações" : "As Minhas Estações"}
            emptyMessage={
              isAdmin
                ? "Ainda não há estações registadas."
                : "Ainda não há estações associadas à sua conta."
            }
            hasItems={stations.length > 0}
            onAction={() => navigate("/devices")}
          >
            {stations.map((station) => (
              <StationSummaryItem
                key={station.id}
                station={station}
                onClick={() => navigate(`/devices/${station.id}`)}
              />
            ))}
          </SummaryPanel>

          <SummaryPanel
            title={isAdmin ? "Pedidos de Acesso" : "Meus Pedidos de Acesso"}
            emptyMessage={
              isAdmin
                ? "Não há pedidos pendentes neste momento."
                : "Ainda não há pedidos de acesso para apresentar."
            }
            hasItems={requests.length > 0}
            onAction={() => navigate("/sensor-access-requests")}
          >
            {requests.map((request) => (
              <AccessRequestSummaryItem
                key={request.id}
                request={request}
                isAdmin={isAdmin}
              />
            ))}
          </SummaryPanel>
        </Box>
      </Box>
    </Box>
  );
}
