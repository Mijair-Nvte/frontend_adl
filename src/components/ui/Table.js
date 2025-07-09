// components/ui/Table.js
"use client";

import React from "react";

export default function Table({ columns = [], data = [], isLoading, error, checkbox = false }) {
  if (isLoading) return <p className="text-center py-4">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500 py-4">Error al cargar datos.</p>;

  return (
    <div className="overflow-x-auto w-full  rounded-xl border ">
      <table className="min-w-full table-auto rounded-xl">

        <thead>
          <tr className="bg-white border-b ">
            {checkbox && (
              <th className="p-5 text-left text-sm font-semibold text-gray-900">
                <input type="checkbox" className="w-5 h-5 border border-gray-300 border-dashed rounded-md" />
              </th>
            )}
            {columns.map((col, i) => (
              <th key={i} className="p-5 text-left text-sm font-semibold text-gray-900">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 ">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="bg-white hover:bg-indigo-50 transition-all duration-300">
              {checkbox && (
                <td className="p-5">
                  <input type="checkbox" className="w-5 h-5 border border-dashed border-gray-300 rounded-md" />
                </td>
              )}
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-5 text-gray-900 text-sm">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
