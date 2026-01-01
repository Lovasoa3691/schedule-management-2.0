const LineCard = () => {
  const options = {
    chart: {
      type: "line",
    },
    xaxis: {
      categories: ["Jan", "Fév", "Mars", "Avr"],
    },
  };

  const series = [
    {
      name: "Nombre d'étudiants",
      data: [100, 120, 150, 130],
    },
  ];

  return <Chart options={options} series={series} type="line" height={300} />;
};

export default LineCard;
