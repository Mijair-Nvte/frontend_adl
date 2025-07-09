"use client";
import React from "react";
import KpiCard from "@/components/ui/analytics/KpiCard";
import ChartDonut from "@/components/ui/analytics/ChartDonut";
import { FileBarChart2, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import useApiTreasuryMovements from "@/hooks/treasury/useApiTreasuryMovements";



export default function TreasuryAnalytics() {
  const { movements, loading } = useApiTreasuryMovements();
  const data = Array.isArray(movements) ? movements : [];

  // KPIs
  const totalIngresos = data.filter(d => d.type === "income").reduce((acc, mov) => acc + Number(mov.amount), 0);
  const totalEgresos = data.filter(d => d.type === "expense").reduce((acc, mov) => acc + Number(mov.amount), 0);

  // Ejemplo de badge
  const progress = "+8.2%";

  return (
    <div className="space-y-8">
      {/* Welcome Panel + KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
        <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Total Incomes" value={totalIngresos} color="green" currency icon={TrendingUp} badge={progress} />
          <KpiCard label="Total Expenses" value={totalEgresos} color="red" currency icon={TrendingDown} badge={progress} />
        </div>
      </div>
      {/* Chart section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Incomes vs Expenses</h3>
          <button className="bg-gray-50 border px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <svg width="16" height="16" fill="none"><path d="M4 7V5a4 4 0 0 1 8 0v2m1 0V5a5 5 0 0 0-10 0v2m9 0a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1h10z" stroke="#888" strokeWidth="1.5" /></svg>
            Select Date
          </button>
        </div>
        <ChartDonut
          labels={["Incomes", "Expenses"]}
          series={[totalIngresos, totalEgresos]}
          colors={["#34d399", "#f87171"]}
        />
      </div>
    </div>
  );
}
