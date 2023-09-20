// App.js
import React from 'react';
import './App.css';
import MeasurementTable from './components/MeasurementTable';

function App() {
  // const dates = ['2023-09-01', '2023-09-02', '2023-09-03']; // Replace with actual data
  // const bodyParts = ['Chest', 'Left Bicep', 'Right Bicep', 'Stomach', 'Waist', 'Hips', 'Left Thigh', 'Right Thigh']; // Customize as needed
  // const measurements = [
  //   [38, 14, 14, 32, 35, 40, 24, 24],
  //   [/* Measurements for date 2 */],
  //   [/* Measurements for date 3 */]
  // ]; // Replace with actual data

  return (
    <div className="App">
      <h2>Body Measurement Tracker</h2>
      <MeasurementTable />
    </div>
  );
}

export default App;
