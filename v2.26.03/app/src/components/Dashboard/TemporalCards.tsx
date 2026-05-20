import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  type BoxProps,
} from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useEffect, useState } from "react";
import type { SensorReadingDto } from "@/services/sensor/types";
import { useSensorsReading } from "@/hooks/useSensors";
import type { parameterOptionsName } from "@/config/sensor/types";
import parameterOptions from "@/config/sensor/parameterOptions";

const stats = (actualReading: SensorReadingDto) =>
  ["Temperatura", "Qualidade do Ar", "Humidade", "Pressão do Ar"].map(
    (key: parameterOptionsName) => {
      const formatReading = (value, unit) => {
        if (value === null || value === undefined || value === "") return "--";
        const numericValue = Number(value);
        const displayValue = Number.isNaN(numericValue)
          ? String(value)
          : numericValue.toLocaleString("pt-PT", {
              maximumFractionDigits: 2,
            });
        return unit ? `${displayValue}${unit}` : displayValue;
      };

      const config = parameterOptions[key];
      const changes = {
        Temperatura: Number(0.2),
        Humidade: Number(2),
        "Qualidade do Ar": Number(-5),
        "Pressão do Ar": Number(0),
      };
      const change = {
        change: changes[key] >= 0 ? `+${changes[key]}` : `${changes[key]}`,
        changeColor: changes[key] >= 0 ? "#10b981" : "#ef4444",
        ChangeIcon:
          changes[key] >= 0 ? (
            <ArrowUpward sx={{ fontSize: 14, color: "#10b981" }} />
          ) : (
            <ArrowDownward sx={{ fontSize: 14, color: "#ef4444" }} />
          ),
      };

      const value = actualReading?.[config.field];

      return {
        title: config?.name,
        value: formatReading(value, config.unit),
        ...change,
        status:
          value >= config.warning_value ? "Nível Elevado" : "Nível Normal",
        statusColor: value >= config.warning_value ? "#ef4444" : "#10b981",
        Icon: config.Icon,
        color: config.color,
      };
    },
  );

export default function TemporalCards(props: { boxProps?: BoxProps }) {
  const { SensorReading } = useSensorsReading();
  const [actualReading, setActualReading] = useState<SensorReadingDto>(
    SensorReading?.[0],
  );

  useEffect(() => {
    setActualReading(SensorReading[0]);
  }, [SensorReading]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        justifyContent: "stretch",
        gridTemplateColumns: {
          xs: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
          sm: "repeat(2, minmax(160px, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: { xs: 1.25, md: 2, lg: 3 },
        mb: 2,
        ...props.boxProps?.sx,
      }}
    >
      {stats(actualReading).map((stat, i) => (
        <Box key={i} sx={{ minWidth: 0 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              transition: ".4s",
              ":hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                scale: 1.03,
              },
            }}
          >
            <CardContent
              sx={{
                p: { xs: 1.5, sm: 2 },
                "&:last-child": { pb: { xs: 1.5, sm: 2 } },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={1}
                sx={{ mb: 2 }}
              >
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    borderRadius: 2,
                  }}
                >
                  <stat.Icon />
                </Avatar>
                <Chip
                  label={stat.status}
                  size="small"
                  sx={{
                    bgcolor: "#ecfdf5",
                    color: stat.statusColor,
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    maxWidth: { xs: 92, sm: "none" },
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </Stack>
              <Typography
                variant="h5"
                fontWeight={900}
                textAlign="left"
                noWrap
                sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="left"
                noWrap
                sx={{ mt: 0.5 }}
              >
                {stat.title}
              </Typography>

              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mt: 1.5 }}
              >
                {stat.ChangeIcon}
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: stat.changeColor }}
                >
                  {stat.change}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
}
