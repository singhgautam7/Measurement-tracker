export function getFormattedTodayDate() {
    const today = new Date();
    return formatDate(today)
}

export function formatDateToDisplay(dateString) {
    const date = new Date(dateString);
    return formatDate(date)
}

function formatDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
