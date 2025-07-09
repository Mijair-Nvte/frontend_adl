"use client";

import React from "react";

export default function SelectorList({ items, onSelect, loading, title = "Selecciona un elemento" }) {
  return (
    <div className="space-y-2 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay elementos disponibles.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 cursor-pointer transition"
              onClick={() => onSelect(item)}
            >
              <p className="text-sm font-medium text-gray-800">{item.title || item.name}</p>
              <p className="text-xs text-gray-500">{item.case_number || item.email || ""}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
