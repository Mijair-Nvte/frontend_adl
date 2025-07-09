import React from "react";

// Puedes pasar el icono como prop: icon={BarChart2}
export default function IconButton({ icon: Icon, title, className = "", ...props }) {
  return (
    <button
      className={[
        "p-2 text-blue-600 rounded-md border hover:bg-gray-100 transition",
        className
      ].join(" ")}
      title={title}
      {...props}
    >
      {Icon && <Icon size={16} />}
    </button>
  );
}
