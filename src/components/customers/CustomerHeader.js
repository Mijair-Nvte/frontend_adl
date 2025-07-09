
// 2. Modifica CustomerHeader para abrir el modal en lugar de navegar
"use client";

import React from "react";
import { Plus, Filter, BarChart2 } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import PageHeader from "@/components/ui/PageHeader";
import FilterDropdown from '@/components/ui/FilterDropdown';
import { Search } from "lucide-react";
import CustomerFilterPanel from "./CustomerFilterPanel";
import { useState } from "react";
import Input from "../ui/Input";

export default function CustomerHeader({ onCreate, onSearch, onFilter }) {
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <PageHeader
      title="Directorios"
      subtitle="Panel/ Directorios"
      actions={[
        <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-2" key="search">
          <Input
            type="text"
            placeholder="Buscar proyecto o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <IconButton icon={Search} title="Buscar" />
        </form>,
        <FilterDropdown key="filter">
          <CustomerFilterPanel onApply={(filters) => {
            onFilter(filters);
          }} />
        </FilterDropdown>,
      ]}
    >
      {/* Botón principal a la derecha */}
      <Button
        variant="primary"
        size="md"
        icon={Plus}
        onClick={onCreate}
      >
        Nueva Directorio
      </Button>
    </PageHeader>
  );
}