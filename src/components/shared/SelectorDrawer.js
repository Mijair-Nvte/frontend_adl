"use client";

import React from "react";
import Drawer from "@/components/ui/Drawer";
import SelectorList from "@/components/ui/SelectorList";

export default function SelectorDrawer({ isOpen, onClose, title, items, loading, onSelect }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title || "Seleccionar"} size="lg">
      <SelectorList
        items={items}
        onSelect={onSelect}
        loading={loading}
        title={title}
      />
    </Drawer>
  );
}
