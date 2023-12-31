﻿import React, { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import IconButton from "@mui/joy/IconButton";
import Add from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Divider from "@mui/joy/Divider";
import Input from "@mui/joy/Input";
import { getRandomInt } from "../utils/generalUtil";
import ColumnsConfirmationModal from "./ColumnsConfirmationModal";
import { modifyColumns, modifyRows } from "../store/measurementSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import isEqual from "lodash/isEqual";

const ColumnsModal = ({ columnsConfig, rows, open, onClose }) => {
    const dispatch = useDispatch();
    const tempColumnsConfig = columnsConfig.map((column) => ({
        ...column,
        disabled: true,
        error: false,
    }));
    const [oldColumnsConfig, setOldColumnsConfig] = useState(tempColumnsConfig);
    const [newColumnsConfig, setNewColumnsConfig] = useState([]);
    const [allColumns, setAllColumns] = useState([]);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [saveButtonLoading, setSaveButtonLoading] = useState(false);
    const [confirmationPromise, setConfirmationPromise] = useState(null);

    useEffect(() => {
        const combined = [...oldColumnsConfig, ...newColumnsConfig].map(
            ({ id, name, unit }) => ({ id, name, unit })
        );
        setAllColumns(combined);
    }, [oldColumnsConfig, newColumnsConfig]);

    function hasDuplicateNames(arr) {
        const seen = {};

        for (const item of arr) {
            const name = item.name;

            if (seen[name]) {
                return true; // Found a duplicate
            } else {
                seen[name] = true;
            }
        }

        return false; // No duplicates found
    }
    const modifyStoreOnSave = () => {
        // const newItems = allColumns.filter(({ id }) => !columnsConfig.some(column => column.id === id));
        const removedItems = columnsConfig.filter(
            ({ id }) => !allColumns.some((column) => column.id === id)
        );
        // const updatedItems = allColumns.filter(({ id }) => {
        //     const allColumn = allColumns.find(column => column.id === id);
        //     const columnsConfigColumn = columnsConfig.find(column => column.id === id);

        //     return allColumn.unit !== columnsConfigColumn.unit || allColumn.name !== columnsConfigColumn.name;
        // });
        const newColumnNames = newColumnsConfig.map((column) => column.name);
        const removedColumnNames = removedItems.map((column) => column.name);

        const updatedRows = rows.map((row) => {
            const updatedRow = { ...row };

            // Add new columns to the row
            newColumnNames.forEach((newName) => {
                updatedRow[newName] = "";
            });

            // Remove columns from the row
            removedColumnNames.forEach((oldName) => {
                delete updatedRow[oldName];
            });

            return updatedRow;
        });

        dispatch(modifyColumns(allColumns));
        dispatch(modifyRows(updatedRows));
    };

    const handleSaveConfirmationPromise = (confirm) => {
        if (confirmationPromise) {
            if (confirm) {
                console.log("Resolving promise");
                confirmationPromise.resolve();
            } else {
                console.log("Rejecting promise");
                confirmationPromise.reject();
            }
            setConfirmationPromise(null);
        }
    };

    const highlightEmptyColumns = () => {
        const updatedOldColumnsConfig = oldColumnsConfig.map((column) => {
            if (column.name === "") {
                return { ...column, error: true };
            }
            return column;
        });
        const updatedNewColumnsConfig = newColumnsConfig.map((column) => {
            if (column.name === "") {
                return { ...column, error: true };
            }
            return column;
        });

        setOldColumnsConfig(updatedOldColumnsConfig);
        setNewColumnsConfig(updatedNewColumnsConfig);
    };

    const handleSaveClick = () => {
        // If no data is changed, throw error
        if (isEqual(columnsConfig, allColumns)) {
            toast.error("Please make any changes first");
            return;
        }

        highlightEmptyColumns();

        // If name is empty, throw error
        if (allColumns.some((column) => column.name === "")) {
            toast.error("The column name cannot be empty");
            return;
        }

        // If there are duplicate names
        if (hasDuplicateNames(allColumns)) {
            toast.error("Cannot have two columns with same name");
            return;
        }

        setOpenConfirmationModal(true);
        const savePromise = new Promise((resolve, reject) => {
            setConfirmationPromise({ resolve, reject });
        });

        savePromise
            .then(() => {
                console.log("Handling success logic");
                setSaveButtonLoading(true);
                // Todo - add a check if nothing is changed
                // Todo - Add column input field validations
                modifyStoreOnSave();
                setSaveButtonLoading(false);
                onClose();
            })
            .catch((error) => {
                console.error("Handling failure logic", error);
            });
    };

    const handleAddColumnClick = () => {
        const updatedColumnConfig = [
            ...newColumnsConfig,
            {
                id: getRandomInt(1, 9999),
                name: "",
                unit: "",
                disabled: false,
                error: false,
            },
        ];
        setNewColumnsConfig(updatedColumnConfig);
    };

    const handleRemoveColumnClick = (id, isNew) => {
        const funcToCall = isNew ? setNewColumnsConfig : setOldColumnsConfig;
        const stateToUse = isNew ? newColumnsConfig : oldColumnsConfig;
        funcToCall(stateToUse.filter((item) => item.id !== id));
    };

    const handleListDoubleClick = (id, isNew) => {
        console.log("Double clicked", id, isNew);
        if (isNew) {
            return;
        } else {
            const indexToUpdate = oldColumnsConfig.findIndex(
                (column) => column.id === id
            );
            if (indexToUpdate !== -1) {
                oldColumnsConfig[indexToUpdate].disabled = false;
                setOldColumnsConfig([...oldColumnsConfig]);
                console.log("After double click", oldColumnsConfig);
            }
        }
    };

    const handleInputValChange = (value, id, isNew) => {
        const funcToCall = isNew ? setNewColumnsConfig : setOldColumnsConfig;
        funcToCall((prevColumns) => {
            return prevColumns.map((column) => {
                if (column.id === id) {
                    return { ...column, name: value, error: false };
                }
                return column;
            });
        });
    };

    const handleUnitChange = (value, id, isNew) => {
        const funcToCall = isNew ? setNewColumnsConfig : setOldColumnsConfig;
        funcToCall((prevColumns) => {
            return prevColumns.map((column) => {
                if (column.id === id) {
                    return { ...column, unit: value };
                }
                return column;
            });
        });
    };

    const columnInputJSX = (column, id, isNew = false) => {
        return (
            <>
                <Input
                    defaultValue={column.name}
                    placeholder="Column"
                    color={column.error ? "danger" : "primary"}
                    disabled={column.disabled}
                    error={column.error}
                    onChange={(e) =>
                        handleInputValChange(e.target.value, column.id, isNew)
                    }
                    endDecorator={
                        <React.Fragment>
                            <Divider orientation="vertical" />
                            <Select
                                disabled={column.disabled}
                                variant="plain"
                                defaultValue={column.unit}
                                onChange={(_, value) =>
                                    handleUnitChange(value, column.id, isNew)
                                }
                                slotProps={{
                                    listbox: {
                                        variant: "outlined",
                                    },
                                }}
                                sx={{
                                    mr: -1.5,
                                    "&:hover": {
                                        bgcolor: "transparent",
                                    },
                                }}
                            >
                                <Option value="">-</Option>
                                <Option value="kg">kg</Option>
                                <Option value="oz">oz</Option>
                                <Option value="in">in</Option>
                                <Option value="cm">cm</Option>
                            </Select>
                        </React.Fragment>
                    }
                    sx={{ width: 200 }}
                />
                <IconButton
                    aria-label="Delete"
                    size="sm"
                    color="danger"
                    disabled={column.disabled}
                    onClick={() => handleRemoveColumnClick(id, isNew)}
                >
                    <DeleteOutline />
                </IconButton>
            </>
        );
    };

    return (
        <React.Fragment>
            {openConfirmationModal && (
                <ColumnsConfirmationModal
                    open={openConfirmationModal}
                    onClose={() => setOpenConfirmationModal(false)}
                    handleSaveConfirmationPromise={
                        handleSaveConfirmationPromise
                    }
                />
            )}
            <Modal
                open={open}
                onClose={(_event, reason) => {
                    if (reason === "closeClick") {
                        onClose();
                    }
                }}
            >
                <ModalDialog variant="outlined">
                    <ModalClose />
                    <DialogTitle>Modify Columns</DialogTitle>
                    <DialogContent>
                        Double click any item to edit values
                    </DialogContent>
                    <List
                        sx={{
                            maxWidth: 400,
                            overflow: "auto",
                            mx: "calc(-1 * var(--ModalDialog-padding))",
                            px: "var(--ModalDialog-padding)",
                        }}
                    >
                        {oldColumnsConfig
                            .filter((column) => column.name !== "Date")
                            .map((column, index) => (
                                <ListItem
                                    key={index}
                                    onDoubleClick={() =>
                                        handleListDoubleClick(column.id, false)
                                    }
                                >
                                    {columnInputJSX(column, column.id, false)}
                                </ListItem>
                            ))}
                        {newColumnsConfig.map((column, index) => (
                            <ListItem key={index}>
                                {columnInputJSX(column, column.id, true)}
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        type="submit"
                        variant="outlined"
                        startDecorator={<Add />}
                        onClick={handleAddColumnClick}
                    >
                        Add Column
                    </Button>
                    <Button
                        type="submit"
                        loading={saveButtonLoading}
                        variant="solid"
                        onClick={handleSaveClick}
                    >
                        Save
                    </Button>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
};

export default ColumnsModal;
