import React from "react";
import Button from "@mui/material/Button";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import IconButton from "@mui/joy/IconButton";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

const ColumnsModal = ({ columnsConfig, open, onClose, onDeleteColumn }) => {
    return (
        <Modal open={open} onClose={() => onClose()}>
            <ModalDialog variant="outlined">
                <ModalClose />
                <DialogTitle>Modify Columns</DialogTitle>
                <DialogContent>
                </DialogContent>
                <List sx={{ maxWidth: 300 }}>
                    {/* <ListItem
                        startAction={
                            <IconButton
                                aria-label="Add"
                                size="sm"
                                variant="plain"
                                color="neutral"
                            >
                                <Add />
                            </IconButton>
                        }
                    >
                        <ListItemButton>Item 1</ListItemButton>
                    </ListItem> */}
                    {columnsConfig.map((column, index) => (
                        <ListItem
                            key={index}
                            endAction={
                                <IconButton
                                    aria-label="Delete"
                                    size="sm"
                                    color="danger"
                                >
                                    <Delete />
                                </IconButton>
                            }
                        >
                            <ListItemButton>{column.name}</ListItemButton>
                        </ListItem>
                    ))}
                </List>
                {/* <Table
                    borderAxis="none"
                    color="neutral"
                    stickyFooter={false}
                    stickyHeader={false}
                    variant="plain"
                >
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }}>Columns</th>
                            <th style={{ width: "10%" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map((column, index) => (
                            <tr key={index}>
                                <td>{column}</td>
                                <td>Delete</td>
                            </tr>
                        ))}
                    </tbody>
                </Table> */}
                <Button type="submit">Save</Button>
            </ModalDialog>
        </Modal>
    );
};

export default ColumnsModal;
