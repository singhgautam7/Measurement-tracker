import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function GraphModalChart({ xAxisData, seriesData, labelName }) {
    return (
        <React.Fragment>
            <LineChart
                xAxis={[
                    {
                        data: xAxisData,
                        scaleType: "time",
                    },
                ]}
                series={[
                    {
                        data: seriesData,
                        curve: "linear",
                        label: labelName,
                        color: "#4e79a7",
                        legend: { hidden: true },
                    },
                ]}
                width={500}
                height={300}
            />
        </React.Fragment>
    );
}
