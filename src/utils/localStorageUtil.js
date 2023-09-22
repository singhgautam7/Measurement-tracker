export const saveStorageToLocalStorage = (key, state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(key, serializedState);
    } catch (error) {
        console.log("Error while saving in local storage", error);
    }
};

export const loadStateFromLocalStorage = (key) => {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.log("Error while loading in local storage", error);
        return undefined;
    }
};
