import MeasurementRow from "./MeasurementRow";
import { useDispatch, useSelector } from "react-redux";
import {
    selectNewRow,
    selectDates,
    selectBodyParts,
    selectEntries,
    addNewRow,
} from "../store/measurementSlice";
import NewMeasurement from "./NewMeasurement";
import { formatDateToDisplay } from "../utils/dateUtil";
import toast from "react-hot-toast";

const MeasurementTable = () => {
    const dispatch = useDispatch();
    const newRow = useSelector(selectNewRow);
    const dates = useSelector(selectDates);
    const bodyParts = useSelector(selectBodyParts);
    const entries = useSelector(selectEntries);

    const handleAddRow = () => {
        // If all entries are string and are empty
        if (newRow.entries.every((entry) => typeof entry === "string" && entry.trim() === "")) {
            toast.error("Atleast one value needs to be filled")
            return
        }

        // If date already exists in the dates list
        if (dates.some((date) => date === newRow.date)) {
            toast.error("Date already exists")
            return
        }

        const formattedDate = formatDateToDisplay(newRow.date);
        dispatch(addNewRow(formattedDate));
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        {bodyParts.map((bodyPart, index) => (
                            <th key={index}>{bodyPart}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dates.map((date, dateIndex) => (
                        <MeasurementRow
                            key={dateIndex}
                            date={date}
                            dateIndex={dateIndex}
                            bodyParts={bodyParts}
                            entries={entries}
                        />
                    ))}
                    <NewMeasurement dateFormatHandler={formatDateToDisplay} />
                </tbody>
            </table>
            <button onClick={handleAddRow}>Add</button>
        </div>
    );
};

export default MeasurementTable;
