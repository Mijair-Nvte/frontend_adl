"use client";

import React, { useState } from "react";
import CaseTable from "@/components/cases/CaseTable";
import CaseHeader from "@/components/cases/CaseHeader";
import CaseDrawer from "@/components/cases/CaseDrawer";
import useApiCases from "@/hooks/cases/useApiCases";
import CaseCardList from "@/components/cases/mobile/CaseCardList";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const { cases, setCases, fetchCases, loading, error } = useApiCases();
  const [selectedCase, setSelectedCase] = useState(null); // estado para edición

  const handleCreate = () => {
    setSelectedCase(null); // limpiar si es nuevo
    setIsOpen(true);
  };

  const handleEdit = (caseItem) => {
    setSelectedCase(caseItem); // cargar expediente para edición
    setIsOpen(true);
  };

  const handleSearch = (term) => {
    fetchCases({ search: term });
  };

  const handleFilter = (filters) => {
    fetchCases(filters);
  };

  return (
    <div className=" min-h-screen">
      <CaseHeader onCreate={handleCreate} onSearch={handleSearch} onFilter={handleFilter} />
      {/* Desktop table */}
      <div className="hidden md:block">
        <CaseTable
          cases={cases}
          setCases={setCases}
          onEditCase={handleEdit}
          loading={loading}
          error={error}
        />
      </div>

      {/* Mobile cards */}
      <div className="block md:hidden">
        <CaseCardList
          cases={cases}
          setCases={setCases}
          onEditCase={handleEdit}
          loading={loading}
          error={error}
        />
      </div>
      <CaseDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setCases={setCases}
        caseData={selectedCase}
      />
    </div>
  );
}
