import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import DataTable from "./components/DataTable";
import Header from "./components/Header";

function App() {
    return (
        <div className="App">
            <Header></Header>
            <DataTable />
            {/* <MeasurementTable /> */}
            <Toaster
                position="top-center"
                toastOptions={{
                    success: {
                        style: {
                          border: "1px solid #713200",
                          padding: "16px",
                          background: "white"
                        },
                    },
                    error: {
                        style: {
                            border: "1px solid #713200",
                            padding: "16px",
                            background: "white",
                        },
                    },
                }}
            />
        </div>
    );
}

export default App;
