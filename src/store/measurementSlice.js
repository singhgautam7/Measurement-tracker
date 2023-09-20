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
            [33, 44, 22, 55, 55, 66, 55, 66]
        ],
    },
    reducers: {
        updateMeasurement: (state, action) => {
            // Implement logic to update measurements based on the action
            // For example, update the measurements array with the new data
            // You can access the payload like action.payload
        },
    },
});

export const { updateMeasurement } = measurementSlice.actions;
export const selectDates = (state) => state.measurements.dates;
export const selectBodyParts = (state) => state.measurements.bodyParts;
export const selectEntries = (state) => state.measurements.entries;
export default measurementSlice.reducer;
