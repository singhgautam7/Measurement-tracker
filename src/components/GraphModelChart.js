import React from "react";
import List from "@mui/joy/List";
import { LineChart } from "@mui/x-charts/LineChart";

export default function GraphModalChart({ xAxisData, seriesData, labelName }) {
    return (
        <React.Fragment>
            <List
                        sx={{
                            maxWidth: 500,
                            overflow: "auto",
                            mx: "calc(-1 * var(--ModalDialog-padding))",
                            px: "var(--ModalDialog-padding)",
                        }}
                    >
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
            </List>
        </React.Fragment>
    );
}
