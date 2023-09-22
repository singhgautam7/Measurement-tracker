import { getFormattedTodayDate } from "./dateUtil";

export const getMeasurementInitialState = () => {
    let bodyParts = ["Weight", "Chest", "Stomach", "Waist", "Hips"];
    return {
        dates: [],
        bodyParts: bodyParts,
        entries: [],
        newRow: {
            date: getFormattedTodayDate(),
            entries: Array(bodyParts.length).fill(""),
        },
    }
};