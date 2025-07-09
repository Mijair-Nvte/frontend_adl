"use client";

import React, { useState } from "react";
import TreasuryTable from "@/components/treasury/TreasuryTable";
import TreasuryHeader from "@/components/treasury/TreasuryHeader";
import TreasuryDrawer from "@/components/treasury/TreasuryDrawer";
import useApiTreasuryMovements from "@/hooks/treasury/useApiTreasuryMovements";
import useApiClients from "@/hooks/clients/useApiClients";
import useApiCases from "@/hooks/cases/useApiCases";
import useApiTreasuryCategories from "@/hooks/treasury/useApiTreasuryCategories";
import useApiTreasuryPaymentMethods from "@/hooks/treasury/useApiTreasuryPaymentMethods";
import TreasuryCardList from "@/components/treasury/mobile/TreasuryCardList";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  const [editingMovementId, setEditingMovementId] = useState(null); // Solo guardas el ID

  const { movements, setMovements, fetchMovements, loading, error } = useApiTreasuryMovements();
  const { clients, loading: loadingClients } = useApiClients();
  const { cases, loading: loadingCases } = useApiCases();

  const { categories, loading: loadingCategories } = useApiTreasuryCategories();
  const { paymentMethods, loading: loadingPaymentMethods } = useApiTreasuryPaymentMethods();


  const handleCreate = () => {
    setEditingMovementId(null);
    setIsOpen(true);
  };

  const handleEdit = (movement) => {
    setEditingMovementId(movement.id); // Solo ID
    setIsOpen(true);
  };

  const handleSearch = (term) => {
    fetchMovements({ search: term });
  };

  const handleFilter = (filters) => {
    fetchMovements(filters);
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      <TreasuryHeader onCreate={handleCreate} onSearch={handleSearch} onFilter={handleFilter} />
  
      <div className="hidden md:block">
        <TreasuryTable
          movements={movements}
          loading={loading}
          error={error}
          setMovements={setMovements}
          onEditMovement={handleEdit}
        />
      </div>

  
      <div className="block md:hidden">
        <TreasuryCardList
          movements={movements}
          setMovements={setMovements}
          onEditMovement={handleEdit}
          onViewMovement={(id) => console.log(`Ver movimiento ${id}`)} // Puedes cambiar por router.push()
        />
      </div>
      <TreasuryDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setMovements={setMovements}
        movementId={editingMovementId}
        fetchMovements={fetchMovements}
        clients={clients}
        cases={cases}
        loadingClients={loadingClients}
        loadingCases={loadingCases}
        categories={categories}
        paymentMethods={paymentMethods}
        loadingCategories={loadingCategories}
        loadingPaymentMethods={loadingPaymentMethods}
      />
    </div>
  );
}
