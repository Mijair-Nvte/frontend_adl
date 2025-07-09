"use client";
import React from "react";
import { Plus, BarChart2,Filter } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import IconButton from "@/components/ui/IconButton";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import FilterDropdown from '@/components/ui/FilterDropdown';
import TreasuryFilterPanel from "./TreasuryFilterPanel";
import { useState } from "react";
import Input from "../ui/Input";

export default function TreasuryHeader({ onCreate, onSearch,onFilter }) {

    const [search, setSearch] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch(search);
    };


  return (
   <PageHeader
         title="Tesoreria"
         subtitle="Inicio / Tesoreria"
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
                 <TreasuryFilterPanel onApply={(filters) => { onFilter(filters); }} />

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
           Nuevo registro
         </Button>
       </PageHeader>
  );
}
