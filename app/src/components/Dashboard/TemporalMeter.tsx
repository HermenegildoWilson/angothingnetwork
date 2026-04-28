import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { TemporalMeterProps } from "./types";
import parameterOptions from "@/config/sensor/parameterOptions";
import { Card, Divider, Typography } from "@mui/material";

const TemporalMeter = React.memo((temporalMeterProps: TemporalMeterProps) => {
  const { config = parameterOptions["Temperatura"], value = 0 } =
    temporalMeterProps;
  const { warning_value, high_value, unit, min_value, max_value } = config;

  const statusColor = useMemo(() => {
    /*if (key === "Pressão do Ar")
            return value <= high_value ? "#EF4444" :
                   value <= warning_value ? "#F59E0B" : "#10B981";*/

    return value >= high_value
      ? "#EF4444"
      : value >= warning_value
        ? "#F59E0B"
        : "#10B981";
  }, [value, warning_value, high_value]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        maxWidth: 350,
        minWidth: 300,
        p: 3,
        pt: 1.5,
        textAlign: "center",        
      }}
    >
      {/* <Box sx={{ width: "100%", textAlign: "right", pb: 2 }}>
        {value >= config.warning_value ? (
          <Chip
            icon={<WarningAmber />}
            label="Nível Elevado"
            color="warning"
            size="small"
            sx={{
              fontWeight: "bold",
              py: 1.7,
              px: 1,
              backgroundColor: "#ef4444",
            }}
          />
        ) : (
          <Chip
            icon={<Verified />}
            label="Nível Normal"
            color="success"
            size="small"
            sx={{ fontWeight: "bold", py: 1.7, backgroundColor: "#10b981" }}
          />
        )}
      </Box> */}
      <Typography variant="overline" color="text.secondary" fontWeight="bold">
        Leitura Instantânea
      </Typography>

      <Typography variant="h5" fontWeight="bold" mb={2}>
        {config.name}
      </Typography>

      <ReactECharts
        option={{
          series: [
            {
              type: "gauge",
              min: min_value,
              max: max_value,
              radius: "95%",
              center: ["50%", "60%"],
              startAngle: 200,
              endAngle: -20,
              axisLine: {
                lineStyle: { width: 10, color: [[1, "#E5E7EB"]] },
              },
              progress: {
                show: true,
                width: 10,
                itemStyle: { color: statusColor },
              },
              pointer: {
                show: true,
                length: "15%",
                width: 6,
                itemStyle: { color: statusColor },
              },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              detail: {
                valueAnimation: true,
                formatter: `{value}${unit}`,
                fontSize: 22,
                fontWeight: "bold",
                offsetCenter: [0, "30%"],
                color: "#1F2937",
              },
              data: [{ value }],
            },
          ],
        }}
        style={{ height: 180 }}
        opts={{ renderer: "svg" }}
      />

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ bgcolor: "grey.50", p: 1 }}
      >
        Limites:&nbsp;
        <b>
          {config.warning_value}
          {config.unit}
        </b>
        (Aviso) |
        <b>
          {config.high_value}
          {config.unit}
        </b>
        (Crítico)
      </Typography>
    </Card>
  );
});

export default TemporalMeter;
