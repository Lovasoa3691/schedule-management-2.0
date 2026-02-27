import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

<DatePicker
  label="Choisir une semaine"
  value={value}
  onChange={(newValue) => {
    const week = newValue.week();
    const year = newValue.year();
    console.log("Semaine:", week, "Année:", year);
  }}
  views={["year", "day"]}
/>