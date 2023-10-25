import React from "react";
import "./Header.css";
import Typography from "@mui/joy/Typography";

export default function Header() {
    return (
        <React.Fragment>
            <Typography level="h3" className="header-text">Body Measurement Tracker</Typography>
        </React.Fragment>
    );
}
