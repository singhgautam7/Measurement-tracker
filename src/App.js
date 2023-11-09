import React from "react";
import "./App.css";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import Button from "@mui/joy/Button";
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
                            background: "white",
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
            >
                {(t) => (
                    <ToastBar toast={t}>
                        {({ icon, message }) => (
                            <>
                                {icon}
                                {message}
                                {t.type !== "loading" && (
                                    <button onClick={() => toast.dismiss(t.id)} style={{cursor: "pointer"}}>
                                        x
                                    </button>
                                )}
                            </>
                        )}
                    </ToastBar>
                )}
            </Toaster>
        </div>
    );
}

export default App;
