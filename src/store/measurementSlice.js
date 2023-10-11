import { createSlice } from "@reduxjs/toolkit";
import { getMeasurementInitialState } from "../utils/stateUtil";
import { convertDateObjToStr } from "../utils/dateUtil";

console.log("getMeasurementInitialState() slice", getMeasurementInitialState());

const measurementSlice = createSlice({
    name: "measurementsData",
    initialState: getMeasurementInitialState(),
    reducers: {
        addRow: (state, action) => {
            const rowToAdd = action.payload;

            if (!(typeof rowToAdd.Date === "string")) {
                rowToAdd.Date = convertDateObjToStr(rowToAdd.Date);
            }
            state.rows.push(rowToAdd);
        },
        removeRow: (state, action) => {
            const idToRemove = action.payload;
            const updatedRows = state.rows.filter(
                (row) => row.id !== idToRemove
            );
            return {
                ...state,
                rows: updatedRows,
            };
        },
        editRow: (state, action) => {
            const updatedRow = action.payload;
            const index = state.rows.findIndex(
                (row) => row.id === updatedRow.id
            );

            if (!(typeof updatedRow.Date === "string")) {
                updatedRow.Date = convertDateObjToStr(updatedRow.Date);
            }

            if (index !== -1) {
                state.rows[index] = {
                    ...updatedRow,
                };
            }
        },
        modifyColumns: (state, action) => {
            const modifiedColumns = action.payload;
            return {
                ...state,
                columns: modifiedColumns,
            };
        },
        modifyRows: (state, action) => {
            const modifiedRows = action.payload;
            return {
                ...state,
                rows: modifiedRows,
            };
        },
    },
});

export const { addRow, removeRow, editRow, modifyColumns, modifyRows } = measurementSlice.actions;
export const selectColumns = (state) => state.measurements.columns;
export const selectRows = (state) => state.measurements.rows;
export default measurementSlice.reducer;
