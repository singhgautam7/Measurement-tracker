export function convertStrToDateObj(dateStr) {
    const date = new Date(dateStr);
    return date
}

export function getFormattedTodayDate(flagConvertToString = false) {
    const today = new Date();
    return flagConvertToString ? convertDateObjToStr(today) : today
}

// export function convertDateObjToStr(dateObj) {
//     const year = dateObj.getFullYear();
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//     const day = String(dateObj.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// }

export function convertDateObjToStr(dateObj) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString(undefined, options);
    return formattedDate.replace(/(\d+)(st|nd|rd|th)/, (_, num, suffix) => {
        const n = parseInt(num);
        if (n >= 11 && n <= 13) {
            return `${num}th`;
        }
        switch (n % 10) {
            case 1: return `${num}st`;
            case 2: return `${num}nd`;
            case 3: return `${num}rd`;
            default: return `${num}th`;
        }
    });
}