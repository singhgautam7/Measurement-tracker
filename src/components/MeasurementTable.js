import MeasurementRow from "./MeasurementRow";
import { useSelector } from "react-redux";
import { selectDates, selectBodyParts, selectEntries } from '../store/measurementSlice';

const MeasurementTable = () => {
  const dates = useSelector(selectDates)
  const bodyParts = useSelector(selectBodyParts)
  const entries = useSelector(selectEntries)

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          {bodyParts.map((bodyPart, index) => (
            <th key={index}>{bodyPart}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dates.map((date, dateIndex) => (
          <MeasurementRow date={date} dateIndex={dateIndex} bodyParts={bodyParts} entries={entries}/>
        ))}
      </tbody>
    </table>
  );
};

export default MeasurementTable;
