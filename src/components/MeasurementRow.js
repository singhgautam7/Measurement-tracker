import "./MeasurementRow.css"

const MeasurementRow = ({ date, dateIndex, bodyParts, entries }) => {
    return (
        <tr key={dateIndex}>
            <td>{date}</td>
            {bodyParts.map((_, bodyPartIndex) => (
                <td key={bodyPartIndex}>
                    {/* Render the measurement for the corresponding date and body part */}
                    {entries[dateIndex][bodyPartIndex]}
                    {/* {entries} */}
                </td>
            ))}
        </tr>
    );
};

export default MeasurementRow;
