import React from "react";

export default function EntityDetailsLayout({ leftPanel, rightPanel }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Panel izquierdo */}
        <div className="lg:w-1/3 border rounded-xl bg-white overflow-hidden">
          {leftPanel}
        </div>

        {/* Panel derecho */}
        <div className="lg:w-2/3 border rounded-xl bg-white p-6">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}