import { getRandomInt } from "./generalUtil";

export const getMeasurementInitialState = () => {
    const fixedColumns = [{ id: getRandomInt(1, 9999), name: "Date", unit: "" }];
    const columns = [
        ...fixedColumns,
        { id: getRandomInt(1, 9999), name: "Weight", unit: "kg" },
        { id: getRandomInt(1, 9999), name: "Chest", unit: "in" },
        { id: getRandomInt(1, 9999), name: "Stomach", unit: "in" },
        { id: getRandomInt(1, 9999), name: "Waist", unit: "in" },
        { id: getRandomInt(1, 9999), name: "Hips", unit: "in" },
    ];
    return {
        columns: columns,
        rows: [],
    };
};
