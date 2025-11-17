const DonutChart = () => {
  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Informatique", "Droit", "Gestion"],
    colors: ["#1E40AF", "#0d9488", "#a855f7"],
    legend: {
      position: "bottom",
    },
  };

  const series = [44, 33, 23];

  return <Chart options={options} series={series} type="donut" height={320} />;
};

export default DonutChart;
