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
import { ArrowDownward, ArrowUpward, Remove } from "@mui/icons-material";
import { useState } from "react";
import type { SensorReadingDto } from "@/services/sensor/types";
import { useSensorsReading } from "@/hooks/useSensors";
import type { parameterOptionsName } from "@/config/sensor/types";
import parameterOptions from "@/config/sensor/parameterOptions";

const formatReading = (value: unknown, unit?: string) => {
  if (value === null || value === undefined || value === "") return "--";
  const numericValue = Number(value);
  const displayValue = Number.isNaN(numericValue)
    ? String(value)
    : numericValue.toLocaleString("pt-PT", {
        maximumFractionDigits: 2,
      });
  return unit ? `${displayValue}${unit}` : displayValue;
};

const formatChange = (changeValue: number, unit?: string) => {
  const formattedValue = Math.abs(changeValue).toLocaleString("pt-PT", {
    maximumFractionDigits: 2,
  });
  const signal = changeValue > 0 ? "+" : changeValue < 0 ? "-" : "";

  return unit
    ? `${signal}${formattedValue}${unit}`
    : `${signal}${formattedValue}`;
};

const getChange = (
  actualValue: unknown,
  previousValue: unknown,
  unit?: string,
) => {
  const actualNumber = Number(actualValue);
  const previousNumber = Number(previousValue);
  const changeValue =
    Number.isFinite(actualNumber) && Number.isFinite(previousNumber)
      ? actualNumber - previousNumber
      : 0;

  if (changeValue === 0) {
    return {
      change: formatChange(changeValue, unit),
      changeColor: "#64748b",
      ChangeIcon: <Remove sx={{ fontSize: 14, color: "#64748b" }} />,
    };
  }

  return {
    change: formatChange(changeValue, unit),
    changeColor: changeValue > 0 ? "#10b981" : "#ef4444",
    ChangeIcon:
      changeValue > 0 ? (
        <ArrowUpward sx={{ fontSize: 14, color: "#10b981" }} />
      ) : (
        <ArrowDownward sx={{ fontSize: 14, color: "#ef4444" }} />
      ),
  };
};

const stats = (
  actualReading?: SensorReadingDto,
  previousReading?: SensorReadingDto,
) =>
  ["Temperatura", "Qualidade do Ar", "Humidade", "Pressão do Ar"].map(
    (key: parameterOptionsName) => {
      const config = parameterOptions[key];
      const value = actualReading?.[config.field];
      const previousValue = previousReading?.[config.field];
      const change = getChange(value, previousValue, config.unit);

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
  const [readingPair, setReadingPair] = useState<{
    key?: string;
    actual?: SensorReadingDto;
    previous?: SensorReadingDto;
  }>({ actual: SensorReading[0] });

  const actualReading = SensorReading[0];
  const readingKey = actualReading?.sensorCode
    ? [
        actualReading.sensorCode,
        actualReading.timestamp,
        actualReading.temperature,
        actualReading.air_quality,
        actualReading.humidity,
        actualReading.pressure,
      ].join(":")
    : undefined;

  const previousReading =
    actualReading?.sensorCode === readingPair.actual?.sensorCode
      ? readingPair.actual
      : undefined;

  const currentReadingPair =
    readingPair.key === readingKey
      ? readingPair
      : {
          key: readingKey,
          actual: actualReading,
          previous: previousReading,
        };

  if (readingPair.key !== readingKey) {
    setReadingPair(currentReadingPair);
  }

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
      {stats(currentReadingPair.actual, currentReadingPair.previous).map(
        (stat, i) => (
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
