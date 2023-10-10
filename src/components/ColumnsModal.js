import React, { useState } from "react";
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

const ColumnsModal = ({ columnsConfig, open, onClose, onDeleteColumn }) => {
    const tempColumnsConfig = columnsConfig.map((column) => ({
        ...column,
        disabled: true,
    }));
    const [oldColumnsConfig, setOldColumnsConfig] = useState(tempColumnsConfig);
    const [newColumnsConfig, setNewColumnsConfig] = useState([]);

    const handleAddColumnClick = () => {
        const updatedColumnConfig = [
            ...newColumnsConfig,
            {
                id: getRandomInt(1, 9999),
                name: "",
                unit: "",
                disabled: false,
            },
        ];
        setNewColumnsConfig(updatedColumnConfig);
    };

    const handleRemoveColumnClick = (id, isNew) => {
        if (isNew) {
            setNewColumnsConfig(
                newColumnsConfig.filter((item) => item.id !== id)
            );
        } else {
            setOldColumnsConfig(
                oldColumnsConfig.filter((item) => item.id !== id)
            );
        }
    };

    const handleListDoubleClick = (id, isNew) => {
        console.log("Double clicked", id, isNew)
        if (isNew) {
            return
        } else {
            const indexToUpdate = oldColumnsConfig.findIndex(
                (column) => column.id === id
            );
            if (indexToUpdate !== -1) {
                oldColumnsConfig[indexToUpdate].disabled = false;
                setOldColumnsConfig([...oldColumnsConfig]);
                console.log("After double click", oldColumnsConfig)
            }
        }
    };

    const columnInputJSX = (column, id, isNew = false) => {
        return (
            <>
                <Input
                    defaultValue={column.name}
                    placeholder="Column"
                    color="primary"
                    disabled={column.disabled}
                    endDecorator={
                        <React.Fragment>
                            <Divider orientation="vertical" />
                            <Select
                                disabled={column.disabled}
                                variant="plain"
                                defaultValue={column.unit}
                                // onChange={(_, value) =>
                                //     setCurrency(value)
                                // }
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
                    {oldColumnsConfig.map((column, index) => (
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
                        <ListItem
                            key={index}
                            onDoubleClick={() =>
                                handleListDoubleClick(column.id, false)
                            }
                        >
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
                <Button type="submit" variant="soft">
                    Save
                </Button>
            </ModalDialog>
        </Modal>
    );
};

export default ColumnsModal;
