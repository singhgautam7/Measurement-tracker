import React, { useRef, useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/joy";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import {
    getConvertedRowAndColumnData,
    runAllValidations,
} from "../utils/dataHelper";
import ImportConfirmationModal from "./ImportConfirmationModal";
import { useDispatch } from "react-redux";
import { modifyColumns, modifyRows } from "../store/measurementSlice";

const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`;

export default function ImportModal({ open, onClose }) {
    const dispatch = useDispatch();
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [confirmationPromise, setConfirmationPromise] = useState(null);
    const [saveButtonLoading, setSaveButtonLoading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [fileSelectStatus, setFileSelectStatus] = useState("neutral");
    const fileInputRef = useRef(null);

    const modifyStoreOnSave = (convertedColumns, convertedRows) => {
        setSaveButtonLoading(true);
        // Todo - add a check if nothing is changed
        // Todo - Add column input field validations
        dispatch(modifyColumns(convertedColumns));
        dispatch(modifyRows(convertedRows));
        setSaveButtonLoading(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileName = file.name;
        const fileExtension = fileName.split(".").pop();
        setSelectedFileName(fileName);
        if (fileExtension === "xlsx") {
            setFileSelectStatus("success");
        } else {
            setFileSelectStatus("danger");
            toast.error((t) => (
                <span>
                    Only files with <b>.xlsx</b> extensions are allowed
                </span>
            ));
        }
    };

    const handleImportClick = () => {
        const file = fileInputRef.current.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
                raw: false,
            });
            try {
                const [convertedRows, convertedColumns] =
                    getConvertedRowAndColumnData(jsonData);
                runAllValidations(jsonData[0], convertedRows);

                console.log("jsonData", jsonData);
                console.log("columns", convertedColumns);
                console.log("rows", convertedRows);

                setOpenConfirmationModal(true);
                const savePromise = new Promise((resolve, reject) => {
                    setConfirmationPromise({ resolve, reject });
                });

                savePromise
                    .then(() => {
                        console.log("Handling success logic");
                        modifyStoreOnSave(convertedColumns, convertedRows);
                        onClose();
                    })
                    .catch((error) => {
                        console.error("Handling failure logic", error);
                    });
            } catch (error) {
                toast.error(error.message);
                return;
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleImportConfirmationPromise = (confirm) => {
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

    return (
        <React.Fragment>
            {openConfirmationModal && (
                <ImportConfirmationModal
                    open={openConfirmationModal}
                    onClose={() => setOpenConfirmationModal(false)}
                    handleImportConfirmationPromise={
                        handleImportConfirmationPromise
                    }
                />
            )}
            <Modal open={open} onClose={onClose}>
                <ModalDialog variant="outlined">
                    <ModalClose />
                    <DialogTitle>Import Data</DialogTitle>
                    <DialogContent>
                        <Typography level="body-md">
                            1. All the existing data will be lost after a
                            successful import.
                        </Typography>
                        <Typography level="body-md">
                            2. Examples of accepted dates are -{" "}
                            <Typography
                                level="body-md"
                                color="success"
                                variant="outlined"
                                fontFamily="monospace"
                                sx={{ opacity: "80%" }}
                            >
                                Nov 9, 2023
                            </Typography>
                            ,{" "}
                            <Typography
                                level="body-md"
                                color="success"
                                variant="outlined"
                                fontFamily="monospace"
                                sx={{ opacity: "80%" }}
                            >
                                2023-11-09
                            </Typography>
                            ,{" "}
                            <Typography
                                level="body-md"
                                color="success"
                                variant="outlined"
                                fontFamily="monospace"
                                sx={{ opacity: "80%" }}
                            >
                                2023/11/09
                            </Typography>.
                        </Typography>
                        <Typography level="body-md">
                            3. Apart from dates, all the other values should be numeric.
                        </Typography>
                    </DialogContent>
                    <List
                        sx={{
                            maxWidth: 400,
                            overflow: "auto",
                            mx: "calc(-1 * var(--ModalDialog-padding))",
                            px: "var(--ModalDialog-padding)",
                        }}
                    >
                        {/* <List>
                            <ListItem>The Shawshank Redemption</ListItem>
                            <ListItem nested>
                                <ListItem>Star Wars</ListItem>
                                <List marker="circle">
                                    <ListItem>
                                        Episode I – The Phantom Menace
                                    </ListItem>
                                    <ListItem>
                                        Episode II – Attack of the Clones
                                    </ListItem>
                                    <ListItem>
                                        Episode III – Revenge of the Sith
                                    </ListItem>
                                </List>
                            </ListItem>
                            <ListItem>
                                The Lord of the Rings: The Two Towers
                            </ListItem>
                        </List> */}
                    </List>

                    <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                        color={fileSelectStatus}
                        startDecorator={
                            <SvgIcon>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                    />
                                </svg>
                            </SvgIcon>
                        }
                    >
                        {selectedFileName !== ""
                            ? selectedFileName
                            : "Upload a file"}
                        <VisuallyHiddenInput
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={saveButtonLoading}
                        disabled={fileSelectStatus !== "success" ? true : false}
                        onClick={handleImportClick}
                    >
                        Import
                    </Button>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
