import React from "react";

export default function EntityDescription({ text = "Sin descripción" }) {
  return (
    <div className="p-6 text-sm text-gray-700 space-y-3">
      <h3 className="text-base font-semibold text-gray-900">Descripción</h3>
      <p className="flex items-center gap-2">{text}</p>
    </div>
  );
}
