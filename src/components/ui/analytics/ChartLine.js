"use client";
import dynamic from "next/dynamic";
import React from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ChartLine({ series, categories, colors }) {
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories,
      labels: { style: { fontSize: "13px" } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: { strokeDashArray: 5, borderColor: "#e5e7eb" },
    colors,
    legend: { show: true, position: "top" },
    tooltip: {
      y: { formatter: val => "$" + Number(val).toLocaleString("en-US") }
    },
  };

  return (
    <div className="w-full">
      <ApexChart options={options} series={series} type="line" height={320} />
    </div>
  );
}
