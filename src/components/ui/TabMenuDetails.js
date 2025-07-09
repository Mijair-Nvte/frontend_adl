"use client";
import React from "react";

export default function TabMenuDetails({ tabs, activeTab, setActiveTab, className = "" }) {
  return (
    <div className={`flex gap-4 border-b pb-3 mb-4 ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab}
          className={`text-sm font-medium transition 
            ${activeTab === tab ? "text-blue-700 border-b-2 border-blue-700 pb-2" : "text-gray-600 hover:text-blue-600"}
          `}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
