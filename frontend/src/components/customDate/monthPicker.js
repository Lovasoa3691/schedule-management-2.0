import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { FiCalendar } from "react-icons/fi";
import { format } from "date-fns";

registerLocale("fr", fr);

const MonthPicker = ({ selectedDate, onChange }) => {
  return (
    <div className="relative flex items-center bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 shadow-sm w-fit">
      <FiCalendar className="text-indigo-600 text-xl mr-2" />
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        locale="fr"
        className="bg-transparent focus:outline-none text-indigo-800 font-medium cursor-pointer"
      />
    </div>
  );
};

export default MonthPicker;
