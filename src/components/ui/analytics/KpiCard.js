import React from "react";
import { FileBarChart2, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

// Puedes pasar icono como prop, por default DollarSign
export default function KpiCard({ label, value, color = "blue", icon: Icon = DollarSign, badge = null, currency = false }) {
  const colorMap = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    teal: "bg-teal-50 text-teal-600",
    orange: "bg-orange-50 text-orange-600",
    violet: "bg-violet-50 text-violet-600",
    cyan: "bg-cyan-50 text-cyan-600",
    gray: "bg-gray-50 text-gray-700"
  };
  return (
    <div className={`rounded-xl border flex flex-col items-center py-6 px-4 relative transition hover:shadow-lg group`}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 ${colorMap[color]} shadow-inner`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="text-xs font-semibold uppercase text-gray-500">{label}</div>
      <div className={`text-2xl font-bold my-1 ${colorMap[color]}`}>
        {currency ? "$" : ""}{Number(value).toLocaleString("en-US")}
      </div>
      {badge &&
        <span className="text-xs mt-1 inline-flex items-center gap-1 font-medium text-green-600">
          <TrendingUp className="w-3 h-3" />{badge}
        </span>
      }
    </div>
  );
}
