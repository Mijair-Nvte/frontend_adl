"use client";

import React, { useState } from "react";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerDrawer from "@/components/customers/CustomerDrawer";
import useApiClients from "@/hooks/clients/useApiClients";
import CustomerCardList from "@/components/customers/mobile/CustomerCardList";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const { clients, setClients, fetchClients, loading, error } = useApiClients();
  const [selectedClient, setSelectedClient] = useState(null); //estado para cargar  el componente para la edicion

  const handleCreate = () => {
    setSelectedClient(null); // limpiar si es nuevo
    setIsOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client); // cargar cliente para edición
    setIsOpen(true);
  };

  const handleSearch = (term) => {
    fetchClients({ search: term });
  };

  const handleFilter = (filters) => {
    fetchClients(filters);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerHeader onCreate={handleCreate} onSearch={handleSearch} onFilter={handleFilter} />
      <div className="hidden md:block">
        <CustomerTable
          clients={clients}
          loading={loading}
          error={error}
          setClients={setClients}
          onEditClient={handleEdit}
        />
      </div>

      <div className="block md:hidden">
        <CustomerCardList
          clients={clients}
          loading={loading}
          error={error}
          setClients={setClients}
          onEditClient={handleEdit}
        />
      </div>
      <CustomerDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setClients={setClients}
        client={selectedClient} // NUEVO
      />
    </div>
  );
}
