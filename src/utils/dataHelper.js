import { getRandomInt, getRandomString } from "./generalUtil";

function isValidDate(dateString) {
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
}

function isNumeric(value) {
    const numericRegex = /^[+-]?\d+(\.\d+)?$/;
    return numericRegex.test(value);
}

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)


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
            obj[header] = row[index];
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
    const duplicates = findDuplicates(headers)

    // Check if Date property is present
    if (!headers.includes("Date")) {
        return {
            isValid: false,
            errorMessage: `"Date" is not present in data`,
        };

        // Check for duplicate columns
    } else if (duplicates.length > 0) {
        return {
            isValid: false,
            errorMessage: `Columns with same names are not allowed`,
        };
    }

    return {
        isValid: true,
        errorMessage: null,
    };
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
            return {
                isValid: false,
                errorMessage: `Invalid date in the data at index ${i}`,
            };
        }

        for (const key in obj) {
            if (key !== "Date") {
                if (!isNumeric(obj[key])) {
                    return {
                        isValid: false,
                        errorMessage: `Invalid non-numeric value in the data at index ${i} for key "${key}"`,
                    };
                }
            }
        }
    }
    return {
        isValid: true,
        errorMessage: null,
    };
}

export function runAllValidations(headers, convertedRows) {
    let {isValid, errorMessage} = validateHeader(headers);
    if (!isValid) {
        return {
            isValid: isValid,
            errorMessage: errorMessage,
        };
    }
    let {isValid1, errorMessage1} = validateRows(convertedRows);
    return {
        isValid: isValid1,
        errorMessage: errorMessage1,
    };
}
