// components/ui/StatusBadge.js
import React from "react";

export default function StatusBadge({ label, color = "#ccc" }) {
  return (
    <div
      className={`py-1.5 px-2.5 rounded-full text-xs font-medium flex items-center gap-2 justify-center w-fit`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      <span className="w-2 h-2 rounded-full bg-current"></span>
      <span className="capitalize">{label}</span>
    </div>
  );
}
