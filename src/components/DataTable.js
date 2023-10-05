import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    selectNewRow,
    selectColumns,
    selectRows,
} from "../store/measurementSlice";
import { useEffect, useState } from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import "./DataTable.css";
import { convertStrToDateObj, convertDateObjToStr } from "../utils/dateUtil";

const DataTable = () => {
    const newRow = useSelector(selectNewRow);
    const columns = useSelector(selectColumns);
    const rows = useSelector(selectRows);
    const [dataLoaded, setDataLoaded] = useState(false);
    // const dates = rows.map((entry) => entry.Date);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarExport
                    printOptions={{ disableToolbarButton: true }}
                    csvOptions={{
                        fileName: "myMeasurements",
                        delimiter: ";",
                        utf8WithBom: true,
                    }}
                />
            </GridToolbarContainer>
        );
    }

    useEffect(() => {
        // Check if the necessary data is available
        if (
            newRow !== undefined &&
            columns !== undefined &&
            rows !== undefined
        ) {
            // Data is loaded
            setDataLoaded(true);
        }
    }, [newRow, columns, rows]);

    const gridColumns = [
        ...columns.map((columnName, index) => ({
            field: columnName,
            headerName: columnName,
            headerClassName: "data-grid-header-cell",
            cellClassName: "data-grid-cell",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150,
            type: columnName === "Date" ? "date" : "number",
            sortable: columnName === "Date" ? true : false,
            valueFormatter: (params) =>
                columnName === "Date"
                    ? convertDateObjToStr(params.value)
                    : params.value,
        })),
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            headerClassName: "data-grid-header-cell",
            cellClassName: "data-grid-cell",
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

    const gridRows = rows.map((item, index) => {
        item.Date = convertStrToDateObj(item.Date);
        item.id = index + 1;
        return item;
    });

    if (!dataLoaded) {
        // Render loading indicator
        // TODO: Add a loading indicator;
        return <></>;
    }

    return (
        <div className="measurement-table-container">
            <DataGrid
                rows={gridRows}
                columns={gridColumns}
                autoHeight
                // autoWidth
                disableColumnMenu
                disableRowSelectionOnClick
                // hideFooter
                initialState={{
                    sorting: {
                        sortModel: [{ field: "Date", sort: "asc" }],
                    },
                }}
                slots={{ toolbar: CustomToolbar }}
            />
        </div>
    );
};

export default DataTable;
