import { Fragment } from "react";
import { useSelector } from "react-redux";
import {
    selectNewRow,
    selectDates,
    selectBodyParts,
    selectEntries,
} from "../store/measurementSlice";
import { useEffect, useState } from "react";
import "./DataTable.css";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = () => {
    const newRow = useSelector(selectNewRow);
    const dates = useSelector(selectDates);
    const bodyParts = useSelector(selectBodyParts);
    const entries = useSelector(selectEntries);

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        // Check if the necessary data is available
        if (
            newRow !== undefined &&
            dates !== undefined &&
            bodyParts !== undefined &&
            entries !== undefined
        ) {
            // Data is loaded
            setDataLoaded(true);
        }
    }, [newRow, dates, bodyParts, entries]);

    const columns = [
        { field: "col1", headerName: "Date" },
        ...bodyParts.map((part, index) => ({
            field: `col${index + 2}`,
            headerName: part,
        })),
    ];

    const rows = dates.map((date, index) => {
        const row = { id: index + 1, col1: date };

        for (let i = 0; i < entries[index].length; i++) {
            row[`col${i + 2}`] = entries[index][i];
        }

        return row;
    });

    if (!dataLoaded) {
        // Render loading indicator
        // TODO: Add a loading indicator;
        return <></>;
    }

    return (
        <div>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
};

export default DataTable;
