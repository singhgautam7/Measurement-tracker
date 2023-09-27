import { createSlice } from "@reduxjs/toolkit";
import { getFormattedTodayDate } from "../utils/dateUtil";
import { getMeasurementInitialState } from "../utils/stateUtil";

console.log("getMeasurementInitialState() slice", getMeasurementInitialState())

const measurementSlice = createSlice({
    name: "measurementsData",
    initialState: getMeasurementInitialState(),
    reducers: {
        updateDate: (state, action) => {
            // Update the date in the newEntry
            state.newRow.date = action.payload;
        },
        updateMeasurementValue: (state, action) => {
            const { index, value } = action.payload;
            // Update the measurement value at the specified index in newEntry
            state.newRow.entries[index] = Number(value);
        },
        addNewRow: (state, action) => {
            const formattedDate = action.payload;

            // Add the new entry to the entries array
            state.dates.push(formattedDate);
            state.entries.push(state.newRow["entries"]);

            // Reset the new entry
            state.newRow = {
                date: getFormattedTodayDate(),
                entries: Array(state.bodyParts.length).fill(""),
            };
        },
    },
});

export const { updateDate, updateMeasurementValue, addNewRow } =
    measurementSlice.actions;
export const selectDates = (state) => state.measurements.dates;
export const selectBodyParts = (state) => state.measurements.bodyParts;
export const selectEntries = (state) => state.measurements.entries;
export const selectNewRow = (state) => state.measurements.newRow;
export default measurementSlice.reducer;
