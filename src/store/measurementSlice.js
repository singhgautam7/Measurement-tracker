import { createSlice } from "@reduxjs/toolkit";
import { getMeasurementInitialState, getNewRowEmptyState } from "../utils/stateUtil";

console.log("getMeasurementInitialState() slice", getMeasurementInitialState())

const measurementSlice = createSlice({
    name: "measurementsData",
    initialState: getMeasurementInitialState(),
    reducers: {
        updateNewDate: (state, action) => {
            // Update the date in the newEntry
            state.newRow.Date = action.payload;
        },
        updateNewRowInputValue: (state, action) => {
            const { key, value } = action.payload
            state.newRow[key] = Number(value)
        },
        addNewRow: (state, action) => {
            state.rows.push(state.newRow)

            // Reset the new entry
            state.newRow = getNewRowEmptyState(state.columns)
        },
    },
});

export const { updateNewDate, updateNewRowInputValue, addNewRow } = measurementSlice.actions;
export const selectColumns = (state) => state.measurements.columns;
export const selectRows = (state) => state.measurements.rows;
export const selectNewRow = (state) => state.measurements.newRow;
export default measurementSlice.reducer;
