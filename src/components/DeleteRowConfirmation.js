import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export default function DeleteRowConfirmation({
    open,
    onClose,
    handleDeleteConfirmationPromise,
}) {
    const handleCancelClicked = () => {
        handleDeleteConfirmationPromise(false);
        onClose();
    };

    const handleConfirmClicked = () => {
        handleDeleteConfirmationPromise(true);
        onClose();
    };
    return (
        <React.Fragment>
            <Modal open={open} onClose={(_event, reason) => onClose()}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Are you sure you want to delete this row?
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="danger"
                            onClick={handleConfirmClicked}
                        >
                            Delete Row
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={handleCancelClicked}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
