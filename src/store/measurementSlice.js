import { createSlice } from "@reduxjs/toolkit";

const measurementSlice = createSlice({
    name: "measurementsData",
    initialState: {
        dates: ["2023-09-01", "2023-09-02", "2023-09-03"],
        bodyParts: [
            "Chest",
            "Left Bicep",
            "Right Bicep",
            "Stomach",
            "Waist",
            "Hips",
            "Left Thigh",
            "Right Thigh",
        ],
        entries: [
            [33, 44, 22, 55, 55, 66, 55, 66],
            [33, 44, 22, 55, 55, 66, 55, 66],
            [33, 44, 22, 55, 55, 66, 55, 66],
        ],
        newRow: {
            date: "",
            entries: ["", "", "", "", "", "", "", ""], // Initialize with zeros or empty values
        },
    },
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
        addNewRow: (state) => {
            // Add the new entry to the entries array
            state.dates.push(state.newRow["date"]);
            state.entries.push(state.newRow["entries"]);

            // Reset the new entry
            state.newRow = {
                date: "",
                entries: Array(state.bodyParts.length).fill(""),
            };
        },
    },
});

export const { updateDate, updateMeasurementValue, addNewRow } = measurementSlice.actions;
export const selectDates = (state) => state.measurements.dates;
export const selectBodyParts = (state) => state.measurements.bodyParts;
export const selectEntries = (state) => state.measurements.entries;
export const selectNewRow = (state) => state.measurements.newRow;
export default measurementSlice.reducer;
