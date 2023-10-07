import { createSlice } from "@reduxjs/toolkit";
import { getMeasurementInitialState } from "../utils/stateUtil";
import { convertDateObjToStr } from "../utils/dateUtil";

console.log("getMeasurementInitialState() slice", getMeasurementInitialState());

const measurementSlice = createSlice({
    name: "measurementsData",
    initialState: getMeasurementInitialState(),
    reducers: {
        addNewRowFromData: (state, action) => {
            const rowToAdd = action.payload;

            if (!(typeof rowToAdd.Date === "string")) {
                rowToAdd.Date = convertDateObjToStr(rowToAdd.Date);
            }
            state.rows.push(rowToAdd);
        },
        removeRow: (state, action) => {
            const idToRemove = action.payload;
            console.log("removeRow, idToRemove", action.payload);
            const updatedRows = state.rows.filter(
                (row) => row.id !== idToRemove
            );
            return {
                ...state,
                rows: updatedRows,
            };
        },
    },
});

export const { addNewRowFromData, removeRow } = measurementSlice.actions;
export const selectColumns = (state) => state.measurements.columns;
export const selectRows = (state) => state.measurements.rows;
export default measurementSlice.reducer;
