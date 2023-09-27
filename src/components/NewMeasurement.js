import { useSelector, useDispatch } from "react-redux";
import {
    selectNewRow,
    updateDate,
    updateMeasurementValue,
} from "../store/measurementSlice";
import { getFormattedTodayDate } from "../utils/dateUtil";
import { DEFAULT_DATE_FORMAT } from "../constants/constants";
import "./NewMeasurement.css";

const NewMeasurement = ({ dateFormatHandler }) => {
    const dispatch = useDispatch();
    const newRow = useSelector(selectNewRow);

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

    return (
        <tr>
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
                        type="number"
                        value={entry}
                        onChange={(e) => handleMeasurementChange(e, index)}
                        min="1"
                        max="999"
                    />
                </td>
            ))}
        </tr>
    );
};

export default NewMeasurement;
