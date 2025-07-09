'use client';

import React from 'react';

export default function StatsCard({
  icon,
  label,
  value,
  progress = null,
  trend = 'up',
  colorClass = 'text-green-600',
}) {
  const isUp = trend === 'up';

  return (
    <div className="relative p-5 rounded-xl shadow-sm bg-white  hover:shadow-lg transition">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-50 rounded-full">
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
          {progress && (
            <div className={`flex items-center text-xs font-medium ${colorClass}`}>
              {progress}
              {isUp ? (
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 10l5-5 5 5H5z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 10l5 5 5-5H5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
