import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import {
    selectColumns,
    selectRows,
    addRow,
    removeRow,
    editRow,
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
    GridEditInputCell,
} from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import "./DataTable.css";
import {
    convertStrToDateObj,
    convertDateObjToStr,
    getFormattedTodayDate,
} from "../utils/dateUtil";
import { getEmptyNewRowModal, getRandomString } from "../utils/generalUtil";
import toast from "react-hot-toast";

function CustomToolbar(props) {
    const { setData, setDataModesModel, columns } = props;

    const handleClick = () => {
        const id = getRandomString();
        const newRow = getEmptyNewRowModal(columns);

        setData((oldRows) => [...oldRows, { id: id, isNew: true, ...newRow }]);
        setDataModesModel((oldModel) => ({
            ...oldModel,
            [id]: {
                mode: GridRowModes.Edit,
                fieldToFocus: "Date",
            },
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
        return {
            ...item,
            Date: convertStrToDateObj(item.Date),
        };
    });

    // const [dataLoaded, setDataLoaded] = useState(false);
    const [data, setData] = useState(gridRows);
    const [dataModesModel, setDataModesModel] = useState({});

    const isRowValidated = (thisRow, oldDate = null) => {
        // If all entries are string and are empty
        const isEmpty = Object.keys(thisRow)
            .filter((key) => key !== "Date")
            .every(
                (key) =>
                    typeof thisRow[key] === "string" &&
                    thisRow[key].trim() === ""
            );

        let isDateInData = false;
        // If date already exists in the dates list
        if (oldDate != null && oldDate === thisRow.Date) {
            isDateInData = false;
        } else {
            // this Row has date object but rows has date string stored
            isDateInData = rows.some(
                (item) => item.Date === convertDateObjToStr(thisRow.Date)
            );
            console.log("else", isDateInData);
        }

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

        if (newRowData.isNew) {
            // If the row is being added
            if (!isRowValidated(filteredRow)) {
                return;
            }
            dispatch(addRow({ ...filteredRow, id: newRowData.id }));
            toast.success("New row added successfully");
        } else {
            // If the row is being edited
            const oldData = data.find((row) => row.id === newRowData.id);
            const oldDate = oldData.Date;
            if (!isRowValidated(filteredRow, oldDate)) {
                return;
            }
            dispatch(editRow({ ...filteredRow, id: newRowData.id }));
            toast.success("Row modified successfully");
        }

        const updatedRow = { ...newRowData, isNew: false };
        setData(
            data.map((row) => (row.id === newRowData.id ? updatedRow : row))
        );
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
        {
            field: "Date",
            headerName: "Date",
            headerClassName: "data-grid-header-cell",
            cellClassName: "data-grid-cell",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150,
            type: "date",
            sortable: true,
            editable: true,
            valueFormatter: (params) => convertDateObjToStr(params.value),
        },
        ...columns
            .filter((columnName) => columnName !== "Date")
            .map((columnName, index) => ({
                field: columnName,
                headerName: columnName,
                headerClassName: "data-grid-header-cell",
                cellClassName: "data-grid-cell",
                headerAlign: "center",
                align: "center",
                flex: 1,
                minWidth: 150,
                type: "number",
                sortable: false,
                editable: true,
                valueFormatter: (params) => params.value,
                renderEditCell: (params) => (
                    <GridEditInputCell
                        {...params}
                        inputProps={{
                            max: 999,
                            min: 1,
                        }}
                    />
                ),
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
