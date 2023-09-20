import MeasurementRow from "./MeasurementRow";
import { useDispatch, useSelector } from "react-redux";
import {
    selectDates,
    selectBodyParts,
    selectEntries,
    addNewRow,
} from "../store/measurementSlice";
import NewMeasurement from "./NewMeasurement";

const MeasurementTable = () => {
    const dispatch = useDispatch();
    const dates = useSelector(selectDates);
    const bodyParts = useSelector(selectBodyParts);
    const entries = useSelector(selectEntries);

    const handleAddRow = () => {
        // Dispatch the action to add the new row
        dispatch(addNewRow());
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
                    <NewMeasurement />
                </tbody>
            </table>
            <button onClick={handleAddRow}>Add</button>
        </div>
    );
};

export default MeasurementTable;
