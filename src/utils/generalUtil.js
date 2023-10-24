import { getFormattedTodayDate } from "./dateUtil";

export const getEmptyNewRowModal = (
    columns,
    flagConvertDateToString = false
) => {
    return columns.reduce((obj, columnName) => {
        obj[columnName] =
            columnName === "Date"
                ? getFormattedTodayDate(flagConvertDateToString)
                : "";
        return obj;
    }, {});
};

export function getRandomString() {
    return Math.random().toString(36).substring(2, 11);
}

export function getRandomInt(min = 1000, max = 9999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
