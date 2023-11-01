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
import ColumnIcon from "@mui/icons-material/AppRegistration";
import ChartIcon from "@mui/icons-material/Timeline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "./DataTable.css";
import {
    convertStrToDateObj,
    convertDateObjToStr,
    getFormattedTodayDate,
} from "../utils/dateUtil";
import { getEmptyNewRowModal, getRandomString } from "../utils/generalUtil";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import ColumnsModal from "./ColumnsModal";
import GraphModal from "./GraphModal";
import DeleteRowConfirmation from "./DeleteRowConfirmation";
import ImportModal from "./ImportModal";

function CustomToolbar(props) {
    const {
        columns,
        rows,
        setData,
        setDataModesModel,
        setOpenColumnsModal,
        setOpenGraphModal,
        setOpenImportModal,
    } = props;

    const handleClick = () => {
        const id = getRandomString();
        const newRow = getEmptyNewRowModal(columns);
        console.log("Adding new empty row", newRow);

        setData((oldRows) => [...oldRows, { id: id, isNew: true, ...newRow }]);
        setDataModesModel((oldModel) => ({
            ...oldModel,
            [id]: {
                mode: GridRowModes.Edit,
                fieldToFocus: "Date",
            },
        }));
    };

    const handleExportClick = () => {
        const rowsWithoutId = rows.map((row) => {
            const { id, ...rest } = row; // Use object destructuring to exclude "id"
            return rest;
        });

        const worksheet = XLSX.utils.json_to_sheet(rowsWithoutId);
        XLSX.utils.sheet_add_aoa(worksheet, [columns.map((c) => c.name)], {
            origin: "A1",
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        XLSX.writeFile(workbook, "measurementData.xlsx", { compression: true });
    };

    const handleImportClick = () => {
        setOpenImportModal(true);
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
            <Button
                color="primary"
                startIcon={<ColumnIcon />}
                onClick={() => setOpenColumnsModal(true)}
            >
                Columns
            </Button>
            <Button
                color="primary"
                startIcon={<ChartIcon />}
                onClick={() => setOpenGraphModal(true)}
            >
                Charts
            </Button>
            <Button
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={() => handleExportClick(true)}
            >
                Export
            </Button>
            <Button
                color="primary"
                startIcon={<FileUploadIcon />}
                onClick={() => handleImportClick(true)}
            >
                Import
            </Button>
        </GridToolbarContainer>
    );
}

const DataTable = () => {
    const dispatch = useDispatch();
    const dataGridApiRef = useGridApiRef();
    const columnsConfig = useSelector(selectColumns);
    const columns = columnsConfig.map((column) => column.name);
    const rows = useSelector(selectRows);
    const gridRows = rows.map((item, index) => {
        return {
            ...item,
            Date: convertStrToDateObj(item.Date),
        };
    });

    const [data, setData] = useState(gridRows);
    const [dataModesModel, setDataModesModel] = useState({});
    const [openColumnsModal, setOpenColumnsModal] = useState(false);
    const [openGraphModal, setOpenGraphModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [confirmationPromise, setConfirmationPromise] = useState(null);

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
        }

        if (thisRow.Date > getFormattedTodayDate()) {
            toast.error("Future dates are not allowed");
            return false;
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

        setOpenConfirmationModal(true);
        const deletePromise = new Promise((resolve, reject) => {
            setConfirmationPromise({ resolve, reject });
        });

        deletePromise
            .then(() => {
                console.log("Handling success logic");
                dispatch(removeRow(id));
                setData(data.filter((row) => row.id !== id));
                setOpenConfirmationModal(false);
            })
            .catch((error) => {
                console.error("Handling failure logic", error);
            });
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

    const handleDeleteConfirmationPromise = (confirm) => {
        console.log("handleDeleteConfirmationPromise", confirm);
        if (confirmationPromise) {
            if (confirm) {
                console.log("Resolving delete promise");
                confirmationPromise.resolve();
            } else {
                console.log("Rejecting delete promise");
                confirmationPromise.reject();
            }
            setConfirmationPromise(null);
        }
    };

    const gridColumns = [
        {
            field: "Date",
            headerName: "Date",
            headerClassName: "data-grid-header-cell",
            cellClassName: "data-grid-action-cell",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150,
            type: "date",
            sortable: true,
            editable: true,
            renderHeader: (params) => <strong>{params.field}</strong>,
            valueFormatter: (params) => convertDateObjToStr(params.value),
        },
        ...columnsConfig
            .filter((column) => column.name !== "Date")
            .map((column, index) => ({
                field: column.name,
                headerName:
                    column.unit === ""
                        ? column.name
                        : `${column.name} (${column.unit})`,
                headerClassName: "data-grid-header-cell",
                cellClassName: "data-grid-cell",
                headerAlign: "center",
                align: "center",
                flex: 0.85,
                minWidth: 100,
                type: "number",
                sortable: false,
                editable: true,
                renderHeader: (params) => (
                    <strong>{params.colDef.headerName}</strong>
                ),
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
            field: "Actions",
            type: "actions",
            headerName: "Actions",
            headerClassName: "data-grid-header-cell",
            cellClassName: "data-grid-cell",
            headerAlign: "center",
            align: "center",
            renderHeader: (params) => <strong>{params.field}</strong>,
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
                        // sx={{
                        //     color: "red",
                        // }}
                    />,
                ];
            },
        },
    ];

    return (
        <div className="measurement-table-container">
            {openColumnsModal && (
                <ColumnsModal
                    columnsConfig={columnsConfig}
                    rows={rows}
                    open={openColumnsModal}
                    onClose={() => setOpenColumnsModal(false)}
                />
            )}

            {openGraphModal && (
                <GraphModal
                    columnsConfig={columnsConfig}
                    rows={rows}
                    open={openGraphModal}
                    onClose={() => setOpenGraphModal(false)}
                />
            )}

            {openConfirmationModal && (
                <DeleteRowConfirmation
                    open={openConfirmationModal}
                    onClose={() => setOpenConfirmationModal(false)}
                    handleDeleteConfirmationPromise={
                        handleDeleteConfirmationPromise
                    }
                />
            )}

            {openImportModal && (
                <ImportModal
                    open={openImportModal}
                    onClose={() => setOpenImportModal(false)}
                />
            )}

            <DataGrid
                apiRef={dataGridApiRef}
                rows={data}
                columns={gridColumns}
                autoHeight
                disableColumnMenu
                disableRowSelectionOnClick
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
                    toolbar: {
                        columns,
                        rows,
                        setData,
                        setDataModesModel,
                        setOpenColumnsModal,
                        setOpenGraphModal,
                        setOpenImportModal,
                    },
                }}
                sx={{
                    boxShadow: 2,
                    border: 1,
                    borderColor: "primary.light",
                    "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                    },
                    padding: 1,
                }}
            />
        </div>
    );
};

export default DataTable;
