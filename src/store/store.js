// store.js
import { configureStore } from '@reduxjs/toolkit';
import measurementReducer from './measurementSlice';
import { loadStateFromLocalStorage, saveStorageToLocalStorage,} from "../utils/localStorageUtil";
import { MEASUREMENTS_LOCAL_STORAGE_KEY } from "../constants/constants";
import { getMeasurementInitialState } from '../utils/stateUtil';

const savedState = loadStateFromLocalStorage(MEASUREMENTS_LOCAL_STORAGE_KEY);
console.log("savedState", savedState)
console.log("getMeasurementInitialState() store", getMeasurementInitialState())

const store = configureStore({
  reducer: {
    measurements: measurementReducer,
  },
  preloadedState: savedState || getMeasurementInitialState(),
});

store.subscribe(() => {
  const state = store.getState();
  saveStorageToLocalStorage(MEASUREMENTS_LOCAL_STORAGE_KEY, state);
});

export default store;
