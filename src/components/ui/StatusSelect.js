import React from "react";
import Select from "react-select";

export default function StatusSelect({ label, value, onChange, options, isLoading }) {
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#e5e7eb",
      padding: "2px 4px",
      boxShadow: "none",
      ":hover": { borderColor: "#6366f1" },
    }),
    option: (base, { data, isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? `${data.color}22` : "white",
      color: data.color,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.875rem",
      padding: "0.5rem 1rem",
    }),
    singleValue: (base, { data }) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: data.color,
    }),
  };

  const formatOptionLabel = ({ label, color }) => (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
      <span>{label}</span>
    </div>
  );

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Select
        options={options}
        value={options.find((opt) => opt.value === value)}
        onChange={(selected) => onChange({ target: { name: "status", value: selected.value } })}
        isLoading={isLoading}
        placeholder="Selecciona estatus..."
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
}
