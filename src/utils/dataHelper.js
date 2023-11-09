import { convertDateObjToStr } from "./dateUtil";
import { getRandomInt, getRandomString } from "./generalUtil";

function isValidDate(dateString) {
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
}

function isNumeric(value) {
    const numericRegex = /^[+-]?\d+(\.\d+)?$/;
    return numericRegex.test(value);
}

let findDuplicates = (arr) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

/**
 * This will convert the data obtained from file buffer and convert it into
 * the data desired in our rows and columns of data table
 * @param  {Object} rawData 2D Array obtained from file buffer
 */
export function getConvertedRowAndColumnData(rawData) {
    const headers = rawData[0];
    const convertedColumns = headers.map((name) => ({
        id: getRandomInt(1, 9999),
        name,
        unit: "",
    }));

    const dataWithoutHeader = rawData.slice(1);
    const convertedRows = dataWithoutHeader.map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
            if (header === "Date") {
                const dateObj = new Date(row[index]);
                // Invalid date object
                if (isNaN(dateObj.getTime())) {
                    throw new Error("Invalid date");
                }
                obj[header] = convertDateObjToStr(dateObj);
            } else {
                obj[header] = row[index];
            }
        });
        obj["id"] = getRandomString();
        return obj;
    });
    return [convertedRows, convertedColumns];
}

/**
 * Run the validations for header before importing data in data grid
 * @param  {Array} headers transformed row data
 */
function validateHeader(headers) {
    const duplicates = findDuplicates(headers);

    if (!headers.includes("Date")) {
        throw new Error(`"Date" is not present in data`);
    } else if (duplicates.length > 0) {
        throw new Error(`Columns with same names are not allowed`);
    }
}

/**
 * Run the validations for data grid before importing
 * @param  {Object} data transformed row data
 */
function validateRows(data) {
    for (let i = 0; i < data.length; i++) {
        const obj = data[i];

        // Check if the Value of date is valid
        if (!isValidDate(obj["Date"])) {
            throw new Error(`Invalid date in the data at index ${i}`);
        }

        for (const key in obj) {
            if (key !== "Date" && key !== "id") {
                if (obj[key] !== "" && !isNumeric(obj[key])) {
                    throw new Error(
                        `Invalid non-numeric value "${obj[key]}" in the data at index ${i} for key "${key}"`
                    );
                }
            }
        }
    }
}

export function runAllValidations(headers, convertedRows) {
    validateHeader(headers);
    validateRows(convertedRows);
}
