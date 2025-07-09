// components/customers/CustomerDrawer.js
"use client";

import React from "react";
import Drawer from "@/components/ui/Drawer";
import CustomerForm from "./CustomerForm";

export default function CustomerDrawer({ isOpen, onClose, setClients, client = null, onSaved }) {
  const title = client ? "Editar cliente" : "Nuevo cliente";

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <CustomerForm
        onClose={onClose}
        setClients={setClients}
        client={client}
        onSaved={onSaved}
        
      />
    </Drawer>
  );
}
