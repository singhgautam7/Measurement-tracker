import React, { useState, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { LineChart } from "@mui/x-charts/LineChart";
import { convertStrToDateObj } from "../utils/dateUtil";
import GraphModalChart from "./GraphModelChart";
import GraphModalNoData from "./GraphModalNoData";

export default function GraphModal({ columnsConfig, rows, open, onClose }) {
    const filteredColumns = columnsConfig.filter((col) => col.name !== "Date");
    const [selectedColumnObject, setSelectedColumnObject] = useState(
        filteredColumns[0]
    );
    const createDataForChart = () => {
        return rows
            .filter((item) => item[selectedColumnObject.name] !== "")
            .map((item) => {
                return {
                    Date: convertStrToDateObj(item["Date"]),
                    [selectedColumnObject.name]:
                        item[selectedColumnObject.name],
                };
            })
            .sort((a, b) => a.Date - b.Date);
    };

    const [rowsForChart, setRowsForChart] = useState(createDataForChart());
    console.log("rowsForChart", rowsForChart);

    const handleColumnChange = (value) => {
        const columnObject = filteredColumns.find((item) => item.id === value);
        setSelectedColumnObject(columnObject);
        console.log("selected opn", selectedColumnObject);
    };

    useEffect(() => {
        setRowsForChart(createDataForChart());
    }, [selectedColumnObject]);

    return (
        <React.Fragment>
            <Modal open={open} onClose={(_event, reason) => onClose()}>
                <ModalDialog variant="outlined">
                    <ModalClose />
                    <DialogTitle>Charts</DialogTitle>
                    <DialogContent></DialogContent>
                    <Select
                        defaultValue={filteredColumns[0].id}
                        onChange={(_, value) => handleColumnChange(value)}
                    >
                        {filteredColumns.map((col, index) => (
                            <Option key={index} value={col.id}>
                                {`${col.name} (${col.unit})`}
                            </Option>
                        ))}
                    </Select>
                    {rowsForChart.length > 1 ? (
                        <GraphModalChart
                            xAxisData={rowsForChart.map((row) => row.Date)}
                            seriesData={rowsForChart.map(
                                (row) => row[selectedColumnObject.name]
                            )}
                            labelName={`${selectedColumnObject.name}(${selectedColumnObject.unit})`}
                        />
                    ) : (
                        <GraphModalNoData />
                    )}
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
