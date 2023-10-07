import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    selectColumns,
    selectRows,
    addNewRowFromData,
    removeRow,
} from "../store/measurementSlice";
import { useState } from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarColumnsButton,
    GridRowModes,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import "./DataTable.css";
import { convertStrToDateObj, convertDateObjToStr } from "../utils/dateUtil";
import { getEmptyNewRowModal, getRandomString } from "../utils/generalUtil";
import toast from "react-hot-toast";

function CustomToolbar(props) {
    const { setData, setDataModesModel, columns } = props;

    const handleClick = () => {
        const id = getRandomString();
        const newRow = getEmptyNewRowModal(columns);

        console.log("new id", id);

        setData((oldRows) => [...oldRows, { id: id, isNew: true, ...newRow }]);
        setDataModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "Date" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Add record
            </Button>
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

const DataTable = () => {
    const dispatch = useDispatch();
    const dataGridRef = useGridApiRef();
    const columns = useSelector(selectColumns);
    const rows = useSelector(selectRows);
    const gridRows = rows.map((item, index) => {
        // item.id = index + 1;
        return {
            ...item,
            Date: convertStrToDateObj(item.Date),
        };
    });

    // const [dataLoaded, setDataLoaded] = useState(false);
    const [data, setData] = useState(gridRows);
    const [dataModesModel, setDataModesModel] = useState({});

    const isRowValidated = (thisRow) => {
        // If all entries are string and are empty
        const isEmpty = Object.keys(thisRow)
            .filter((key) => key !== "Date")
            .every(
                (key) =>
                    typeof thisRow[key] === "string" &&
                    thisRow[key].trim() === ""
            );

        // If date already exists in the dates list
        // this Row has date object but rows has date string stored
        const isDateInData = rows.some((item) => item.Date === convertDateObjToStr(thisRow.Date));

        if (isEmpty) {
            toast.error("Atleast one value needs to be filled");
            return false;
        }

        if (isDateInData) {
            toast.error("Date already exists");
            return false;
        }

        return true;
    };

    const handleAddRowInState = (thisRow) => {
        if (isRowValidated(thisRow)) {
            dispatch(addNewRowFromData(thisRow));
        }
    };

    const handleRowEditStop = (params, event) => {
        console.log("handleRowEditStop invoked");
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        console.log("handleEditClick invoked");
        setDataModesModel({
            ...dataModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id) => () => {
        console.log("handleSaveClick invoked");
        setDataModesModel({
            ...dataModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = (id) => () => {
        console.log("handleDeleteClick invoked", id);
        dispatch(removeRow(id));
        setData(data.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        console.log("handleCancelClick invoked");
        setDataModesModel({
            ...dataModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = data.find((row) => row.id === id);
        if (editedRow.isNew) {
            setData(data.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRowData) => {
        console.log("processRowUpdate invoked", newRowData);
        const filteredRow = Object.fromEntries(
            Object.entries(newRowData).filter(([key]) => columns.includes(key))
        );
        if (!isRowValidated(filteredRow)) {
            return;
        }
        handleAddRowInState({ ...filteredRow, id: newRowData.id });

        const updatedRow = { ...newRowData, isNew: false };
        console.log("data before setting", data);
        setData(
            data.map((row) => (row.id === newRowData.id ? updatedRow : row))
        );
        console.log("data after setting", data);
        console.log("updatedRow", updatedRow);
        return updatedRow;
    };

    const handleProcessRowUpdateError = (error) => {
        console.log("process error", error);
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        console.log("handleRowModesModelChange invoked");
        setDataModesModel(newRowModesModel);
    };

    // const handleCellChange = (params) => {
    //     const { id, field, value } = params;
    //     console.log("cell change data", params)
    //     // const updatedData = data.map((row) =>
    //     //     row.id === id ? { ...row, [field]: value } : row
    //     // );
    //     // setData(updatedData);
    // };

    // useEffect(() => {
    //     // Check if the necessary data is available
    //     if (
    //         newRow !== undefined &&
    //         columns !== undefined &&
    //         rows !== undefined
    //     ) {
    //         // Data is loaded
    //         setDataLoaded(true);
    //     }
    // }, [newRow, columns, rows]);

    // if (!dataLoaded) {
    //     // Render loading indicator
    //     // TODO: Add a loading indicator;
    //     return <></>;
    // }

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
            editable: true,
            type: columnName === "Date" ? "date" : "number",
            sortable: columnName === "Date" ? true : false,
            valueFormatter: (params) =>
                columnName === "Date"
                    ? convertDateObjToStr(params.value)
                    : params.value,
            // valueGetter: (params) => {
            //     if (columnName === "Date") {
            //         return params.value;
            //     } else {
            //         const num = Number(params.value);
            //         const minVal = 1;
            //         const maxVal = 999;

            //         if (num < minVal) {
            //             return String(minVal);
            //         } else if (num > maxVal) {
            //             return String(maxVal);
            //         }

            //         return String(num);
            //     }
            // },
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
            getActions: ({ id }) => {
                const isInEditMode =
                    dataModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <div className="measurement-table-container">
            <DataGrid
                apiRef={dataGridRef}
                rows={data}
                columns={gridColumns}
                autoHeight
                // autoWidth
                disableColumnMenu
                disableRowSelectionOnClick
                // hideFooter
                editMode="row"
                rowModesModel={dataModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                onCellDoubleClick={(params, event) => {
                    event.stopPropagation();
                }}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                initialState={{
                    sorting: {
                        sortModel: [{ field: "Date", sort: "asc" }],
                    },
                }}
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                    toolbar: { setData, setDataModesModel, columns },
                }}
            />
        </div>
    );
};

export default DataTable;
