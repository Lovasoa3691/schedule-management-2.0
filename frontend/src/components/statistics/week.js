import { useState } from "react";
import Select from "react-select";
import { DoubleBarChart } from "../chart/bar";
import MonthPicker from "../customDate/monthPicker";

const Week = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="teacher-hour-container h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Statistiques des emplois du temps
          </h2>
          <p className="text-sm text-gray-500">
            Analyse hebdomadaire de la répartition des cours sur le mois
            sélectionné
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <MonthPicker selectedDate={selectedDate} onChange={setSelectedDate} />
        </div>
      </div>

      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        {/* <MonthPicker selectedDate={selectedDate} onChange={setSelectedDate} /> */}

        <DoubleBarChart />
      </div>
    </div>
  );
};

export default Week;
