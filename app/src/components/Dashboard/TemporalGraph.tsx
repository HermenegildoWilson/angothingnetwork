import React from "react";
import ReactECharts from "echarts-for-react";
import type { TemporalGraphProps } from "./types";
import parameterOptions from "@/config/sensor/parameterOptions";
import { Box, Card, Typography } from "@mui/material";

const TemporalGraph = React.memo((temporalGraphProps: TemporalGraphProps) => {
  const {
    config = parameterOptions["Temperatura"],
    labels = [],
    values = [],
    maxPoints,
  } = temporalGraphProps;
  return (
    <Card
      elevation={0}
      sx={{
        flex: "auto",
        borderRadius: 4,
        flexGrow: "1",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Últimas Leituras
          </Typography>
        </Box>

        <ReactECharts
          option={{
            grid: { top: 20, right: 20, bottom: 40, left: 50 },
            tooltip: { trigger: "axis" },
            xAxis: {
              type: "category",
              data: labels,
              boundaryGap: false,
              axisLabel: { color: "#9CA3AF", fontSize: 11 },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                formatter: `{value}${config.unit}`,
                color: "#9CA3AF",
                fontSize: 11,
              },
              splitLine: { lineStyle: { type: "dashed", color: "#F3F4F6" } },
            },
            series: [
              {
                data: values,
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 8,
                itemStyle: { color: config.color },
                lineStyle: { width: 3, color: config.color },
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: config.color },
                      { offset: 1, color: "transparent" },
                    ],
                  },
                  opacity: 0.1,
                },
              },
            ],
          }}
          style={{ height: 250 }}
          opts={{ renderer: "svg" }}
        />

        <Box
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Exibindo os últimos {maxPoints} pontos.
          </Typography>
        </Box>
      </Box>
    </Card>
  );
});

export default TemporalGraph;
