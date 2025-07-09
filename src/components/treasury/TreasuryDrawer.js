"use client";
import React from "react";
import Drawer from "@/components/ui/Drawer";
import TreasuryForm from "./TreasuryForm";

export default function TreasuryDrawer({
  isOpen, onClose, setMovements,  movementId = null, fetchMovements,
  clients = [], cases = [], loadingClients, loadingCases,categories = [], paymentMethods = [],
  loadingCategories, loadingPaymentMethods,
}) {
  const title = movementId ? "Editar movimiento" : "Nuevo movimiento";
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <TreasuryForm
        onClose={onClose}
        setMovements={setMovements}
       movementId={movementId}
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
    </Drawer>
  );
}
