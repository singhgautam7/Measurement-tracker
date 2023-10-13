import React from "react";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

export default function GraphModalNoData() {
    return (
        <Card variant="outlined" sx={{ maxWidth: 400 }}>
            {/* <Typography level="h1">National Parks</Typography>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                Yosemite National Park
            </Typography> */}
            <Typography>
                No Data Available to show for the selected colum.
            </Typography>
        </Card>
    );
}
