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
import parameterOptions from "@/config/sensor/parameterOptions";
import type { parameterOptionsField } from "@/config/sensor/types";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useState } from "react";
import type { SensorReadingDto } from "@/services/sensor/types";
import { useSensorsReading } from "@/hooks/useSensors";

// KPIs rápidas
const stats = (actualReading: SensorReadingDto) =>
  ["Temperatura", "Qualidade do Ar", "Humidade", "Pressão do Ar"].map(
    (key: parameterOptionsField) => {
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

export default function CardsTelemetria(props: { boxProps?: BoxProps }) {
  const { SensorReadingDto } = useSensorsReading();
  //setActualReading
  const [actualReading] = useState<SensorReadingDto>(SensorReadingDto?.[0]);

  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: { xs: "center", md: "flex-start" },
        gridTemplateColumns: {
          md: "repeat(4, minmax(100px, 200px))",
          xs: "repeat(2, minmax(100px, 160px))",
        },
        gap: { xs: 1, md: 3 },
        mb: 2,
        ...props.boxProps?.sx,
      }}
    >
      {stats(actualReading).map((stat, i) => (
        <Box key={i}>
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              transition: ".4s",
              ":hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                scale: 1.03,
              },
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
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
                    color: "#10b981",
                    fontWeight: 800,
                    fontSize: "0.65rem",
                  }}
                />
              </Stack>
              <Typography variant="h5" fontWeight={900} textAlign={"left"}>
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={"left"}
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
