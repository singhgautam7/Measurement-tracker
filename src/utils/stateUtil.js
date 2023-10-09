export const getMeasurementInitialState = () => {
    const fixedColumns = [{ name: "Date", unit: "" }];
    const columns = [
        ...fixedColumns,
        { name: "Weight", unit: "kg" },
        { name: "Chest", unit: "in" },
        { name: "Stomach", unit: "in" },
        { name: "Waist", unit: "in" },
        { name: "Hips", unit: "in" },

    ];
    return {
        columns: columns,
        rows: [],
    };
};
