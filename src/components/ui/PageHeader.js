// components/ui/PageHeader.js
import React from "react";

export default function PageHeader({ title, subtitle, actions = [], children }) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg mb-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {/* Acciones de iconos */}
        {actions.map((action, i) => (
          <React.Fragment key={i}>{action}</React.Fragment>
        ))}
        {/* Children puede ser el botón de acción */}
        {children}
      </div>
    </div>
  );
}
