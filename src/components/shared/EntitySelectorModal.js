"use client";

import Modal from "@/components/ui/Modal";
import MultiSelect from "@/components/ui/MultiSelect";

export default function EntitySelectorModal({
  title = "Seleccionar elemento",
  isOpen,
  onClose,
  items = [],
  isLoading = false,
  onSelect,
  isMulti = false,
  placeholder = "Buscar...",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4">
        <MultiSelect
          label={null}
          name="entity-selector"
          isMulti={isMulti}
          options={items}
          isLoading={isLoading}
          placeholder={placeholder}
          onChange={(selected) => {
            if (!selected) return;
            onSelect(isMulti ? selected : selected.value);
            onClose(); // opcional: cerrar automáticamente
          }}
        />
      </div>
    </Modal>
  );
}
