import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
// import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export default function ColumnsConfirmationModal({
    open,
    onClose,
    handleSaveConfirmationPromise,
}) {
    const handleCancelClicked = () => {
        handleSaveConfirmationPromise(false);
        onClose();
    };

    const handleSaveClicked = () => {
        handleSaveConfirmationPromise(true);
        onClose();
    };

    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={(_event, reason) => {
                    if (reason === "closeClick") {
                        handleCancelClicked();
                    }
                }}
            >
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Are you sure you want to update the columns?
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={handleSaveClicked}
                        >
                            Save Changes
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
