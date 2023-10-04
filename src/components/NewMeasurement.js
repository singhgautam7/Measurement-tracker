import { useSelector, useDispatch } from "react-redux";
import {
    selectNewRow,
    selectDates,
    updateDate,
    updateMeasurementValue,
    addNewRow,
} from "../store/measurementSlice";
import toast from "react-hot-toast";

import { formatDateToDisplay, getFormattedTodayDate } from "../utils/dateUtil";
import { DEFAULT_DATE_FORMAT } from "../constants/constants";
import "./NewMeasurement.css";
import { useRef, useState } from "react";

const NewMeasurement = ({ dateFormatHandler }) => {
    const dispatch = useDispatch();
    const newRow = useSelector(selectNewRow);
    const dates = useSelector(selectDates);
    const [isRowHovered, setIsRowHovered] = useState(false);
    const firstInputNumRef = useRef(null);

    const handleRowHover = () => {
        setIsRowHovered(!isRowHovered);
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        dispatch(updateDate(date)); // Dispatch the updateDate action
    };

    const handleMeasurementChange = (event, index) => {
        let value = event.target.value;
        if (value < 1) {
            value = 1;
        } else if (value > 999) {
            value = 999;
        }
        dispatch(updateMeasurementValue({ index, value })); // Dispatch the updateMeasurementValue action
    };

    const handleAddRow = () => {
        // If all entries are string and are empty
        if (
            newRow.entries.every(
                (entry) => typeof entry === "string" && entry.trim() === ""
            )
        ) {
            toast.error("Atleast one value needs to be filled");
            return;
        }

        // If date already exists in the dates list
        if (dates.some((date) => date === newRow.date)) {
            toast.error("Date already exists");
            return;
        }

        const formattedDate = formatDateToDisplay(newRow.date);
        dispatch(addNewRow(formattedDate));

        // Add focus to first input element
        firstInputNumRef.current.focus();
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleAddRow();
        }
    };

    return (
        <tr onMouseEnter={handleRowHover} onMouseLeave={handleRowHover}>
            <td>
                <input
                    type="date"
                    value={newRow.date}
                    onChange={handleDateChange}
                    placeholder={DEFAULT_DATE_FORMAT}
                    max={getFormattedTodayDate()}
                />
            </td>
            {newRow.entries.map((entry, index) => (
                <td key={index}>
                    <input
                        className="new-measurement-number"
                        ref={index === 0 ? firstInputNumRef : null}
                        autoFocus={index === 0}
                        type="number"
                        value={entry}
                        min="1"
                        max="999"
                        onChange={(e) => handleMeasurementChange(e, index)}
                        onKeyDown={handleKeyDown}
                    />
                </td>
            ))}
            {isRowHovered && (
                <td>
                    <button type="submit" onClick={handleAddRow}>
                        Add
                    </button>
                </td>
            )}
        </tr>
    );
};

export default NewMeasurement;
