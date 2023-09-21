import { useSelector, useDispatch } from "react-redux";
import {
    selectNewRow,
    updateDate,
    updateMeasurementValue,
} from "../store/measurementSlice";
import { getFormattedTodayDate } from "../utils/dateUtil";
import { DEFAULT_DATE_FORMAT } from "../constants/constants";

const NewMeasurement = ({ dateFormatHandler }) => {
    const dispatch = useDispatch();
    const newRow = useSelector(selectNewRow);

    const handleDateChange = (event) => {
        const date = event.target.value;
        dispatch(updateDate(date)); // Dispatch the updateDate action
    };

    const handleMeasurementChange = (event, index) => {
        const value = event.target.value;
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
                        type="number"
                        value={entry}
                        onChange={(e) => handleMeasurementChange(e, index)}
                    />
                </td>
            ))}
        </tr>
    );
};

export default NewMeasurement;
