'use client';

import { Folder, CheckCircle, DollarSign } from 'lucide-react';
import StatsCard from '../ui/StatsCard';

export default function DashboardStats({ data }) {
  if (!data) return null;

  const stats = [
    {
      icon: <Folder className="w-5 h-5 text-indigo-500" />,
      label: 'Projects',
      value: data.cases_count || 0,
      progress: `${Math.abs(data.cases_growth || 0)}% ${data.cases_trend === 'up' ? 'aumento' : 'disminución'}`,
      trend: data.cases_trend || 'up',
      colorClass: data.cases_trend === 'down' ? 'text-red-600' : 'text-green-600'
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-indigo-500" />,
      label: 'Customers',
      value: data.clients_count || 0,
      progress: `${Math.abs(data.clients_growth || 0)}% ${data.clients_trend === 'up' ? 'aumento' : 'disminución'}`,
      trend: data.clients_trend || 'up',
      colorClass: data.clients_trend === 'down' ? 'text-red-600' : 'text-green-600'
    },
    {
      icon: <DollarSign className="w-5 h-5 text-indigo-500" />,
      label: 'Billig',
      value: `$${parseFloat(data.treasury_total || 0).toFixed(2)}`,
      progress: `${Math.abs(data.treasury_growth || 0)}% ${data.treasury_trend === 'up' ? 'aumento' : 'disminución'}`,
      trend: data.treasury_trend || 'up',
      colorClass: data.treasury_trend === 'down' ? 'text-red-600' : 'text-green-600'
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>
    </div>
  );
}
