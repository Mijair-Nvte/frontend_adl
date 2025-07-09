// components/ui/StatusSelectTable.js
import React from "react";
import Select from "react-select";

export default function StatusSelectTable({ value, onChange, options, isLoading }) {
  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "0.5rem",
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
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  };

  const formatOptionLabel = ({ label, color }) => (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
      <span>{label}</span>
    </div>
  );

  return (
    <Select
      options={options}
      value={options.find((opt) => opt.value === value)}
      onChange={onChange} // directo: (selected) => ...
      isLoading={isLoading}
      placeholder="Selecciona estatus..."
      styles={customStyles}
      formatOptionLabel={formatOptionLabel}
        menuPortalTarget={document.body}
    />
  );
}
