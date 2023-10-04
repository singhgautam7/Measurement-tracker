import { Fragment } from "react";
import MeasurementRow from "./MeasurementRow";
import { useSelector } from "react-redux";
import {
    selectNewRow,
    selectDates,
    selectBodyParts,
    selectEntries
} from "../store/measurementSlice";
import NewMeasurement from "./NewMeasurement";
import { formatDateToDisplay } from "../utils/dateUtil";
import { useEffect, useState } from "react";
import "./MeasurementTable.css";

const MeasurementTable = () => {
    const newRow = useSelector(selectNewRow);
    const dates = useSelector(selectDates);
    const bodyParts = useSelector(selectBodyParts);
    const entries = useSelector(selectEntries);

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        // Check if the necessary data is available
        if (
            newRow !== undefined &&
            dates !== undefined &&
            bodyParts !== undefined &&
            entries !== undefined
        ) {
            // Data is loaded
            setDataLoaded(true);
        }
    }, [newRow, dates, bodyParts, entries]);

    if (!dataLoaded) {
        // Render loading indicator
        // TODO: Add a loading indicator;
        return <></>;
    }

    return (
        <Fragment>
            <div className="measurement-table-container">
                <table className="measurement-table">
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
                    </tbody>
                    <tfoot>
                        <NewMeasurement
                            dateFormatHandler={formatDateToDisplay}
                        />
                    </tfoot>
                </table>
            </div>
            {/* <button
                className="add-new-measurement-button"
                type="submit"
                onClick={handleAddRow}
            >
                Add
            </button> */}
        </Fragment>
    );
};

export default MeasurementTable;
