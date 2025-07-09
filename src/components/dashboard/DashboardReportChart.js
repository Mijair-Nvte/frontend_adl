'use client';

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function DashboardReportChart({ data = [], availableYears = [], onYearChange }) {
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || new Date().getFullYear());

  useEffect(() => {
    if (onYearChange) {
      onYearChange(selectedYear);
    }
  }, [selectedYear, onYearChange]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6  mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          General statistics
        </h2>
     
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} barGap={8}>
          <defs>
            <linearGradient id="treasuryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="casesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="clientsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            allowDecimals={false}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            allowDecimals={false}
            domain={[0, 'auto']}
          />

          <Tooltip />
          <Legend verticalAlign="top" iconType="circle" />

          <Bar
            yAxisId="right"
            dataKey="treasury"
            barSize={20}
            fill="url(#treasuryGradient)"
            radius={[6, 6, 0, 0]}
            name="Billing"
          />
          <Bar
            yAxisId="left"
            dataKey="cases"
            barSize={20}
            fill="url(#casesGradient)"
            radius={[6, 6, 0, 0]}
            name="Projects"
          />
          <Bar
            yAxisId="left"
            dataKey="clients"
            barSize={20}
            fill="url(#clientsGradient)"
            radius={[6, 6, 0, 0]}
            name="Customer"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
