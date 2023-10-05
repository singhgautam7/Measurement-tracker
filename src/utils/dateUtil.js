export function convertStrToDateObj(dateStr) {
    const date = new Date(dateStr);
    return date
}

export function getFormattedTodayDate() {
    const today = new Date();
    return convertDateObjToStr(today)
}

export function convertDateObjToStr(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
