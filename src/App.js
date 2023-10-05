// App.js
import React from 'react';
import './App.css';
// import MeasurementTable from './components/MeasurementTable';
import { Toaster } from 'react-hot-toast';
import DataTable from './components/DataTable';

function App() {
  return (
    <div className="App">
      <h2>Body Measurement Tracker</h2>
      <DataTable />
      {/* <MeasurementTable /> */}
      <Toaster position="top-right"/>
    </div>
  );
}

export default App;
