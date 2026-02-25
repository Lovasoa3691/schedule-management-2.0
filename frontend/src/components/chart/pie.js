import React, { useState } from "react";
import Chart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PieCard = ({ semetriel, partiel, hebdomadaire }) => {
  const [startDate, setStartDate] = useState(new Date("2024-11-01"));
  const [endDate, setEndDate] = useState(new Date("2024-12-31"));

  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Hebdomadaire", "Semestriel", "Partiel"],
    colors: ["#1E40AF", "#0d9488", "#a855f7"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
    },
    stroke: {
      colors: ["#fff"],
    },
  };

  const chartSeries = [
    hebdomadaire?.length,
    semetriel?.length,
    partiel?.length,
  ];

  return (
    <div className="bg-white w-full max-w-sm mx-auto">
      {/* <div className=" mb-4">
        <div>
          
          <div className="text-lg text-blue-700 cursor-pointer hover:underline">
            {startDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}{" "}
            -{" "}
            {endDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </div>
        </div>
      </div> */}

      <Chart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        height={300}
      />
    </div>
  );
};

export default PieCard;
