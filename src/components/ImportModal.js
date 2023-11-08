import React, { useRef, useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import { styled } from "@mui/joy";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { getConvertedRowAndColumnData, runAllValidations } from "../utils/dataHelper";

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
    const [selectedFileName, setSelectedFileName] = useState("");
    const [fileSelectStatus, setFileSelectStatus] = useState("neutral");
    const fileInputRef = useRef(null);

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
        toast("Coming Soon!", {
            icon: "👏",
        });
        const file = fileInputRef.current.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;

            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
            });
            const [convertedRows, convertedColumns] = getConvertedRowAndColumnData(jsonData);
            const {isValid, errorMessage} = runAllValidations(jsonData[0], convertedRows)
            if (isValid) {
                toast.error(errorMessage)
                return
            }

            console.log("jsonData", jsonData);
            console.log("columns", convertedColumns);
            console.log("rows", convertedRows);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <React.Fragment>
            <Modal open={open} onClose={onClose}>
                <ModalDialog variant="outlined">
                    <ModalClose />
                    <DialogTitle>Import Data</DialogTitle>
                    <DialogContent>
                        Note: All the existing data will be lost after
                        successful import.
                    </DialogContent>
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
