import dynamic from "next/dynamic";
import React from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ChartDonut({ labels, series, colors }) {
  const options = {
    chart: { type: "donut" },
    labels,
    colors,
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    stroke: { width: 2 },
    tooltip: { y: { formatter: val => "$" + Number(val).toLocaleString("en-US") } },
  };

  return (
    <div className="flex items-center justify-center w-full">
      <ApexChart options={options} series={series} type="donut" width={"100%"} height={340} />
    </div>
  );
}
