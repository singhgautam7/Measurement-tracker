import { getFormattedTodayDate } from "./dateUtil";

export const getNewRowEmptyState = (columns) => {
    return columns.reduce((obj, columnName) => {
        obj[columnName] = columnName === "Date" ? getFormattedTodayDate() : "";
        return obj;
      }, {})
}

export const getMeasurementInitialState = () => {
    // let bodyParts = ["Weight", "Chest", "Stomach", "Waist", "Hips"];
    // return {
    //     dates: [],
    //     bodyParts: bodyParts,
    //     entries: [],
    //     newRow: {
    //         date: getFormattedTodayDate(),
    //         entries: Array(bodyParts.length).fill(""),
    //     },
    // }

    const fixedColumns = ["Date"]
    let columns = [...fixedColumns, "Weight", "Chest", "Stomach", "Waist", "Hips"]
    return {
        columns: columns,
        rows: [],
        newRow: getNewRowEmptyState(columns)
    }

};