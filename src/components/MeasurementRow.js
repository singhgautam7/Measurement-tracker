import { useState } from "react";
import "./MeasurementRow.css";

const MeasurementRow = ({ date, dateIndex, bodyParts, entries }) => {
    const [isRowHovered, setIsRowHovered] = useState(false);

    // Function to handle row hover
    const handleRowHover = () => {
        setIsRowHovered(!isRowHovered);
    };

    return (
        <>
        <tr
            key={dateIndex}
            onMouseEnter={handleRowHover}
            onMouseLeave={handleRowHover}
        >
            <td>{date}</td>
            {bodyParts.map((_, bodyPartIndex) => (
                <td key={bodyPartIndex}>{entries[dateIndex][bodyPartIndex]}</td>
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
