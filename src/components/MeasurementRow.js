import { useState } from "react";
import "./MeasurementRow.css";

const MeasurementRow = ({ row, rowIndex }) => {
    const [isRowHovered, setIsRowHovered] = useState(false);
    // Function to handle row hover
    const handleRowHover = () => {
        setIsRowHovered(!isRowHovered);
    };

    return (
        <>
            <tr
                key={rowIndex}
                onMouseEnter={handleRowHover}
                onMouseLeave={handleRowHover}
            >
                {Object.entries(row).map(([key, value]) => (
                    <td key={key}>{value}</td>
                ))}
                {isRowHovered && (
                <td>
                    <button>Edit</button>
                    <button>Delete</button>
                </td>
            )}
            </tr>
        </>
    );
};

export default MeasurementRow;
