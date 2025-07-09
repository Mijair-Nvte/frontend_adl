"use client";

import React from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Puedes limitar el rango de páginas que se muestran si hay muchas
  const getPageNumbers = () => {
    const delta = 2; // páginas antes y después
    const range = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className={`flex items-center justify-center gap-1 mt-4 select-none ${className}`}>
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        Anterior
      </button>
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border text-sm ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
