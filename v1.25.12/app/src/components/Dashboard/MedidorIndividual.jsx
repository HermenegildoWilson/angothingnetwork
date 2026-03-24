import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

const MedidorIndividual = React.memo(({ value, config }) => {
    const { warning_value, high_value, unit, min_value, max_value, key } =
        config;

    const statusColor = useMemo(() => {
        const v = parseFloat(value);
        /*if (key === "Pressão do Ar")
            return v <= high_value ? "#EF4444" :
                   v <= warning_value ? "#F59E0B" : "#10B981";*/

        return v >= high_value
            ? "#EF4444"
            : v >= warning_value
            ? "#F59E0B"
            : "#10B981";
    }, [value, warning_value, high_value, key]);

    return (
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
    );
});

export default MedidorIndividual;