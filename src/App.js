// App.js
import React from 'react';
import './App.css';
import MeasurementTable from './components/MeasurementTable';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <h2>Body Measurement Tracker</h2>
      <MeasurementTable />
      <Toaster position="top-right"/>
    </div>
  );
}

export default App;
