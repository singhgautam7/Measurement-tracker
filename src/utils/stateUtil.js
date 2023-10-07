export const getMeasurementInitialState = () => {
    const fixedColumns = ["Date"]
    let columns = [...fixedColumns, "Weight", "Chest", "Stomach", "Waist", "Hips"]
    return {
        columns: columns,
        rows: [],
    }

};