import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    selectNewRow,
    selectDates,
    selectBodyParts,
    selectEntries,
} from "../store/measurementSlice";
import { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import "./DataTable.css";

const DataTable = () => {
    const newRow = useSelector(selectNewRow);
    const dates = useSelector(selectDates);
    const bodyParts = useSelector(selectBodyParts);
    const entries = useSelector(selectEntries);

    const [dataLoaded, setDataLoaded] = useState(false);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
            </GridToolbarContainer>
        );
    }

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
        {
            field: "col1",
            headerName: "Date",
            // TODO: Add date type
            // type: "date",
            headerClassName: "header-cell",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150,
        },
        ...bodyParts.map((part, index) => ({
            field: `col${index + 2}`,
            type: "number",
            headerName: part,
            headerClassName: "header-cell",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 100,
            sortable: false,
        })),
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            headerClassName: "header-cell",
            headerAlign: "center",
            align: "center",
            flex: 0.7,
            minWidth: 50,
            getActions: () => [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
            ],
        },
    ];

    const rows = dates.map((date, index) => {
        const row = { id: index + 1, col1: date };

        for (let i = 0; i < entries[index].length; i++) {
            row[`col${i + 2}`] = entries[index][i];
        }

        return row;
    });

    console.log("columns", columns)
    console.log("rows", rows)

    if (!dataLoaded) {
        // Render loading indicator
        // TODO: Add a loading indicator;
        return <></>;
    }

    return (
        <div className="measurement-table-container">
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                autoWidth
                disableColumnMenu
                disableRowSelectionOnClick
                initialState={{
                    sorting: {
                        sortModel: [{ field: "col1", sort: "asc" }],
                    },
                }}
                slots={{ toolbar: CustomToolbar }}
            />
        </div>
    );
};

export default DataTable;
