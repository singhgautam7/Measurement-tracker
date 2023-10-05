import { Fragment } from "react";
import MeasurementRow from "./MeasurementRow";
import { useSelector } from "react-redux";
import {
    selectNewRow,
    selectColumns,
    selectRows
} from "../store/measurementSlice";
import NewMeasurement from "./NewMeasurement";
import { formatDateToDisplay } from "../utils/dateUtil";
import { useEffect, useState } from "react";
import "./MeasurementTable.css";

const MeasurementTable = () => {
    const newRow = useSelector(selectNewRow);
    const columns = useSelector(selectColumns);
    const rows = useSelector(selectRows);
    const [dataLoaded, setDataLoaded] = useState(false);
    // const dates = rows.map((entry) => entry.Date);

    useEffect(() => {
        // Check if the necessary data is available
        if (
            newRow !== undefined &&
            columns !== undefined &&
            rows !== undefined
        ) {
            // Data is loaded
            setDataLoaded(true);
        }
    }, [newRow, columns, rows]);

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
                            {columns.map((column, columnIndex) => (
                                <th key={columnIndex}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <MeasurementRow
                                key={rowIndex}
                                row={row}
                                rowIndex={rowIndex}
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
