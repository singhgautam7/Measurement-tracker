import { useSelector, useDispatch } from "react-redux";
import {
    selectNewRow,
    selectColumns,
    selectRows,
    updateNewDate,
    updateNewRowInputValue,
    addNewRow,
} from "../store/measurementSlice";
import toast from "react-hot-toast";

import { convertStrToDateObj, getFormattedTodayDate } from "../utils/dateUtil";
import { DEFAULT_DATE_FORMAT } from "../constants/constants";
import "./NewMeasurement.css";
import { useState } from "react";

const NewMeasurement = ({ dateFormatHandler }) => {
    const dispatch = useDispatch();
    const newRow = useSelector(selectNewRow);
    const columns = useSelector(selectColumns);
    const rows = useSelector(selectRows);
    const [isRowHovered, setIsRowHovered] = useState(false);
    // const firstInputNumRef = useRef(null);
    // const dates = rows.map((entry) => entry.Date);

    const handleRowHover = () => {
        setIsRowHovered(!isRowHovered);
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        const formattedDate = convertStrToDateObj(date);
        dispatch(updateNewDate(formattedDate));
    };

    const handleMeasurementChange = (event, key) => {
        let value = event.target.value;
        if (value < 1) {
            value = 1;
        } else if (value > 999) {
            value = 999;
        }
        dispatch(updateNewRowInputValue({ key, value }));
    };

    const handleAddRow = () => {
        // If all entries are string and are empty
        const isEmpty = Object.keys(newRow)
            .filter((key) => key !== "Date")
            .every(
                (key) =>
                    typeof newRow[key] === "string" && newRow[key].trim() === ""
            );

        // If date already exists in the dates list
        const isDateInData = rows.some((item) => item.Date === newRow.Date);

        if (isEmpty) {
            toast.error("Atleast one value needs to be filled");
            return;
        }

        if (isDateInData) {
            toast.error("Date already exists");
            return;
        }

        dispatch(addNewRow());

        // Add focus to first input element
        // firstInputNumRef.current.focus();
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleAddRow();
        }
    };

    return (
        <tr onMouseEnter={handleRowHover} onMouseLeave={handleRowHover}>
            {columns.map((columnName) => (
                <td key={columnName}>
                    {columnName === "Date" ? (
                        <input
                            type="date"
                            value={newRow.Date}
                            onChange={handleDateChange}
                            placeholder={DEFAULT_DATE_FORMAT}
                            max={getFormattedTodayDate()}
                        />
                    ) : (
                        <input
                            className="new-measurement-number"
                            // ref={index === 0 ? firstInputNumRef : null}
                            // autoFocus={index === 0}
                            type="number"
                            value={newRow[columnName]}
                            min="1"
                            max="999"
                            onChange={(e) =>
                                handleMeasurementChange(e, columnName)
                            }
                            onKeyDown={handleKeyDown}
                        />
                    )}
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

    //     return (
    //         <tr onMouseEnter={handleRowHover} onMouseLeave={handleRowHover}>
    //             <td>
    // <input
    //     type="date"
    //     value={newRow.Date}
    //     onChange={handleDateChange}
    //     placeholder={DEFAULT_DATE_FORMAT}
    //     max={getFormattedTodayDate()}
    // />
    //             </td>
    //             {newRow.entries.map((entry, index) => (
    //                 <td key={index}>
    // <input
    //     className="new-measurement-number"
    //     ref={index === 0 ? firstInputNumRef : null}
    //     autoFocus={index === 0}
    //     type="number"
    //     value={entry}
    //     min="1"
    //     max="999"
    //     onChange={(e) => handleMeasurementChange(e, index)}
    //     onKeyDown={handleKeyDown}
    // />
    //                 </td>
    //             ))}
    // {isRowHovered && (
    //     <td>
    //         <button type="submit" onClick={handleAddRow}>
    //             Add
    //         </button>
    //     </td>
    // )}
    //         </tr>
    //     );
};

export default NewMeasurement;
