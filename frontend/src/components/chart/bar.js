import { useEffect } from "react";
import Chart from "react-apexcharts";

const SimpleBarChart = ({ data }) => {
  const extractMatiere = () => {
    if (data && data.length > 0) {
      return data[0].matiereInfo.map((mat) => mat.matiere);
    }
    return [];
  };

  const extractHPrevue = () => {
    if (data && data.length > 0) {
      return data[0].matiereInfo.map((mat) => mat.hPrevue);
    }
    return [];
  };

  const extractHEffectue = () => {
    if (data && data.length > 0) {
      return data[0].matiereInfo.map((mat) => mat.hEffectue);
    }
    return [];
  };

  if (!data || data.length === 0) {
    return <p className="text-center">Chargement des donnees</p>;
  }

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "30%",

        columnWidth: "20%",
        borderRadius: 6,
        borderRadiusApplication: "end",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: ["#5e60c9ff", "#5bc4c4ff"],
    xaxis: {
      categories: extractMatiere(),
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    legend: {
      position: "bottom",
    },

    tooltip: {
      y: {
        formatter: (val) => `${val} h`,
      },
      theme: "light",
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 5,
    },
  };

  const series = [
    {
      name: "Heures prevues",
      data: extractHPrevue(),
    },
    {
      name: "Heures effectuées",
      data: extractHEffectue(),
    },
  ];

  return <Chart options={options} series={series} type="bar" height={550} />;
};

const DoubleBarChart = () => {
  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "30%",
        columnWidth: "20%",
        borderRadius: 6,
        borderRadiusApplication: "end",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: ["#10b981", "#ff3b55ff"],
    xaxis: {
      categories: [
        "01Jul - 05Jul",
        "08Jul - 13Jul",
        "16Jul - 20Jul",
        "22Jul - 26Jul",
        "28Jul - 31Jul",
      ],
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} h`,
      },
    },
  };

  const series = [
    {
      name: "Programme accompli",
      data: [4, 5, 3, 6, 4],
    },
    {
      name: "Programme annulé",
      data: [3, 4, 2, 5, 4],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={550} />;
};

export default SimpleBarChart;
export { DoubleBarChart };
