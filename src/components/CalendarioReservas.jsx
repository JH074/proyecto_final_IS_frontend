import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isBefore, startOfDay } from "date-fns";

function CalendarioReservas({ fechasOcupadas, selectedDate, onDateChange }) {
  const today = startOfDay(new Date());

  const isDateDisabled = (date) => {
    const formattedDate = startOfDay(date);

    // Deshabilita fechas pasadas
    if (isBefore(formattedDate, today)) return true;

    // Deshabilita fechas ocupadas
    return fechasOcupadas.some(
      (fecha) => startOfDay(new Date(fecha)).getTime() === formattedDate.getTime()
    );
  };

  return (
    <div className="form-control w-full max-w-md">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        filterDate={(date) => !isDateDisabled(date)}
        inline  
        calendarClassName="bg-white p-2 rounded shadow-lg"
      />
    </div>
  );
}

export default CalendarioReservas;
